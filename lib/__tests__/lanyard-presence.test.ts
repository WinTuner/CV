import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";

const DISCORD_ID = "876802812510613546";

const basePresence = {
	discord_status: "online" as const,
	discord_user: {
		username: "wintuner",
		global_name: "WinTuner",
		avatar: "abc",
		id: DISCORD_ID,
	},
	activities: [],
	listening_to_spotify: false,
};

/**
 * Minimal controllable WebSocket for driving the shared Lanyard socket
 * through handshake / events / close without a real network.
 */
class FakeWebSocket {
	static instances: FakeWebSocket[] = [];
	static CONNECTING = 0;
	static OPEN = 1;
	static CLOSING = 2;
	static CLOSED = 3;

	url: string;
	readyState = FakeWebSocket.CONNECTING;
	onopen: (() => void) | null = null;
	onmessage: ((event: { data: string }) => void) | null = null;
	onclose: (() => void) | null = null;
	onerror: (() => void) | null = null;
	sent: string[] = [];

	constructor(url: string) {
		this.url = url;
		FakeWebSocket.instances.push(this);
	}

	send(data: string) {
		this.sent.push(data);
	}

	close() {
		this.readyState = FakeWebSocket.CLOSED;
		this.onclose?.();
	}

	/** Test helper: transition to OPEN. */
	open() {
		this.readyState = FakeWebSocket.OPEN;
		this.onopen?.();
	}

	/** Test helper: deliver a server payload. */
	receive(payload: unknown) {
		this.onmessage?.({ data: JSON.stringify(payload) });
	}

	/** Test helper: full Lanyard handshake (Hello) + subscription frame. */
	handshake() {
		this.open();
		this.receive({ op: 1, d: { heartbeat_interval: 40_000 } });
	}
}

function lastSocket() {
	return FakeWebSocket.instances[FakeWebSocket.instances.length - 1];
}

beforeEach(() => {
	// Fresh module state per test — the socket singleton lives at module
	// scope and must not leak between tests.
	vi.resetModules();
	vi.stubGlobal("WebSocket", FakeWebSocket);
	vi.useFakeTimers();
});

afterEach(() => {
	vi.unstubAllGlobals();
	vi.useRealTimers();
	FakeWebSocket.instances = [];
});

describe("subscribeLanyardPresence", () => {
	it("opens one socket and reports connecting before the handshake", async () => {
		const { subscribeLanyardPresence } = await import(
			"@/lib/lanyard-presence"
		);
		const listener = vi.fn();
		const unsubscribe = subscribeLanyardPresence(DISCORD_ID, listener);

		expect(FakeWebSocket.instances).toHaveLength(1);
		expect(lastSocket().url).toBe("wss://api.lanyard.rest/socket");
		expect(listener).toHaveBeenLastCalledWith({
			presence: null,
			status: "connecting",
		});

		unsubscribe();
	});

	it("subscribes after Hello and broadcasts presence to every listener", async () => {
		const { subscribeLanyardPresence } = await import(
			"@/lib/lanyard-presence"
		);
		const first = vi.fn();
		const second = vi.fn();
		subscribeLanyardPresence(DISCORD_ID, first);
		subscribeLanyardPresence(DISCORD_ID, second);

		const ws = lastSocket();
		ws.handshake();

		// One subscription frame — the socket is shared, no duplicates.
		expect(ws.sent).toEqual([
			JSON.stringify({ op: 2, d: { subscribe_to_id: DISCORD_ID } }),
		]);

		first.mockClear();
		second.mockClear();
		ws.receive({ op: 0, t: "INIT_STATE", d: basePresence });

		expect(first).toHaveBeenLastCalledWith({
			presence: basePresence,
			status: "connected",
		});
		expect(second).toHaveBeenLastCalledWith({
			presence: basePresence,
			status: "connected",
		});
	});

	it("shares one socket and closes it only when the last subscriber leaves", async () => {
		const { subscribeLanyardPresence } = await import(
			"@/lib/lanyard-presence"
		);
		const unsubA = subscribeLanyardPresence(DISCORD_ID, vi.fn());
		const unsubB = subscribeLanyardPresence(DISCORD_ID, vi.fn());

		expect(FakeWebSocket.instances).toHaveLength(1);
		const ws = lastSocket();
		ws.handshake();

		unsubA();
		expect(ws.readyState).toBe(FakeWebSocket.OPEN); // still one subscriber

		unsubB();
		expect(ws.readyState).toBe(FakeWebSocket.CLOSED); // last one leaves
	});

	it("reports not-monitored for UNKNOWN_PRESENCE", async () => {
		const { subscribeLanyardPresence } = await import(
			"@/lib/lanyard-presence"
		);
		const listener = vi.fn();
		subscribeLanyardPresence(DISCORD_ID, listener);
		const ws = lastSocket();
		ws.handshake();
		listener.mockClear();

		ws.receive({ op: 0, t: "UNKNOWN_PRESENCE", d: {} });

		expect(listener).toHaveBeenLastCalledWith({
			presence: null,
			status: "not-monitored",
		});
	});

	it("reconnects with exponential backoff after the socket closes", async () => {
		const { subscribeLanyardPresence } = await import(
			"@/lib/lanyard-presence"
		);
		subscribeLanyardPresence(DISCORD_ID, vi.fn());
		const ws = lastSocket();
		ws.handshake();
		expect(FakeWebSocket.instances).toHaveLength(1);

		ws.close();
		expect(FakeWebSocket.instances).toHaveLength(1); // not yet reconnected

		vi.advanceTimersByTime(5_000); // first backoff delay

		expect(FakeWebSocket.instances).toHaveLength(2);
		expect(lastSocket().readyState).toBe(FakeWebSocket.CONNECTING);
	});

	it("times out a stalled handshake and retries", async () => {
		const { subscribeLanyardPresence } = await import(
			"@/lib/lanyard-presence"
		);
		subscribeLanyardPresence(DISCORD_ID, vi.fn());
		const ws = lastSocket();
		expect(ws.readyState).toBe(FakeWebSocket.CONNECTING);

		// Server never sends Hello — the 15s handshake timeout closes the
		// socket instead of leaving the UI on "connecting…" forever.
		vi.advanceTimersByTime(15_000);
		expect(ws.readyState).toBe(FakeWebSocket.CLOSED);

		vi.advanceTimersByTime(5_000); // first backoff delay
		expect(FakeWebSocket.instances).toHaveLength(2);
	});

	it("surfaces an error after the backoff cap but keeps slow-retrying", async () => {
		const { subscribeLanyardPresence } = await import(
			"@/lib/lanyard-presence"
		);
		const listener = vi.fn();
		subscribeLanyardPresence(DISCORD_ID, listener);

		// 8 failed attempts: backoff delays 5s, 10s, 20s, then 30s (capped).
		for (let attempt = 0; attempt < 8; attempt++) {
			lastSocket().close();
			const delay = Math.min(30_000, 5_000 * 2 ** attempt);
			vi.advanceTimersByTime(delay);
		}
		expect(FakeWebSocket.instances).toHaveLength(9);

		// The 9th failure crosses the cap → error is surfaced to the UI.
		lastSocket().close();
		expect(listener).toHaveBeenCalledWith(
			expect.objectContaining({ status: "error" }),
		);

		// But recovery is still attempted on a slow 60s timer.
		vi.advanceTimersByTime(60_000);
		expect(FakeWebSocket.instances).toHaveLength(10);
	});

	it("gives late subscribers the current connected snapshot immediately", async () => {
		const { subscribeLanyardPresence } = await import(
			"@/lib/lanyard-presence"
		);
		subscribeLanyardPresence(DISCORD_ID, vi.fn());
		const ws = lastSocket();
		ws.handshake();
		ws.receive({ op: 0, t: "INIT_STATE", d: basePresence });

		const late = vi.fn();
		subscribeLanyardPresence(DISCORD_ID, late);

		expect(late).toHaveBeenLastCalledWith({
			presence: basePresence,
			status: "connected",
		});
	});
});

describe("useLanyardPresence", () => {
	it("subscribes on mount and closes the shared socket on unmount", async () => {
		const { useLanyardPresence } = await import("@/lib/lanyard-presence");
		const { result, unmount } = renderHook(() => useLanyardPresence());

		expect(FakeWebSocket.instances).toHaveLength(1);

		const ws = lastSocket();
		ws.handshake();

		act(() => {
			ws.receive({
				op: 0,
				t: "PRESENCE_UPDATE",
				d: { ...basePresence, discord_status: "dnd" },
			});
		});

		expect(result.current.status).toBe("connected");
		expect(result.current.presence?.discord_status).toBe("dnd");

		unmount();
		expect(ws.readyState).toBe(FakeWebSocket.CLOSED);
	});
});

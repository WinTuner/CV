import { useCallback, useSyncExternalStore } from "react";
import { DISCORD_ID, type LanyardPresence } from "./lanyard";

/**
 * Shared live-presence connection for the Discord profile card and the
 * Spotify player.
 *
 * Instead of each widget opening its own Lanyard WebSocket (or worse,
 * polling the REST API), this module keeps ONE socket alive and
 * ref-counts its subscribers:
 *  - the socket opens when the first widget subscribes,
 *  - presence updates fan out to every subscriber on the same tick,
 *  - the socket closes when the last subscriber leaves.
 *
 * Reconnects use the same exponential backoff (5s → 10s → … capped at
 * 30s, 8 attempts) that the old inline player used.
 */

export type PresenceStatus =
	| "connecting"
	| "connected"
	| "not-monitored"
	| "error";

export interface LanyardUpdate {
	presence: LanyardPresence | null;
	status: PresenceStatus;
	error?: string;
}

const LANYARD_WS_URL = "wss://api.lanyard.rest/socket";
const MAX_RECONNECT_ATTEMPTS = 8;
const HANDSHAKE_TIMEOUT_MS = 15_000;
const SLOW_RETRY_MS = 60_000;

type Listener = (update: LanyardUpdate) => void;

let socket: WebSocket | null = null;
const listeners = new Set<Listener>();
let currentUserId: string | null = null;
let currentUpdate: LanyardUpdate = { presence: null, status: "connecting" };
let heartbeatTimer: ReturnType<typeof setInterval> | null = null;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let handshakeTimer: ReturnType<typeof setTimeout> | null = null;
let retries = 0;

function emit() {
	for (const listener of listeners) {
		listener(currentUpdate);
	}
}

function setUpdate(patch: Partial<LanyardUpdate>) {
	currentUpdate = { ...currentUpdate, ...patch };
	emit();
}

function disconnect() {
	if (heartbeatTimer) {
		clearInterval(heartbeatTimer);
		heartbeatTimer = null;
	}
	if (reconnectTimer) {
		clearTimeout(reconnectTimer);
		reconnectTimer = null;
	}
	if (handshakeTimer) {
		clearTimeout(handshakeTimer);
		handshakeTimer = null;
	}
	if (socket) {
		// Detach handlers so the close does not schedule a reconnect.
		socket.onmessage = null;
		socket.onclose = null;
		socket.onerror = null;
		socket.close();
		socket = null;
	}
	retries = 0;
}

function connect(userId: string) {
	currentUserId = userId;

	// Already live (or handshake in flight) — reuse the existing socket.
	if (
		socket &&
		(socket.readyState === WebSocket.OPEN ||
			socket.readyState === WebSocket.CONNECTING)
	) {
		return;
	}

	// Stale socket in CLOSING/CLOSED state — drop it and start fresh.
	if (socket) {
		socket = null;
	}

	setUpdate({ status: "connecting", error: undefined });
	socket = new WebSocket(LANYARD_WS_URL);

	// If the server never sends Hello (network blackhole, WS blocked by a
	// proxy), close the socket so the reconnect path takes over instead of
	// showing "connecting…" forever.
	handshakeTimer = setTimeout(() => {
		socket?.close();
	}, HANDSHAKE_TIMEOUT_MS);

	socket.onmessage = (event) => {
		let payload: { op?: number; t?: string; d?: unknown };
		try {
			payload = JSON.parse(event.data);
		} catch {
			return;
		}

		// op 1 = Hello — start the heartbeat and subscribe to the user.
		if (payload.op === 1) {
			if (handshakeTimer) {
				clearTimeout(handshakeTimer);
				handshakeTimer = null;
			}
			retries = 0; // healthy handshake — reset the reconnect budget
			const interval = (payload.d as { heartbeat_interval?: number })
				?.heartbeat_interval ?? 40_000;
			heartbeatTimer = setInterval(() => {
				if (socket && socket.readyState === WebSocket.OPEN) {
					socket.send(JSON.stringify({ op: 3 }));
				}
			}, interval);

			if (socket && socket.readyState === WebSocket.OPEN) {
				socket.send(
					JSON.stringify({
						op: 2,
						d: { subscribe_to_id: currentUserId },
					}),
				);
			}
		}

		// op 0 = Event — presence data or a monitoring failure.
		if (payload.op === 0) {
			if (payload.t === "INIT_STATE" || payload.t === "PRESENCE_UPDATE") {
				setUpdate({
					presence: payload.d as LanyardPresence,
					status: "connected",
					error: undefined,
				});
			} else if (payload.t === "UNKNOWN_PRESENCE") {
				setUpdate({
					presence: null,
					status: "not-monitored",
					error: undefined,
				});
			}
		}
	};

	socket.onclose = () => {
		if (heartbeatTimer) {
			clearInterval(heartbeatTimer);
			heartbeatTimer = null;
		}
		if (handshakeTimer) {
			clearTimeout(handshakeTimer);
			handshakeTimer = null;
		}
		socket = null;

		// Back off (5s → 10s → 20s → … capped at 30s). After the fast budget
		// is exhausted, surface the failure to the UI but keep probing on a
		// slow timer so a recovered network reconnects by itself.
		retries += 1;
		if (retries === MAX_RECONNECT_ATTEMPTS + 1) {
			setUpdate({
				presence: null,
				status: "error",
				error: "Live presence unavailable — reconnecting…",
			});
		}
		const delay =
			retries <= MAX_RECONNECT_ATTEMPTS
				? Math.min(30_000, 5_000 * 2 ** (retries - 1))
				: SLOW_RETRY_MS;
		reconnectTimer = setTimeout(() => connect(userId), delay);
	};

	socket.onerror = () => {
		socket?.close();
	};
}

/**
 * Subscribe to live Lanyard presence. Returns an unsubscribe function.
 *
 * The first subscriber opens the shared socket; the last one to leave
 * closes it. New subscribers immediately receive the current snapshot so
 * a late-mounting widget never shows a stale "connecting" state.
 */
export function subscribeLanyardPresence(
	userId: string,
	listener: Listener,
): () => void {
	listeners.add(listener);

	if (currentUserId && currentUserId !== userId) {
		disconnect();
	}
	if (!socket) {
		connect(userId);
	}

	// Snapshot for late subscribers (and a fast "connecting" first paint).
	listener(currentUpdate);

	return () => {
		listeners.delete(listener);
		if (listeners.size === 0) {
			disconnect();
		}
	};
}

/**
 * React binding over {@link subscribeLanyardPresence}. Safe to call from
 * multiple widgets — they share one underlying socket.
 *
 * Implemented with `useSyncExternalStore` so the socket module stays the
 * single source of truth: every widget reads the same snapshot, and the
 * store notifies React only when the presence actually changes.
 */
export function useLanyardPresence(
	userId: string = DISCORD_ID,
): LanyardUpdate {
	const subscribe = useCallback(
		(callback: () => void) => subscribeLanyardPresence(userId, callback),
		[userId],
	);

	return useSyncExternalStore(
		subscribe,
		() => currentUpdate,
		() => currentUpdate,
	);
}

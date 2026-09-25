import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useLiveGithubWip } from "@/lib/use-live-github-wip";
import type { WipItem } from "@/lib/github";

const seed: WipItem[] = [
	{
		id: 1,
		name: "Seed",
		description: "seed",
		progress: 10,
		lastUpdated: "2026-09-22T00:00:00Z",
		url: "https://github.com/x/Seed",
		branch: "main",
		commits: 3,
	},
];

const fresh: WipItem[] = [
	{
		id: 2,
		name: "Fresh",
		description: "fresh",
		progress: 80,
		lastUpdated: "2026-09-22T01:00:00Z",
		url: "https://github.com/x/Fresh",
		branch: "main",
		commits: 12,
	},
];

function jsonResponse(body: unknown, status = 200) {
	return new Response(JSON.stringify(body), {
		status,
		headers: { "Content-Type": "application/json" },
	});
}

async function flush() {
	await act(async () => {});
}

beforeEach(() => {
	vi.useFakeTimers();
});

afterEach(() => {
	vi.unstubAllGlobals();
	vi.useRealTimers();
});

describe("useLiveGithubWip", () => {
	it("fetches /api/wip immediately on mount and applies the data", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn(() => Promise.resolve(jsonResponse(fresh))),
		);
		const { result } = renderHook(() => useLiveGithubWip(seed));

		expect(fetch).toHaveBeenCalledWith("/api/wip");
		await flush();
		expect(result.current.wipItems).toEqual(fresh);
		expect(result.current.isLive).toBe(true);
		expect(typeof result.current.updatedAt).toBe("number");
	});

	it("keeps the current list when the response is empty or fails", async () => {
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse([])));
		const { result } = renderHook(() => useLiveGithubWip(seed));

		await flush();
		expect(result.current.wipItems).toEqual(seed);
	});

	it("does not fetch while disabled", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn(() => Promise.resolve(jsonResponse(fresh))),
		);
		const { result } = renderHook(
			({ enabled }: { enabled: boolean }) => useLiveGithubWip(seed, enabled),
			{ initialProps: { enabled: false } },
		);

		expect(fetch).not.toHaveBeenCalled();
		vi.advanceTimersByTime(120_000);
		expect(fetch).not.toHaveBeenCalled();
		expect(result.current.wipItems).toEqual(seed);
		expect(result.current.isLive).toBe(false);
	});

	it("polls for fresh data every 60 seconds", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn(() => Promise.resolve(jsonResponse(fresh))),
		);
		renderHook(() => useLiveGithubWip(seed));
		await flush();
		expect(fetch).toHaveBeenCalledTimes(1);

		await act(async () => {
			vi.advanceTimersByTime(60_000);
		});
		expect(fetch).toHaveBeenCalledTimes(2);
	});
});

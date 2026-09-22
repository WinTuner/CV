import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useLiveGithubContributions } from "@/lib/use-live-github-contributions";
import type { Contributions } from "@/lib/github";

const seed: Contributions = {
	total: 10,
	weeks: [{ days: [{ date: "2026-09-01", count: 2, level: 1 }] }],
};

const fresh: Contributions = {
	total: 42,
	weeks: [{ days: [{ date: "2026-09-22", count: 5, level: 3 }] }],
};

function jsonResponse(body: unknown, status = 200) {
	return new Response(JSON.stringify(body), {
		status,
		headers: { "Content-Type": "application/json" },
	});
}

function stubFetchSuccess() {
	vi.stubGlobal(
		"fetch",
		vi.fn(() => Promise.resolve(jsonResponse(fresh))),
	);
}

/** Flush pending microtasks so fetch().then callbacks run. */
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

describe("useLiveGithubContributions", () => {
	it("fetches /api/contributions immediately on mount and applies the data", async () => {
		stubFetchSuccess();
		const { result } = renderHook(() => useLiveGithubContributions(seed));

		expect(fetch).toHaveBeenCalledWith("/api/contributions");
		await flush();
		expect(result.current.contributions).toEqual(fresh);
		expect(result.current.isLive).toBe(true);
		expect(typeof result.current.updatedAt).toBe("number");
	});

	it("keeps the current calendar when the response is malformed or fails", async () => {
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({ total: 0 })));
		const { result } = renderHook(() => useLiveGithubContributions(seed));

		await flush();
		expect(result.current.contributions).toEqual(seed); // missing weeks is ignored
	});

	it("does not fetch while disabled", async () => {
		stubFetchSuccess();
		const { result } = renderHook(
			({ enabled }: { enabled: boolean }) =>
				useLiveGithubContributions(seed, enabled),
			{ initialProps: { enabled: false } },
		);

		expect(fetch).not.toHaveBeenCalled();
		vi.advanceTimersByTime(120_000);
		expect(fetch).not.toHaveBeenCalled();
		expect(result.current.contributions).toEqual(seed);
		expect(result.current.isLive).toBe(false);
	});

	it("polls for fresh data every 60 seconds", async () => {
		stubFetchSuccess();
		renderHook(() => useLiveGithubContributions(seed));
		await flush();
		expect(fetch).toHaveBeenCalledTimes(1);

		await act(async () => {
			vi.advanceTimersByTime(60_000);
		});
		expect(fetch).toHaveBeenCalledTimes(2);
	});
});

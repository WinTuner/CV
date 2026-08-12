import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useLiveGithubActivity } from "@/lib/use-live-github-activity";
import type { ActivityItem } from "@/lib/github";

const seed: ActivityItem[] = [
	{
		type: "commit",
		project: "Seed",
		message: "Initial seed activity",
		time: "2026-08-12T10:00:00Z",
	},
];

const fresh: ActivityItem[] = [
	{
		type: "commit",
		project: "Fresh",
		message: "Fresh activity from the server",
		time: "2026-08-12T11:00:00Z",
	},
];

function jsonResponse(body: unknown, status = 200) {
	return new Response(JSON.stringify(body), {
		status,
		headers: { "Content-Type": "application/json" },
	});
}

function stubFetchSuccess() {
	// Fresh Response per call — a shared instance would be consumed after
	// the first poll and throw on the second read.
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

describe("useLiveGithubActivity", () => {
	it("fetches /api/activity immediately on mount and applies the data", async () => {
		stubFetchSuccess();
		const { result } = renderHook(() => useLiveGithubActivity(seed));

		expect(fetch).toHaveBeenCalledWith("/api/activity");
		await flush();
		expect(result.current).toEqual(fresh);
	});

	it("keeps the current list when the response is empty or fails", async () => {
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse([])));
		const { result } = renderHook(() => useLiveGithubActivity(seed));

		await flush();
		expect(result.current).toEqual(seed); // empty array is ignored
	});

	it("does not fetch while disabled", async () => {
		stubFetchSuccess();
		const { result } = renderHook(
			({ enabled }: { enabled: boolean }) =>
				useLiveGithubActivity(seed, enabled),
			{ initialProps: { enabled: false } },
		);

		expect(fetch).not.toHaveBeenCalled();
		vi.advanceTimersByTime(60_000);
		expect(fetch).not.toHaveBeenCalled();
		expect(result.current).toEqual(seed);
	});

	it("fetches immediately when enabled flips to true", async () => {
		stubFetchSuccess();
		const { result, rerender } = renderHook(
			({ enabled }: { enabled: boolean }) =>
				useLiveGithubActivity(seed, enabled),
			{ initialProps: { enabled: false } },
		);

		rerender({ enabled: true });
		await flush();

		expect(fetch).toHaveBeenCalledTimes(1);
		expect(result.current).toEqual(fresh);
	});

	it("polls for fresh data every 30 seconds", async () => {
		stubFetchSuccess();
		renderHook(() => useLiveGithubActivity(seed));
		await flush();
		expect(fetch).toHaveBeenCalledTimes(1);

		await act(async () => {
			vi.advanceTimersByTime(30_000);
		});
		expect(fetch).toHaveBeenCalledTimes(2);
	});
});

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useLiveGithubRepos } from "@/lib/use-live-github-repos";
import type { Project } from "@/lib/github";

const seed: Project[] = [
	{
		id: 1,
		title: "Seed",
		description: "seed",
		tags: ["TS"],
		status: "in-progress",
		category: "personal",
		year: "2026",
		stars: 0,
		forks: 0,
		url: "https://github.com/x/Seed",
	},
];

const fresh: Project[] = [
	{
		id: 2,
		title: "Fresh",
		description: "fresh",
		tags: ["TS"],
		status: "shipped",
		category: "personal",
		year: "2026",
		stars: 5,
		forks: 1,
		url: "https://github.com/x/Fresh",
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

describe("useLiveGithubRepos", () => {
	it("fetches /api/repos immediately on mount and applies the data", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn(() => Promise.resolve(jsonResponse(fresh))),
		);
		const { result } = renderHook(() => useLiveGithubRepos(seed));

		expect(fetch).toHaveBeenCalledWith("/api/repos");
		await flush();
		expect(result.current.repos).toEqual(fresh);
		expect(result.current.isLive).toBe(true);
		expect(typeof result.current.updatedAt).toBe("number");
	});

	it("keeps the current list when the response is empty or fails", async () => {
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse([])));
		const { result } = renderHook(() => useLiveGithubRepos(seed));

		await flush();
		expect(result.current.repos).toEqual(seed);
	});

	it("does not fetch while disabled", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn(() => Promise.resolve(jsonResponse(fresh))),
		);
		const { result } = renderHook(
			({ enabled }: { enabled: boolean }) => useLiveGithubRepos(seed, enabled),
			{ initialProps: { enabled: false } },
		);

		expect(fetch).not.toHaveBeenCalled();
		vi.advanceTimersByTime(120_000);
		expect(fetch).not.toHaveBeenCalled();
		expect(result.current.repos).toEqual(seed);
		expect(result.current.isLive).toBe(false);
	});

	it("polls for fresh data every 60 seconds", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn(() => Promise.resolve(jsonResponse(fresh))),
		);
		renderHook(() => useLiveGithubRepos(seed));
		await flush();
		expect(fetch).toHaveBeenCalledTimes(1);

		await act(async () => {
			vi.advanceTimersByTime(60_000);
		});
		expect(fetch).toHaveBeenCalledTimes(2);
	});
});

import { describe, expect, it, vi, afterEach } from "vitest";
import { getRepoContributors } from "@/lib/github";

afterEach(() => {
	vi.unstubAllGlobals();
});

function mockFetch(data: unknown, ok = true, status = 200) {
	vi.stubGlobal(
		"fetch",
		vi.fn().mockResolvedValue({
			ok,
			status,
			statusText: ok ? "OK" : "Error",
			json: () => Promise.resolve(data),
		}),
	);
}

describe("getRepoContributors", () => {
	it("maps contributors and filters out bots", async () => {
		mockFetch([
			{ login: "alice", avatar_url: "https://a/1.png", html_url: "https://github.com/alice", contributions: 42, type: "User" },
			{ login: "dependabot[bot]", avatar_url: "", html_url: "", contributions: 100, type: "Bot" },
			{ login: "bob", avatar_url: "https://a/2.png", html_url: "https://github.com/bob", contributions: 7, type: "User" },
		]);
		const result = await getRepoContributors("tinodin", "AutoOS");
		expect(result).toEqual([
			{ login: "alice", avatarUrl: "https://a/1.png", profileUrl: "https://github.com/alice", contributions: 42 },
			{ login: "bob", avatarUrl: "https://a/2.png", profileUrl: "https://github.com/bob", contributions: 7 },
		]);
	});

	it("rejects invalid owner/repo without fetching", async () => {
		const fetchMock = vi.fn();
		vi.stubGlobal("fetch", fetchMock);
		expect(await getRepoContributors("../etc", "AutoOS")).toEqual([]);
		expect(await getRepoContributors("tinodin", "a/b")).toEqual([]);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it("returns [] on API failure or malformed payload", async () => {
		mockFetch(null, false, 403);
		expect(await getRepoContributors("someowner", "somerepo")).toEqual([]);
		mockFetch({ not: "an array" });
		expect(await getRepoContributors("otherowner", "otherrepo")).toEqual([]);
	});
});

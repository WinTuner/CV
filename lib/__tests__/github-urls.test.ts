import { describe, expect, it } from "vitest";
import {
	CONTRIBUTOR_UPSTREAMS,
	parseGithubRepoUrl,
	resolveContributorSource,
} from "@/lib/github";

describe("parseGithubRepoUrl", () => {
	it("parses owner/repo from standard URLs", () => {
		expect(parseGithubRepoUrl("https://github.com/WinTuner/aim4-mod")).toEqual({
			owner: "WinTuner",
			repo: "aim4-mod",
		});
	});

	it("strips a .git suffix", () => {
		expect(parseGithubRepoUrl("https://github.com/WinTuner/aim4-mod.git")).toEqual({
			owner: "WinTuner",
			repo: "aim4-mod",
		});
	});

	it("rejects non-GitHub hosts, short URLs, and bad input", () => {
		expect(parseGithubRepoUrl("https://gitlab.com/a/b")).toBeNull();
		expect(parseGithubRepoUrl("https://github.com/onlyowner")).toBeNull();
		expect(parseGithubRepoUrl(undefined)).toBeNull();
		expect(parseGithubRepoUrl("not a url")).toBeNull();
	});
});

describe("resolveContributorSource", () => {
	it("prefers the explicit upstream mapping over the project URL", () => {
		for (const [name, upstream] of Object.entries(CONTRIBUTOR_UPSTREAMS)) {
			expect(resolveContributorSource(name, "https://github.com/WinTuner/fork")).toEqual(
				upstream,
			);
		}
		// AutoOS must resolve to tinodin/AutoOS, never the owner's fork.
		expect(resolveContributorSource("AutoOS", "https://github.com/WinTuner/AutoOS")).toEqual({
			owner: "tinodin",
			repo: "AutoOS",
		});
	});

	it("parses the project URL when no upstream mapping exists", () => {
		expect(
			resolveContributorSource("DotDoctor", "https://github.com/WinTuner/DotDoctor"),
		).toEqual({ owner: "WinTuner", repo: "DotDoctor" });
	});

	it("returns null for non-GitHub links such as LINE URLs", () => {
		expect(
			resolveContributorSource("Muanjai", "https://line.me/R/ti/p/%40636owbhl"),
		).toBeNull();
		expect(resolveContributorSource("Muanjai")).toBeNull();
	});
});

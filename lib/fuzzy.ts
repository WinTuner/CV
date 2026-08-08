export interface FuzzyMatch {
	score: number;
	indices: number[];
}

/**
 * Score a `query` against a `target` using subsequence fuzzy matching.
 *
 * Every character of `query` must appear in `target` in order. Bonus points
 * reward contiguous runs, word starts, and leading-character matches; a small
 * penalty is applied for how spread out the match is. Returns `null` when the
 * query is not a subsequence of the target.
 */
export function fuzzyMatch(query: string, target: string): FuzzyMatch | null {
	const q = query.toLowerCase().trim();
	const t = target.toLowerCase();
	if (!q) return null;
	if (q.length > t.length) return null;

	let score = 0;
	let ti = 0;
	let lastIndex = -1;
	let run = 0;
	const indices: number[] = [];

	for (let qi = 0; qi < q.length; qi++) {
		const char = q[qi];
		let found = false;
		for (; ti < t.length; ti++) {
			if (t[ti] === char) {
				if (qi === 0) score += 50;
				if (ti === 0 || t[ti - 1] === " ") score += 30;
				if (lastIndex >= 0 && ti === lastIndex + 1) {
					run += 1;
					score += 10 * run;
				} else {
					run = 0;
					score += 5;
				}
				indices.push(ti);
				lastIndex = ti;
				ti += 1;
				found = true;
				break;
			}
		}
		if (!found) return null;
	}

	// Prefer matches that are compact relative to the target length.
	score -= t.length * 0.2;
	return { score, indices };
}

/** Filter and rank a list of strings against a query. */
export function fuzzySearch<T>(
	query: string,
	items: T[],
	getSearchText: (item: T) => string,
): Array<{ item: T; match: FuzzyMatch }> {
	if (!query.trim()) return [];
	const results: Array<{ item: T; match: FuzzyMatch }> = [];
	for (const item of items) {
		const match = fuzzyMatch(query, getSearchText(item));
		if (match) results.push({ item, match });
	}
	return results
		.sort((a, b) => b.match.score - a.match.score)
		.slice(0, 50);
}

/** Stable slug used for heading anchors. */
export function slugify(input: string): string {
	return input
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\u0e00-\u0e7f]+/g, "-")
		.replace(/(^-|-$)+/g, "");
}

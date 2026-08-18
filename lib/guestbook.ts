import type { GuestbookEntry } from "@/types/guestbook";

const LIST_KEY = "guestbook:entries";
const MAX_ENTRIES = 50;

/**
 * Guestbook persistence is optional: it uses the same Upstash Redis
 * credentials as the newsletter subscription endpoint. When neither
 * UPSTASH_REDIS_REST_URL nor UPSTASH_REDIS_REST_TOKEN is configured,
 * the feature reports 501 and the UI shows a graceful fallback.
 */
export function hasGuestbookBackend(): boolean {
	return Boolean(
		process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
	);
}

async function redisFetch(path: string): Promise<Response> {
	return fetch(`${process.env.UPSTASH_REDIS_REST_URL}${path}`, {
		headers: {
			Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
		},
	});
}

function parseEntry(raw: unknown): GuestbookEntry | null {
	if (typeof raw !== "string") return null;
	try {
		const parsed = JSON.parse(raw) as Partial<GuestbookEntry>;
		if (
			typeof parsed.id !== "string" ||
			typeof parsed.name !== "string" ||
			typeof parsed.message !== "string" ||
			typeof parsed.createdAt !== "string"
		) {
			return null;
		}
		return parsed as GuestbookEntry;
	} catch {
		return null;
	}
}

/** Newest-first list of stored entries (empty when unconfigured). */
export async function getGuestbookEntries(
	limit = MAX_ENTRIES,
): Promise<GuestbookEntry[]> {
	if (!hasGuestbookBackend()) return [];

	try {
		const response = await redisFetch(
			`/lrange/${LIST_KEY}/0/${limit - 1}`,
		);
		if (!response.ok) return [];
		const data = (await response.json()) as { result?: unknown[] };
		if (!Array.isArray(data.result)) return [];
		return data.result
			.map(parseEntry)
			.filter((entry): entry is GuestbookEntry => entry !== null);
	} catch {
		return [];
	}
}

/** Push a new entry to the front of the list, keeping it bounded. */
export async function addGuestbookEntry(
	entry: GuestbookEntry,
): Promise<boolean> {
	if (!hasGuestbookBackend()) return false;

	try {
		const encoded = encodeURIComponent(JSON.stringify(entry));
		const response = await redisFetch(`/lpush/${LIST_KEY}/${encoded}`);
		if (!response.ok) return false;
		await redisFetch(`/ltrim/${LIST_KEY}/0/${MAX_ENTRIES - 1}`);
		return true;
	} catch {
		return false;
	}
}
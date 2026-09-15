/**
 * Shared server-side security helpers (open-source hardening).
 *
 * - `toSafeJsonLd` neutralizes `</script>` breakouts inside JSON-LD blocks.
 * - `checkRateLimit` is a lightweight in-memory throttle for public POST
 *   routes (contact / subscribe). Per-instance memory is fine for a
 *   portfolio; Vercel may run several instances, so treat limits as
 *   best-effort abuse friction, not a hard guarantee.
 */

const buckets = globalThis as unknown as {
	__rateLimitBuckets?: Map<string, number[]>;
};

function getBuckets(): Map<string, number[]> {
	if (!buckets.__rateLimitBuckets) {
		buckets.__rateLimitBuckets = new Map<string, number[]>();
	}
	return buckets.__rateLimitBuckets;
}

export function toSafeJsonLd(data: unknown): string {
	return JSON.stringify(data).replace(/</g, "\\u003c");
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Outbound webhook URLs must be absolute HTTPS URLs. Shared by the
 * contact / subscribe routes — both a sanity check on deployer config
 * and a guard against SSRF-style values pointing at internal addresses.
 */
export function isSafeWebhookUrl(raw: string): boolean {
	try {
		const url = new URL(raw);
		return url.protocol === "https:" && url.hostname.length > 0;
	} catch {
		return false;
	}
}

export function checkRateLimit(
	key: string,
	limit = 5,
	windowMs = 60_000,
): { allowed: boolean; retryAfterSec: number } {
	const now = Date.now();
	const store = getBuckets();
	const hits = (store.get(key) ?? []).filter((t) => now - t < windowMs);
	if (hits.length >= limit) {
		const oldest = hits[0] ?? now;
		return {
			allowed: false,
			retryAfterSec: Math.max(1, Math.ceil((oldest + windowMs - now) / 1000)),
		};
	}
	hits.push(now);
	store.set(key, hits);
	return { allowed: true, retryAfterSec: 0 };
}

export function getClientKey(request: Request): string {
	const forwarded = request.headers.get("x-forwarded-for");
	const ip = forwarded?.split(",")[0]?.trim() || "unknown";
	const url = new URL(request.url);
	return `${ip}:${url.pathname}`;
}

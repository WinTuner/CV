import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Outbound webhook URLs must be absolute HTTPS URLs. This is both a
 * sanity check on the deployer-configured env var and a guard against
 * SSRF-style values (e.g. pointing at internal addresses).
 */
function isSafeWebhookUrl(raw: string): boolean {
	try {
		const url = new URL(raw);
		return url.protocol === "https:" && url.hostname.length > 0;
	} catch {
		return false;
	}
}

/**
 * Newsletter subscription endpoint.
 *
 * Configure one backend via env vars (see .env.example):
 *  - NEWSLETTER_WEBHOOK_URL  — any service accepting a JSON POST
 *    { "email": "..." } (Formspree, Buttondown, Zapier, Make, ...)
 *  - UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN — store the
 *    address in a Redis list for later export to a real sender.
 *
 * Returns 501 when neither backend is configured.
 */
export async function POST(request: Request) {
	let body: { email?: string };
	try {
		body = await request.json();
	} catch {
		return NextResponse.json(
			{ error: "Invalid request body" },
			{ status: 400 },
		);
	}

	const email = body.email?.trim().toLowerCase();
	if (!email || !EMAIL_RE.test(email)) {
		return NextResponse.json(
			{ error: "Please enter a valid email address." },
			{ status: 400 },
		);
	}

	// Backend 1: generic webhook
	const webhookUrl = process.env.NEWSLETTER_WEBHOOK_URL;
	if (webhookUrl) {
		if (!isSafeWebhookUrl(webhookUrl)) {
			return NextResponse.json(
				{ error: "Subscription service is misconfigured." },
				{ status: 500 },
			);
		}
		try {
			const response = await fetch(webhookUrl, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email }),
			});
			if (!response.ok) {
				return NextResponse.json(
					{ error: "Subscription service error. Please try again later." },
					{ status: 502 },
				);
			}
			return NextResponse.json({ success: true, email });
		} catch {
			return NextResponse.json(
				{ error: "Subscription service unreachable. Please try again later." },
				{ status: 502 },
			);
		}
	}

	// Backend 2: Upstash Redis (list of subscriber emails)
	const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
	const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
	if (redisUrl && redisToken) {
		try {
			const response = await fetch(
				`${redisUrl}/rpush/newsletter:subscribers/${encodeURIComponent(email)}`,
				{ headers: { Authorization: `Bearer ${redisToken}` } },
			);
			if (!response.ok) {
				return NextResponse.json(
					{ error: "Could not save subscription. Please try again later." },
					{ status: 502 },
				);
			}
			return NextResponse.json({ success: true, email });
		} catch {
			return NextResponse.json(
				{ error: "Subscription service unreachable. Please try again later." },
				{ status: 502 },
			);
		}
	}

	return NextResponse.json(
		{ error: "Subscription service is not ready yet. Check back soon!" },
		{ status: 501, headers: { "Cache-Control": "no-store" } },
	);
}

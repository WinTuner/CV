import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Contact form endpoint.
 *
 * Configure CONTACT_WEBHOOK_URL (env) to receive submissions — any
 * service accepting a JSON POST of { name, email, message } (Formspree,
 * Zapier, Make, a Slack/Telegram bot, ...). Returns 501 when unset.
 */
function isSafeWebhookUrl(raw: string): boolean {
	try {
		const url = new URL(raw);
		return url.protocol === "https:" && url.hostname.length > 0;
	} catch {
		return false;
	}
}

export async function POST(request: Request) {
	let body: { name?: string; email?: string; message?: string };
	try {
		body = await request.json();
	} catch {
		return NextResponse.json(
			{ error: "Invalid request body" },
			{ status: 400 },
		);
	}

	const name = body.name?.trim();
	const email = body.email?.trim().toLowerCase();
	const message = body.message?.trim();

	if (!name || name.length > 120) {
		return NextResponse.json(
			{ error: "Please enter your name." },
			{ status: 400 },
		);
	}
	if (!email || !EMAIL_RE.test(email)) {
		return NextResponse.json(
			{ error: "Please enter a valid email address." },
			{ status: 400 },
		);
	}
	if (!message || message.length < 10 || message.length > 5000) {
		return NextResponse.json(
			{ error: "Message must be between 10 and 5000 characters." },
			{ status: 400 },
		);
	}

	const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
	if (webhookUrl) {
		if (!isSafeWebhookUrl(webhookUrl)) {
			return NextResponse.json(
				{ error: "Contact service is misconfigured." },
				{ status: 500 },
			);
		}
		try {
			const response = await fetch(webhookUrl, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name, email, message }),
			});
			if (!response.ok) {
				return NextResponse.json(
					{ error: "Could not send the message. Please try again later." },
					{ status: 502 },
				);
			}
			return NextResponse.json({ success: true });
		} catch {
			return NextResponse.json(
				{ error: "Contact service unreachable. Please try again later." },
				{ status: 502 },
			);
		}
	}

	return NextResponse.json(
		{ error: "Contact form is not ready yet. Email me directly instead!" },
		{ status: 501, headers: { "Cache-Control": "no-store" } },
	);
}

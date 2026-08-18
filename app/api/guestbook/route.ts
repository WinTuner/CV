import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { addGuestbookEntry, getGuestbookEntries, hasGuestbookBackend } from "@/lib/guestbook";

export const dynamic = "force-dynamic";

const NAME_MAX = 50;
const MESSAGE_MIN = 2;
const MESSAGE_MAX = 500;
const COOLDOWN_MS = 30_000;

/**
 * Lightweight best-effort rate limiter. Works per process — on a
 * multi-instance deploy it is a speed bump, not a hard guarantee.
 */
const lastPostByIp = new Map<string, number>();

function getClientIp(request: Request): string {
	const forwarded = request.headers.get("x-forwarded-for");
	if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
	return request.headers.get("x-real-ip") ?? "unknown";
}

export async function GET() {
	if (!hasGuestbookBackend()) {
		return NextResponse.json(
			{ error: "Guestbook is not ready yet. Check back soon!" },
			{ status: 501, headers: { "Cache-Control": "no-store" } },
		);
	}
	const entries = await getGuestbookEntries();
	return NextResponse.json({ entries }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
	if (!hasGuestbookBackend()) {
		return NextResponse.json(
			{ error: "Guestbook is not ready yet. Check back soon!" },
			{ status: 501, headers: { "Cache-Control": "no-store" } },
		);
	}

	let body: { name?: string; message?: string; website?: string };
	try {
		body = await request.json();
	} catch {
		return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
	}

	// Honeypot: real visitors never fill this hidden field.
	if (typeof body.website === "string" && body.website.length > 0) {
		return NextResponse.json({ success: true });
	}

	const name = body.name?.trim() ?? "";
	const message = body.message?.trim() ?? "";

	if (name.length === 0 || name.length > NAME_MAX) {
		return NextResponse.json(
			{ error: `Please enter a name (max ${NAME_MAX} characters).` },
			{ status: 400 },
		);
	}
	if (message.length < MESSAGE_MIN || message.length > MESSAGE_MAX) {
		return NextResponse.json(
			{ error: `Message must be ${MESSAGE_MIN}–${MESSAGE_MAX} characters.` },
			{ status: 400 },
		);
	}

	const ip = getClientIp(request);
	const now = Date.now();
	const last = lastPostByIp.get(ip);
	if (last && now - last < COOLDOWN_MS) {
		return NextResponse.json(
			{ error: "Please wait a moment before posting again." },
			{ status: 429 },
		);
	}

	const entry = {
		id: randomUUID(),
		name,
		message,
		createdAt: new Date().toISOString(),
	};

	const saved = await addGuestbookEntry(entry);
	if (!saved) {
		return NextResponse.json(
			{ error: "Could not save your message. Please try again later." },
			{ status: 502 },
		);
	}

	lastPostByIp.set(ip, now);
	return NextResponse.json({ success: true, entry });
}
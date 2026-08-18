import type { Metadata } from "next";
import { Suspense } from "react";
import { SITE_URL } from "@/lib/site";
import { getGuestbookEntries, hasGuestbookBackend } from "@/lib/guestbook";
import { GuestbookContent } from "@/components/public/guestbook/guestbook-content";

export const revalidate = 0;

const baseUrl = SITE_URL;

export const metadata: Metadata = {
	title: "Guestbook",
	description:
		"Leave a message for Thanatphong Tarin (WinTuner). A digital guestbook for visitors of this site.",
	openGraph: {
		title: "Guestbook — WinTuner",
		description: "Leave a message for Thanatphong Tarin (WinTuner).",
		url: `${baseUrl}/guestbook`,
		type: "website",
	},
	alternates: {
		canonical: `${baseUrl}/guestbook`,
	},
};

async function GuestbookList() {
	const [entries, backendReady] = await Promise.all([
		getGuestbookEntries(),
		Promise.resolve(hasGuestbookBackend()),
	]);
	return <GuestbookContent initialEntries={entries} backendReady={backendReady} />;
}

function GuestbookSkeleton() {
	return (
		<section className="px-4 sm:px-6 py-12 sm:py-20">
			<div className="mx-auto max-w-3xl space-y-10 animate-pulse">
				<div className="space-y-4">
					<div className="h-4 w-28 bg-muted rounded-md" />
					<div className="h-10 sm:h-12 w-2/3 max-w-lg bg-muted rounded-md" />
					<div className="h-6 w-full max-w-xl bg-muted rounded-md" />
				</div>
				<div className="h-64 bg-muted/50 rounded-xl" />
				<div className="space-y-4">
					{[1, 2, 3].map((n) => (
						<div key={n} className="h-28 bg-muted/40 rounded-xl" />
					))}
				</div>
			</div>
		</section>
	);
}

export default async function GuestbookPage() {
	return (
		<div id="main" className="pt-24">
			<Suspense fallback={<GuestbookSkeleton />}>
				<GuestbookList />
			</Suspense>
		</div>
	);
}
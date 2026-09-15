import { IntroductionContent } from "@/components/public/introduction/introduction-content";
import { PrintTrigger } from "@/components/public/introduction/print-trigger";
import type { Metadata } from "next";
import { Suspense } from "react";
import { SITE_URL } from "@/lib/site";

const baseUrl = SITE_URL;

export const metadata: Metadata = {
	title: "Resume & Introduction",
	description:
		"Detailed background, qualifications, certifications, achievements, and working experiments of Thanatphong Tarin.",
	openGraph: {
		title: "Resume & Introduction — WinTuner",
		description:
			"Detailed background, qualifications, certifications, achievements, and working experiments of Thanatphong Tarin.",
		url: `${baseUrl}/introduction`,
		type: "profile",
		images: [
			{
				url: `${baseUrl}/og-image.png`,
				width: 1200,
				height: 630,
				alt: "Thanatphong Tarin profile page",
			},
		],
	},
	alternates: {
		canonical: `${baseUrl}/introduction`,
	},
};

export default function IntroductionPage() {
	return (
		<div id="main" className="pt-24">
			{/*
				PrintTrigger reads useSearchParams, so it gets its own tiny
				Suspense boundary — the resume content itself SSRs normally
				and the LCP element stays in the initial HTML.
			*/}
			<Suspense fallback={null}>
				<PrintTrigger />
			</Suspense>
			<IntroductionContent />
		</div>
	);
}

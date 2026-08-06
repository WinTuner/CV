import { IntroductionContent } from "@/components/public/introduction/introduction-content";
import type { Metadata } from "next";
import { Suspense } from "react";
import { cookies } from "next/headers";
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

export default async function IntroductionPage() {
	const cookieStore = await cookies();
	const isThai = cookieStore.get("site-language")?.value === "th";
	return (
		<div id="main" className="pt-24">
			<Suspense
				fallback={
					<div className="min-h-[60vh] flex flex-col items-center justify-center font-mono text-xs text-muted-foreground animate-pulse">
						<span>
							{isThai ? "กำลังโหลดข้อมูลเรซูเม่..." : "Loading resume context..."}
						</span>
					</div>
				}
			>
				<IntroductionContent />
			</Suspense>
		</div>
	);
}

import { IntroductionContent } from "@/components/public/introduction/introduction-content";
import type { Metadata } from "next";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { SITE_URL } from "@/lib/site";
import { isSupportedLanguage } from "@/constants/languages";

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
	const rawLang = cookieStore.get("site-language")?.value;
	const lang = isSupportedLanguage(rawLang) ? rawLang : "en";
	const loadingText =
		lang === "th"
			? "กำลังโหลดข้อมูลเรซูเม่..."
			: lang === "ja"
				? "履歴書を読み込み中..."
				: lang === "zh"
					? "正在加载简历..."
					: "Loading resume context...";
	return (
		<div id="main" className="pt-24">
			<Suspense
				fallback={
					<div className="min-h-[60vh] flex flex-col items-center justify-center font-mono text-xs text-muted-foreground animate-pulse">
						<span>{loadingText}</span>
					</div>
				}
			>
				<IntroductionContent />
			</Suspense>
		</div>
	);
}

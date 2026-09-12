import { MuanjaiContent } from "@/components/public/case-study/muanjai-content";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import { toSafeJsonLd } from "@/lib/security";

const baseUrl = SITE_URL;
const pageUrl = `${baseUrl}/case-study/muanjai`;

export const metadata: Metadata = {
	title: "Muanjai Case Study — Thai RAG, PromptPay & Webhook Hardening",
	description:
		"Deep dive into Muanjai: an AI compliance helper bot with Thai RAG on Pathumma LLM + ThaiSC, real-time PromptPay verification, and a hardened LINE webhook pipeline guarded by 240+ tests.",
	keywords: ["Muanjai", "case study", "RAG", "Thai LLM", "Pathumma", "LINE bot", "PromptPay", "webhook"],
	openGraph: {
		title: "Muanjai Case Study — WinTuner",
		description:
			"Thai RAG on Pathumma LLM, real-time PromptPay verification, and webhook hardening behind a 30s reply SLA.",
		url: pageUrl,
		type: "article",
		images: [
			{
				url: `${baseUrl}/og-image-projects.png`,
				width: 1200,
				height: 630,
				alt: "Muanjai case study",
			},
		],
	},
	alternates: {
		canonical: pageUrl,
	},
};

const structuredData = {
	"@context": "https://schema.org",
	"@type": "TechArticle",
	headline: "Muanjai (ม่วนใจ๋) — AI compliance helper case study",
	description:
		"Thai RAG on Pathumma LLM + ThaiSC, real-time PromptPay verification, and LINE webhook hardening.",
	url: pageUrl,
	author: {
		"@type": "Person",
		name: "Thanatphong Tarin",
		url: baseUrl,
	},
};

export default function MuanjaiCaseStudyPage() {
	return (
		<div id="main" className="pt-24">
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: toSafeJsonLd(structuredData) }}
			/>
			<MuanjaiContent />
		</div>
	);
}

"use client";

import Link from "next/link";
import { useLanguage } from "./language-provider";
import { localePath } from "@/constants/languages";

const STATS = {
	en: [
		{
			value: "Co-Founder & CTO",
			label: "Muanjai — AI compliance helper bot (LINE OA)",
			href: "/case-study/muanjai",
		},
		{
			value: "AutoOS",
			label: "Open-source Windows migration tool (WinUI 3, Native AOT)",
			href: "https://github.com/tinodin/AutoOS",
		},
		{
			value: "SynToolkit",
			label: "Post-install control panel for SynergyOS",
			href: "https://github.com/Synergy-Tweaks/SynToolkit",
		},
		{
			value: "GPA 3.40",
			label: "B.Sc. Digital Industry Integration, CMU (current)",
			href: "/introduction",
		},
	],
	th: [
		{
			value: "Co-Founder & CTO",
			label: "Muanjai — บอทช่วยดูแล compliance ด้วย AI (LINE OA)",
			href: "/case-study/muanjai",
		},
		{
			value: "AutoOS",
			label: "เครื่องมือย้าย Windows แบบโอเพนซอร์ส (WinUI 3, Native AOT)",
			href: "https://github.com/tinodin/AutoOS",
		},
		{
			value: "SynToolkit",
			label: "แผงควบคุมหลังติดตั้งสำหรับ SynergyOS",
			href: "https://github.com/Synergy-Tweaks/SynToolkit",
		},
		{
			value: "GPA 3.40",
			label: "วท.บ. การบูรณาการอุตสาหกรรมดิจิทัล มช. (ปัจจุบัน)",
			href: "/introduction",
		},
	],
	ja: [
		{
			value: "Co-Founder & CTO",
			label: "Muanjai — AIコンプライアンス支援ボット (LINE OA)",
			href: "/case-study/muanjai",
		},
		{
			value: "AutoOS",
			label: "オープンソースWindows移行ツール (WinUI 3、Native AOT)",
			href: "https://github.com/tinodin/AutoOS",
		},
		{
			value: "SynToolkit",
			label: "SynergyOS向けポストインストール・コントロールパネル",
			href: "https://github.com/Synergy-Tweaks/SynToolkit",
		},
		{
			value: "GPA 3.40",
			label: "デジタル産業統合学士課程、チェンマイ大学 (現在)",
			href: "/introduction",
		},
	],
	zh: [
		{
			value: "Co-Founder & CTO",
			label: "Muanjai — AI合规助手 (LINE OA)",
			href: "/case-study/muanjai",
		},
		{
			value: "AutoOS",
			label: "开源Windows迁移工具 (WinUI 3, Native AOT)",
			href: "https://github.com/tinodin/AutoOS",
		},
		{
			value: "SynToolkit",
			label: "面向SynergyOS的安装后控制面板",
			href: "https://github.com/Synergy-Tweaks/SynToolkit",
		},
		{
			value: "GPA 3.40",
			label: "数字产业整合学士，清迈大学 (至今)",
			href: "/introduction",
		},
	],
} as const;

/* ArtCraft-style ticker: mono stack labels with ▪ separators, duplicated for loop. */
const MARQUEE_ITEMS = [
	"Next.js",
	"TypeScript",
	"Agentic AI",
	"RAG · Pathumma LLM",
	"LINE Messaging API",
	"Docker",
	"PostgreSQL · pgvector",
	"Open Source",
] as const;

export function HighlightsStrip() {
	const { language } = useLanguage();

	const items = STATS[language];

	return (
		<>
		<div className="marquee" aria-hidden="true">
			<ul className="marquee-track items-center">
				{[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((label, i) => (
					<li key={i} className="hud-label flex items-center whitespace-nowrap px-6 py-3 text-muted-foreground">
						<span aria-hidden="true" className="mr-6 text-primary">▪</span>
						{label}
					</li>
				))}
			</ul>
		</div>
		<section className="px-4 sm:px-6 py-10 sm:py-14">
			<div className="mx-auto max-w-7xl">
				<div className="grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
					{items.map((stat, index) => {
						const isExternal = stat.href.startsWith("http");
						const className =
							"group flex flex-col gap-1.5 border-t border-border pt-5 transition-colors duration-300 hover:border-primary/50";
						const inner = (
							<>
								<span className="font-mono text-[11px] leading-none text-muted-foreground/70">
									{String(index + 1).padStart(2, "0")}
								</span>
								<span className="font-serif text-2xl font-medium leading-tight tracking-tight text-foreground">
									{stat.value}
								</span>
								<span className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
									{stat.label}
								</span>
							</>
						);
						return isExternal ? (
							<a
								key={stat.label}
								href={stat.href}
								target="_blank"
								rel="noopener noreferrer"
								className={className}
							>
								{inner}
							</a>
						) : (
							<Link
								key={stat.label}
								href={localePath(stat.href, language)}
								className={className}
							>
								{inner}
							</Link>
						);
					})}
				</div>
			</div>
		</section>
		</>
	);
}

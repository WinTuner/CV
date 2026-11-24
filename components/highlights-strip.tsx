"use client";

import Link from "next/link";
import { useLanguage } from "./language-provider";
import { useInView } from "@/lib/use-in-view";
import { localePath } from "@/constants/languages";
import { cn } from "@/lib/utils";

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
	const { ref, isInView } = useInView<HTMLDivElement>({ threshold: 0.2 });

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
			<div ref={ref} className="mx-auto max-w-7xl">
				<div className="grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
					{items.map((stat, index) => {
						const isExternal = stat.href.startsWith("http");
						const className = cn(
							"group flex flex-col gap-2 border-t border-border pt-5 opacity-0 transition-colors duration-300 hover:border-primary/50",
							isInView && "animate-fade-in-up",
						);
						const inner = (
							<>
									<span className="font-mono text-[10px] leading-none text-muted-foreground/50">
										{String(index + 1).padStart(2, "0")}
									</span>
									<span className="font-serif text-2xl font-medium leading-tight tracking-tight text-foreground">
										{stat.value}
									</span>
								<span className="text-[13px] leading-relaxed text-muted-foreground">
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
								style={{ animationDelay: `${(index % 4) * 90 + 100}ms` }}
							>
								{inner}
							</a>
						) : (
							<Link
								key={stat.label}
								href={localePath(stat.href, language)}
								className={className}
								style={{ animationDelay: `${(index % 4) * 90 + 100}ms` }}
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

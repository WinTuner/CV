"use client";

import { useLanguage } from "./language-provider";
import { useInView } from "@/lib/use-in-view";
import { cn } from "@/lib/utils";

const skills = {
	en: [
		{
			category: "Frontend",
			items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Java (OOP)"],
		},
		{
			category: "Backend & AI",
			items: ["Node.js", "Express", "PostgreSQL", "Supabase", "RAG · Pathumma LLM", "LINE Messaging API", "PromptPay Verify"],
		},
		{
			category: "Infrastructure",
			items: [
				"Docker",
				"CI/CD (240+ tests)",
				"Vercel · Railway",
				"Nginx",
				"ThaiSC Supercomputer",
				"WireGuard VPN",
			],
		},
		{
			category: "Tools & Workflow",
			items: [
				"Git · GitHub Actions",
				"Excel · Google Sheets",
				"Canva",
				"Postman",
				"Agile · UX/UI",
			],
		},
	],
	th: [
		{
			category: "ฟรอนต์เอนด์",
			items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Java (OOP)"],
		},
		{
			category: "แบ็กเอนด์ & AI",
			items: ["Node.js", "Express", "PostgreSQL", "Supabase", "RAG · Pathumma LLM", "LINE Messaging API", "PromptPay Verify"],
		},
		{
			category: "อินฟราสตรัคเจอร์",
			items: [
				"Docker",
				"CI/CD (240+ tests)",
				"Vercel · Railway",
				"Nginx",
				"ThaiSC Supercomputer",
				"WireGuard VPN",
			],
		},
		{
			category: "เครื่องมือ & เวิร์กโฟลว์",
			items: [
				"Git · GitHub Actions",
				"Excel · Google Sheets",
				"Canva",
				"Postman",
				"Agile · UX/UI",
			],
		},
	],
	ja: [
		{
			category: "Frontend",
			items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Java (OOP)"],
		},
		{
			category: "Backend & AI",
			items: ["Node.js", "Express", "PostgreSQL", "Supabase", "RAG · Pathumma LLM", "LINE Messaging API", "PromptPay Verify"],
		},
		{
			category: "Infrastructure",
			items: [
				"Docker",
				"CI/CD (240+ tests)",
				"Vercel · Railway",
				"Nginx",
				"ThaiSC Supercomputer",
				"WireGuard VPN",
			],
		},
		{
			category: "Tools & Workflow",
			items: [
				"Git · GitHub Actions",
				"Excel · Google Sheets",
				"Canva",
				"Postman",
				"Agile · UX/UI",
			],
		},
	],
	zh: [
		{
			category: "Frontend",
			items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Java (OOP)"],
		},
		{
			category: "Backend & AI",
			items: ["Node.js", "Express", "PostgreSQL", "Supabase", "RAG · Pathumma LLM", "LINE Messaging API", "PromptPay Verify"],
		},
		{
			category: "Infrastructure",
			items: [
				"Docker",
				"CI/CD (240+ tests)",
				"Vercel · Railway",
				"Nginx",
				"ThaiSC Supercomputer",
				"WireGuard VPN",
			],
		},
		{
			category: "Tools & Workflow",
			items: [
				"Git · GitHub Actions",
				"Excel · Google Sheets",
				"Canva",
				"Postman",
				"Agile · UX/UI",
			],
		},
	],
} as const;

/* Pastel accents, cycling through the five palette colors (theme-aware). */
const ACCENTS = [
	{
		borderTop: "border-t-2 border-chart-1/70",
		hoverBg: "hover:bg-chart-1/5",
		titleText: "text-chart-1",
	},
	{
		borderTop: "border-t-2 border-chart-2/70",
		hoverBg: "hover:bg-chart-2/5",
		titleText: "text-chart-2",
	},
	{
		borderTop: "border-t-2 border-chart-3/70",
		hoverBg: "hover:bg-chart-3/5",
		titleText: "text-chart-3",
	},
	{
		borderTop: "border-t-2 border-chart-4/70",
		hoverBg: "hover:bg-chart-4/5",
		titleText: "text-chart-4",
	},
	{
		borderTop: "border-t-2 border-chart-5/70",
		hoverBg: "hover:bg-chart-5/5",
		titleText: "text-chart-5",
	},
] as const;

export function SkillsMatrix() {
	const { language } = useLanguage();
	const { ref: sectionRef, isInView } = useInView<HTMLDivElement>({
		threshold: 0.08,
	});
	const _t = {
		en: {
			kicker: "Expertise",
			title: "Technical Stack",
			desc: "A selection of modern technologies and industry-standard tools I use to design, build, and ship software.",
		},
		th: {
			kicker: "ความเชี่ยวชาญ",
			title: "ทักษะทางเทคนิค",
			desc: "เทคโนโลยีสมัยใหม่และเครื่องมือมาตรฐานสากลที่ใช้ในการออกแบบ พัฒนา และปล่อยซอฟต์แวร์",
		},
		ja: {
			kicker: "専門性",
			title: "技術スタック",
			desc: "ソフトウェアの設計・構築・リリースに使用するモダンな技術と業界標準ツール。",
		},
		zh: {
			kicker: "专业",
			title: "技术栈",
			desc: "用于设计、构建和发布软件的现代技术与行业标准工具。",
		},
	};
	const t = (_t as unknown as Record<string, typeof _t.en>)[language] ?? _t.en;

	return (
		<section
			id="skills"
			className="px-4 sm:px-6 py-20 sm:py-28 content-visibility-auto"
		>
			<div ref={sectionRef} className="mx-auto max-w-7xl">
				<div className="mb-12 sm:mb-16 space-y-4">
					<p
						className={cn(
							"font-mono text-xs uppercase tracking-[0.3em] text-primary opacity-0",
							isInView && "animate-fade-in-up",
						)}
					>
						{t.kicker}
					</p>
					<h2
						className={cn(
							"font-serif text-4xl sm:text-5xl font-medium tracking-tight opacity-0",
							isInView && "animate-fade-in-up stagger-1",
						)}
					>
						{t.title}
					</h2>
					<p
						className={cn(
							"max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed opacity-0",
							isInView && "animate-fade-in-up stagger-2",
						)}
					>
						{t.desc}
					</p>
				</div>

				<div className="grid gap-px bg-border/70 border border-border/70 sm:grid-cols-2 lg:grid-cols-4">
					{skills[language].map((skill, index) => {
						const accent = ACCENTS[index % ACCENTS.length];
						return (
							<div
								key={skill.category}
								className={cn(
									"group bg-background p-8 pt-7 transition-colors duration-300 opacity-0",
									accent.borderTop, // pastel top hairline
									accent.hoverBg,
									isInView && "animate-fade-in-up",
								)}
								style={{ animationDelay: `${index * 100 + 200}ms` }}
							>
								<h3
									className={cn(
										"font-serif text-xl font-medium mb-4 transition-colors duration-300",
										accent.titleText, // colored category title
									)}
								>
									{skill.category}
								</h3>
								<p className="text-sm leading-relaxed text-muted-foreground">
									{skill.items.join(" · ")}
								</p>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}

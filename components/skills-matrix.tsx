"use client";

import { useLanguage } from "./language-provider";
import { useInView } from "@/lib/use-in-view";
import { cn } from "@/lib/utils";

const skills = {
	en: [
		{
			category: "Frontend",
			items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Vite", "Java (OOP)"],
		},
		{
			category: "Backend & AI",
			items: ["Node.js", "Express", "Python · FastAPI", "Java · Spring Boot", "C# · .NET 10", "PostgreSQL · pgvector", "Supabase", "RAG · Pathumma LLM", "LINE Messaging API", "PromptPay Verify"],
		},
		{
			category: "Infrastructure",
			items: [
				"Docker",
				"CI/CD (240+ tests)",
				"Vercel · Railway · Fly.io",
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
			items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Vite", "Java (OOP)"],
		},
		{
			category: "แบ็กเอนด์ & AI",
			items: ["Node.js", "Express", "Python · FastAPI", "Java · Spring Boot", "C# · .NET 10", "PostgreSQL · pgvector", "Supabase", "RAG · Pathumma LLM", "LINE Messaging API", "PromptPay Verify"],
		},
		{
			category: "อินฟราสตรัคเจอร์",
			items: [
				"Docker",
				"CI/CD (240+ tests)",
				"Vercel · Railway · Fly.io",
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
			items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Vite", "Java (OOP)"],
		},
		{
			category: "Backend & AI",
			items: ["Node.js", "Express", "Python · FastAPI", "Java · Spring Boot", "C# · .NET 10", "PostgreSQL · pgvector", "Supabase", "RAG · Pathumma LLM", "LINE Messaging API", "PromptPay Verify"],
		},
		{
			category: "Infrastructure",
			items: [
				"Docker",
				"CI/CD (240+ tests)",
				"Vercel · Railway · Fly.io",
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
			items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Vite", "Java (OOP)"],
		},
		{
			category: "Backend & AI",
			items: ["Node.js", "Express", "Python · FastAPI", "Java · Spring Boot", "C# · .NET 10", "PostgreSQL · pgvector", "Supabase", "RAG · Pathumma LLM", "LINE Messaging API", "PromptPay Verify"],
		},
		{
			category: "Infrastructure",
			items: [
				"Docker",
				"CI/CD (240+ tests)",
				"Vercel · Railway · Fly.io",
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

				<div className="border-y border-border">
					{skills[language].map((skill, index) => {
						return (
							<div
								key={skill.category}
								className={cn(
									"group grid gap-2 py-6 sm:grid-cols-[220px_1fr] sm:gap-8",
									index > 0 && "border-t border-border/70",
								)}
							>
								<h3 className="flex items-baseline gap-3 font-serif text-lg font-medium">
									<span className="font-mono text-[10px] text-muted-foreground/50">
										{String(index + 1).padStart(2, "0")}
									</span>
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

"use client";

import { useLanguage } from "./language-provider";
import { useInView } from "@/lib/use-in-view";
import { cn } from "@/lib/utils";

const skills = {
	en: [
		{
			category: "Frontend",
			items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
		},
		{
			category: "Backend & Database",
			items: ["Node.js", "Express", "Java", "PostgreSQL", "Supabase"],
		},
		{
			category: "Infrastructure",
			items: [
				"Docker",
				"CI/CD",
				"Vercel",
				"Nginx",
				"Arch Linux / CachyOS",
				"WireGuard VPN",
			],
		},
		{
			category: "Tools & Media",
			items: [
				"Git",
				"GitHub Actions",
				"Postman",
				"DaVinci Resolve",
				"CapCut",
				"OBS Studio",
			],
		},
	],
	th: [
		{
			category: "ฟรอนต์เอนด์",
			items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
		},
		{
			category: "แบ็กเอนด์ & ฐานข้อมูล",
			items: ["Node.js", "Express", "Java", "PostgreSQL", "Supabase"],
		},
		{
			category: "อินฟราสตรัคเจอร์",
			items: [
				"Docker",
				"CI/CD",
				"Vercel",
				"Nginx",
				"Arch Linux / CachyOS",
				"WireGuard VPN",
			],
		},
		{
			category: "เครื่องมือ & มีเดีย",
			items: [
				"Git",
				"GitHub Actions",
				"Postman",
				"DaVinci Resolve",
				"CapCut",
				"OBS Studio",
			],
		},
	],
} as const;

export function SkillsMatrix() {
	const { language } = useLanguage();
	const { ref: sectionRef, isInView } = useInView<HTMLDivElement>({
		threshold: 0.08,
	});
	const t = {
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
	}[language];

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
					{skills[language].map((skill, index) => (
						<div
							key={skill.category}
							className={cn(
								"group bg-background p-8 transition-colors duration-300 hover:bg-secondary/30 opacity-0",
								isInView && "animate-fade-in-up",
							)}
							style={{ animationDelay: `${index * 100 + 200}ms` }}
						>
							<h3 className="font-serif text-xl font-medium mb-4 text-foreground">
								{skill.category}
							</h3>
							<p className="text-sm leading-relaxed text-muted-foreground">
								{skill.items.join(" · ")}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

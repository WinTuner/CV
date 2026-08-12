"use client";

import Link from "next/link";
import { Rocket, ShieldCheck, GraduationCap, MapPin } from "lucide-react";
import { useLanguage } from "./language-provider";
import { useInView } from "@/lib/use-in-view";
import { cn } from "@/lib/utils";

const STATS = {
	en: [
		{
			icon: Rocket,
			value: "Co-Founder & CTO",
			label: "Muanjai — AI compliance helper bot (LINE OA)",
			href: "/introduction",
		},
		{
			icon: ShieldCheck,
			value: "240+ tests",
			label: "Automated tests guarding the CI pipeline",
			href: "https://github.com/WinTuner",
		},
		{
			icon: GraduationCap,
			value: "GPA 3.97",
			label: "Software Engineering program, Chiang Rai (2019–2025)",
			href: "/introduction",
		},
		{
			icon: MapPin,
			value: "CMU — DII",
			label: "B.Sc. Digital Industry Integration, Chiang Mai (current)",
			href: "/introduction",
		},
	],
	th: [
		{
			icon: Rocket,
			value: "Co-Founder & CTO",
			label: "Muanjai — บอทช่วยดูแล compliance ด้วย AI (LINE OA)",
			href: "/introduction",
		},
		{
			icon: ShieldCheck,
			value: "240+ เทสต์",
			label: "ชุดทดสอบอัตโนมัติใน CI Pipeline",
			href: "https://github.com/WinTuner",
		},
		{
			icon: GraduationCap,
			value: "GPA 3.97",
			label: "แผนการเรียนวิศวกรรมซอฟต์แวร์ เชียงราย (2019–2025)",
			href: "/introduction",
		},
		{
			icon: MapPin,
			value: "มช. — DII",
			label: "วท.บ. การบูรณาการอุตสาหกรรมดิจิทัล เชียงใหม่ (ปัจจุบัน)",
			href: "/introduction",
		},
	],
} as const;

export function HighlightsStrip() {
	const { language } = useLanguage();
	const { ref, isInView } = useInView<HTMLDivElement>({ threshold: 0.2 });

	const items = STATS[language];

	return (
		<section className="px-4 sm:px-6 py-10 sm:py-14">
			<div ref={ref} className="mx-auto max-w-7xl">
				<div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
				{items.map((stat, index) => {
					const isExternal = stat.href.startsWith("http");
					const className = cn(
						"group relative overflow-hidden rounded-xl border border-border/60 bg-card/40 p-4 sm:p-6 glass transition-all duration-300 hover:border-primary/40 hover:bg-card/70 hover-lift opacity-0",
						isInView && "animate-fade-in-up",
					);
					const inner = (
						<>
							<div className="flex items-start justify-between gap-3">
								<div className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
									<stat.icon className="h-4 w-4" />
								</div>
								<span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground/60">
									{String(index + 1).padStart(2, "0")}
								</span>
							</div>
							<p className="mt-4 text-base sm:text-lg font-bold tracking-tight group-hover:text-gradient transition-all duration-300">
								{stat.value}
							</p>
							<p className="mt-1 text-[11px] sm:text-xs leading-relaxed text-muted-foreground">
								{stat.label}
							</p>
							<div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-primary via-accent to-transparent transition-all duration-500 group-hover:w-full" />
						</>
					);
					return isExternal ? (
						<a
							key={stat.label}
							href={stat.href}
							target="_blank"
							rel="noopener noreferrer"
							className={className}
							style={{ animationDelay: `${(index % 4) * 90 + 150}ms` }}
						>
							{inner}
						</a>
					) : (
						<Link
							key={stat.label}
							href={stat.href}
							className={className}
							style={{ animationDelay: `${(index % 4) * 90 + 150}ms` }}
						>
							{inner}
						</Link>
					);
				})}
				</div>
			</div>
		</section>
	);
}

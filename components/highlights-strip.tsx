"use client";

import Link from "next/link";
import { useLanguage } from "./language-provider";
import { useInView } from "@/lib/use-in-view";
import { cn } from "@/lib/utils";

const STATS = {
	en: [
		{
			value: "Co-Founder & CTO",
			label: "Muanjai — AI compliance helper bot (LINE OA)",
			href: "/introduction",
		},
		{
			value: "240+ tests",
			label: "Automated tests guarding the CI pipeline",
			href: "https://github.com/WinTuner",
		},
		{
			value: "GPA 3.97",
			label: "Software Engineering program, Chiang Rai (2019–2025)",
			href: "/introduction",
		},
		{
			value: "CMU — DII",
			label: "B.Sc. Digital Industry Integration, Chiang Mai (current)",
			href: "/introduction",
		},
	],
	th: [
		{
			value: "Co-Founder & CTO",
			label: "Muanjai — บอทช่วยดูแล compliance ด้วย AI (LINE OA)",
			href: "/introduction",
		},
		{
			value: "240+ เทสต์",
			label: "ชุดทดสอบอัตโนมัติใน CI Pipeline",
			href: "https://github.com/WinTuner",
		},
		{
			value: "GPA 3.97",
			label: "แผนการเรียนวิศวกรรมซอฟต์แวร์ เชียงราย (2019–2025)",
			href: "/introduction",
		},
		{
			value: "มช. — DII",
			label: "วท.บ. การบูรณาการอุตสาหกรรมดิจิทัล เชียงใหม่ (ปัจจุบัน)",
			href: "/introduction",
		},
	],
} as const;

/* Pastel accents, cycling through the five palette colors (theme-aware). */
const ACCENTS = [
	{ dot: "bg-chart-1", value: "group-hover:text-chart-1", hoverBg: "hover:bg-chart-1/5" },
	{ dot: "bg-chart-2", value: "group-hover:text-chart-2", hoverBg: "hover:bg-chart-2/5" },
	{ dot: "bg-chart-3", value: "group-hover:text-chart-3", hoverBg: "hover:bg-chart-3/5" },
	{ dot: "bg-chart-4", value: "group-hover:text-chart-4", hoverBg: "hover:bg-chart-4/5" },
	{ dot: "bg-chart-5", value: "group-hover:text-chart-5", hoverBg: "hover:bg-chart-5/5" },
] as const;

export function HighlightsStrip() {
	const { language } = useLanguage();
	const { ref, isInView } = useInView<HTMLDivElement>({ threshold: 0.2 });

	const items = STATS[language];

	return (
		<section className="px-4 sm:px-6 py-10 sm:py-14">
			<div ref={ref} className="mx-auto max-w-7xl border-y border-border/70">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
					{items.map((stat, index) => {
						const isExternal = stat.href.startsWith("http");
						const accent = ACCENTS[index % ACCENTS.length];
						const className = cn(
							"group flex flex-col gap-2 px-6 py-8 sm:py-10 transition-colors duration-300 opacity-0",
							accent.hoverBg,
							// Hairline dividers: 2-col on sm (odd items), 4-col on lg (items 1-3)
							index % 2 === 1 && "sm:border-l sm:border-border/70",
							index > 0 && "lg:border-l lg:border-border/70",
							isInView && "animate-fade-in-up",
						);
						const inner = (
							<>
								<span className="flex items-baseline gap-2.5">
									<span
											aria-hidden="true"
											className={cn(
												"inline-block h-2 w-2 shrink-0 translate-y-[-2px] rounded-full",
												accent.dot,
											)}
										/>
									<span
											className={cn(
												"font-serif text-2xl sm:text-[1.65rem] font-medium leading-tight text-foreground transition-colors duration-300",
												accent.value,
											)}
										>
											{stat.value}
										</span>
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
								href={stat.href}
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
	);
}

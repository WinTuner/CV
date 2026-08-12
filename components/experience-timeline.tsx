"use client";

import { cn } from "@/lib/utils";
import { useInView } from "@/lib/use-in-view";
import { experiences } from "@/constants/cv-data";
import { useLanguage } from "./language-provider";
import { renderTextWithLinks } from "@/lib/render-text-with-links";

const t = {
	en: {
		kicker: "Journey",
		title: "Experience",
		desc: "Where I've been and what I've been building — a timeline of roles, projects, and the lessons that came with them.",
	},
	th: {
		kicker: "เส้นทาง",
		title: "ประสบการณ์",
		desc: "เส้นทางและสิ่งที่ได้สร้างมา — ไทม์ไลน์ของบทบาท โปรเจกต์ และบทเรียนที่ได้เรียนรู้",
	},
} as const;

/* Pastel accents, cycling through the five palette colors (theme-aware). */
const ACCENTS = [
	{ dot: "bg-chart-1", ring: "border-chart-1/40", dash: "group-hover:bg-chart-1/60", period: "text-chart-1" },
	{ dot: "bg-chart-2", ring: "border-chart-2/40", dash: "group-hover:bg-chart-2/60", period: "text-chart-2" },
	{ dot: "bg-chart-3", ring: "border-chart-3/40", dash: "group-hover:bg-chart-3/60", period: "text-chart-3" },
	{ dot: "bg-chart-4", ring: "border-chart-4/40", dash: "group-hover:bg-chart-4/60", period: "text-chart-4" },
	{ dot: "bg-chart-5", ring: "border-chart-5/40", dash: "group-hover:bg-chart-5/60", period: "text-chart-5" },
] as const;

export function ExperienceTimeline() {
	const { language } = useLanguage();
	const { ref: sectionRef, isInView } = useInView<HTMLDivElement>({
		threshold: 0.08,
	});
	const copy = t[language];
	const items = experiences[language];

	return (
		<section
			id="experience"
			className="px-4 sm:px-6 py-20 sm:py-28 border-t border-border/60 content-visibility-auto"
		>
			<div ref={sectionRef} className="mx-auto max-w-7xl">
				<div className={cn("mb-10 sm:mb-14 space-y-4 opacity-0", isInView && "animate-fade-in-up")}>
					<p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
						{copy.kicker}
					</p>
					<h2 className="font-serif text-4xl sm:text-5xl font-medium tracking-tight">
						{copy.title}
					</h2>
					<p className="max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
						{copy.desc}
					</p>
				</div>

				<div className="relative">
					{/* Vertical hairline, centered under the 14px dots */}
					{items.length > 0 && (
						<span
							aria-hidden="true"
							className="absolute left-[7px] top-1.5 bottom-2 w-px bg-border/80"
						/>
					)}

					<div className="space-y-12 sm:space-y-14">
						{items.map((exp, index) => (
							<article
								key={exp.title}
								className={cn(
									"group relative pl-8 sm:pl-12 opacity-0",
									isInView && "animate-fade-in-up",
								)}
								style={{ animationDelay: `${index * 100 + 150}ms` }}
							>
								{/* Timeline dot (14px, centered on the hairline at 7px) */}
								<span
									aria-hidden="true"
									className="absolute left-0 top-1.5 flex h-3.5 w-3.5 items-center justify-center"
								>
									<span
										className={cn(
											"h-2 w-2 rounded-full transition-transform duration-300 group-hover:scale-125",
											ACCENTS[index % ACCENTS.length].dot,
										)}
									/>
									<span
										className={cn(
											"absolute inset-0 rounded-full border transition-all duration-300 group-hover:scale-125",
											ACCENTS[index % ACCENTS.length].ring,
										)}
									/>
								</span>

								<div className="flex flex-col gap-1.5">
									<div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-4">
										<h3 className="font-serif text-xl sm:text-2xl font-medium tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary">
											{exp.title}
										</h3>
										<span
											className={cn(
												"shrink-0 font-mono text-xs",
												ACCENTS[index % ACCENTS.length].period,
											)}
										>
											{exp.period}
										</span>
									</div>

									<ul className="mt-3 space-y-2.5">
										{exp.points.map((point) => (
											<li
												key={point}
												className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
											>
												<span
													aria-hidden="true"
													className={cn(
														"mt-[9px] h-px w-3 shrink-0 bg-border transition-colors duration-300",
														ACCENTS[index % ACCENTS.length].dash,
													)}
												/>
												<span>{renderTextWithLinks(point)}</span>
											</li>
										))}
									</ul>
								</div>
							</article>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}

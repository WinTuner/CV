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
									<span className="h-2 w-2 rounded-full bg-primary transition-transform duration-300 group-hover:scale-125" />
									<span className="absolute inset-0 rounded-full border border-primary/40 transition-all duration-300 group-hover:scale-125" />
								</span>

								<div className="flex flex-col gap-1.5">
									<div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-4">
										<h3 className="font-serif text-xl sm:text-2xl font-medium tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary">
											{exp.title}
										</h3>
										<span className="shrink-0 font-mono text-xs text-primary">
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
													className="mt-[9px] h-px w-3 shrink-0 bg-border transition-colors duration-300 group-hover:bg-primary/50"
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

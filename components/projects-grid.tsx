"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useInView } from "@/lib/use-in-view";
import { GithubIcon } from "./social-icons";
import { Star, GitFork, ArrowUpRight } from "lucide-react";
import { useLanguage } from "./language-provider";

import type { Project } from "@/lib/github";

const filters = [
	"all",
	"production",
	"competition",
	"academic",
	"personal",
	"openSource",
];

export function ProjectsGrid({ projects = [] }: { projects?: Project[] }) {
	const { language } = useLanguage();
	const [activeFilter, setActiveFilter] = useState("all");
	const { ref: sectionRef, isInView } = useInView<HTMLDivElement>({
		threshold: 0.05,
	});

	const copy = {
		en: {
			kicker: "Selected Work",
			title: "Projects",
			featured: "Featured",
			source: "source",
			live: "live",
			status: { "in-progress": "in progress", shipped: "shipped", archived: "archived" },
			filters: {
				all: "all",
				production: "production",
				competition: "competition",
				academic: "academic",
				personal: "personal",
				openSource: "open source",
			},
		},
		th: {
			kicker: "ผลงานที่คัดสรร",
			title: "โปรเจกต์",
			featured: "แนะนำ",
			source: "ซอร์สโค้ด",
			live: "เว็บไซต์",
			status: { "in-progress": "กำลังพัฒนา", shipped: "เผยแพร่แล้ว", archived: "เก็บแล้ว" },
			filters: {
				all: "ทั้งหมด",
				production: "งานจริง",
				competition: "แข่งขัน",
				academic: "วิชาการ",
				personal: "ส่วนตัว",
				openSource: "โอเพนซอร์ส",
			},
		},
	ja: {
			kicker: "Selected Work",
			title: "Projects",
			featured: "Featured",
			source: "source",
			live: "live",
			status: { "in-progress": "in progress", shipped: "shipped", archived: "archived" },
			filters: {
				all: "all",
				production: "production",
				competition: "competition",
				academic: "academic",
				personal: "personal",
				openSource: "open source",
			},
		},
	zh: {
			kicker: "Selected Work",
			title: "Projects",
			featured: "Featured",
			source: "source",
			live: "live",
			status: { "in-progress": "in progress", shipped: "shipped", archived: "archived" },
			filters: {
				all: "all",
				production: "production",
				competition: "competition",
				academic: "academic",
				personal: "personal",
				openSource: "open source",
			},
		},
	} as const;

	const t = copy[language];

	const filteredProjects =
		activeFilter === "all"
			? projects
			: projects.filter((p) => p.category === activeFilter);

	return (
		<section
			id="projects"
			className="px-4 sm:px-6 py-20 sm:py-28 border-t border-border/60 content-visibility-auto"
		>
			<div ref={sectionRef} className="mx-auto max-w-7xl">
				<div className="mb-10 sm:mb-14 flex flex-col gap-6 sm:gap-8 sm:flex-row sm:items-end sm:justify-between">
					<div className={cn("space-y-4 opacity-0", isInView && "animate-fade-in-up")}>
						<p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
							{t.kicker}
						</p>
						<h2 className="font-serif text-4xl sm:text-5xl font-medium tracking-tight">
							{t.title}
						</h2>
					</div>

					<div
						className={cn(
							"flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible sm:flex-wrap scrollbar-hide opacity-0",
							isInView && "animate-fade-in-up stagger-2",
						)}
					>
						{filters.map((filter) => (
							<button
								key={filter}
								onClick={() => setActiveFilter(filter)}
								className={cn(
									"shrink-0 min-h-11 border-b-2 px-3 py-2 font-mono text-xs uppercase tracking-wider transition-colors duration-300",
									activeFilter === filter
										? "border-primary text-primary"
										: "border-transparent text-muted-foreground hover:border-border hover:text-foreground",
								)}
							>
								{t.filters[filter as keyof typeof t.filters]}
							</button>
						))}
					</div>
				</div>

				<div key={activeFilter} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{filteredProjects.map((project, index) => (
						<article
							key={project.id}
							className={cn(
								"group relative flex flex-col border border-border/70 bg-card p-6 sm:p-7 transition-all duration-300 opacity-0 hover:border-primary/50 hover:shadow-[0_18px_40px_-24px_oklch(0.3_0.08_195/0.5)]",
								isInView && "animate-fade-in-up",
								project.highlight
									? "sm:col-span-2 lg:col-span-2 border-primary/40"
									: "",
								project.featured && !project.highlight && "sm:col-span-2 lg:col-span-1",
							)}
							style={{ animationDelay: `${(index % 6) * 80 + 200}ms` }}
						>
						<div className="mb-4 flex items-center justify-between gap-3 font-mono text-xs">
							<span className="text-muted-foreground">{project.year}</span>
							<div className="flex shrink-0 items-center gap-2">
								{project.highlight && (
									<span className="font-mono text-[10px] uppercase tracking-widest text-primary">
										★ {t.featured}
									</span>
								)}
								<span
									className={cn(
										"inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-widest",
										project.status === "in-progress"
											? "border-primary/40 bg-primary/10 text-primary"
											: "border-border/70 text-muted-foreground",
									)}
								>
									<span
										aria-hidden="true"
										className={cn(
											"h-1.5 w-1.5 rounded-full",
											project.status === "in-progress" ? "bg-primary" : "bg-muted-foreground/60",
										)}
									/>
									{t.status[project.status]}
								</span>
							</div>
						</div>

							<h3 className="mb-3 font-serif text-xl sm:text-2xl font-medium tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary">
								{project.title}
							</h3>

							<p
								className={cn(
									"mb-6 text-sm leading-relaxed text-muted-foreground",
									project.highlight ? "line-clamp-3" : "line-clamp-2",
								)}
							>
								{project.description}
							</p>

							<div className="mb-6 flex flex-wrap gap-1.5">
								{project.tags.map((tag) => (
									<span
										key={tag}
										className="border border-border/70 px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
									>
										{tag}
									</span>
								))}
							</div>

							<div className="mt-auto flex items-center justify-between border-t border-border/50 pt-4">
								<div className="flex items-center gap-4">
									<a
										href={project.url}
										target="_blank"
										rel="noopener noreferrer"
										className="group/link inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors duration-300 hover:text-primary"
									>
										<GithubIcon className="h-4 w-4" />
										<span className="underline-animate">{t.source}</span>
									</a>
									{project.homepage && (
										<a
											href={project.homepage}
											target="_blank"
											rel="noopener noreferrer"
											className="group/link inline-flex items-center gap-1.5 font-mono text-xs text-primary transition-colors duration-300 hover:text-foreground"
										>
											<span className="underline-animate">{t.live}</span>
											<ArrowUpRight className="h-3.5 w-3.5" />
										</a>
									)}
								</div>

								<div className="flex items-center gap-4 font-mono text-[10px] text-muted-foreground">
									<span className="inline-flex items-center gap-1">
										<Star className="h-3 w-3" /> {project.stars}
									</span>
									<span className="inline-flex items-center gap-1">
										<GitFork className="h-3 w-3" /> {project.forks}
									</span>
								</div>
							</div>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}

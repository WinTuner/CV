"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useInView } from "@/lib/use-in-view";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "./language-provider";
import { useLiveGithubRepos } from "@/lib/use-live-github-repos";
import { LivePill } from "./live-pill";
import { ProjectRow } from "./project-row";
import { localePath } from "@/constants/languages";

import type { Project } from "@/lib/github";

const HOME_PROJECT_COUNT = 10;

export function ProjectsGrid({ projects: initialProjects = [] }: { projects?: Project[] }) {
	const { language } = useLanguage();
	const { ref: sectionRef, isInView } = useInView<HTMLDivElement>({
		threshold: 0.05,
	});
	const { repos: projects, updatedAt, isLive } = useLiveGithubRepos(initialProjects, isInView);

	const copy = {
		en: {
			kicker: "Selected Work",
			title: "Projects",
			fork: "Fork",
			source: "source",
			live: "live",
			liveBadge: "live",
			viewAll: "All projects",
			status: { "in-progress": "in progress", shipped: "shipped", archived: "archived" },
		},
		th: {
			kicker: "ผลงานที่คัดสรร",
			title: "โปรเจกต์",
			fork: "ฟอร์ก",
			source: "ซอร์สโค้ด",
			live: "เว็บไซต์",
			liveBadge: "สด",
			viewAll: "ดูทั้งหมด",
			status: { "in-progress": "กำลังพัฒนา", shipped: "เผยแพร่แล้ว", archived: "เก็บแล้ว" },
		},
		ja: {
			kicker: "Selected Work",
			title: "Projects",
			fork: "Fork",
			source: "source",
			live: "live",
			liveBadge: "live",
			viewAll: "すべて見る",
			status: { "in-progress": "in progress", shipped: "shipped", archived: "archived" },
		},
		zh: {
			kicker: "Selected Work",
			title: "Projects",
			fork: "Fork",
			source: "source",
			live: "live",
			liveBadge: "live",
			viewAll: "查看全部",
			status: { "in-progress": "in progress", shipped: "shipped", archived: "archived" },
		},
	} as const;

	const t = copy[language];
	const visibleProjects = projects.slice(0, HOME_PROJECT_COUNT);

	return (
		<section
			id="projects"
			className="px-4 sm:px-6 py-20 sm:py-28 border-t border-border/60 content-visibility-auto"
		>
			<div ref={sectionRef} className="mx-auto max-w-7xl">
				<div className="mb-10 sm:mb-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
					<div className={cn("space-y-4 opacity-0", isInView && "animate-fade-in-up")}>
						<p className="flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-primary">
							{t.kicker}
							<LivePill updatedAt={updatedAt} isLive={isLive} label={t.liveBadge} language={language} />
						</p>
						<h2 className="font-serif text-4xl sm:text-5xl font-medium tracking-tight">
							{t.title}
						</h2>
					</div>

					<Link
						href={localePath("/projects", language)}
						className="group inline-flex shrink-0 items-center gap-2 self-start font-mono text-xs text-muted-foreground transition-colors duration-200 hover:text-primary sm:self-end"
					>
						{t.viewAll}
						<ArrowRight className="arrow-spring h-3.5 w-3.5" />
					</Link>
				</div>

				<div className="grid border-b border-border/70 sm:grid-cols-2 sm:gap-x-12">
					{visibleProjects.map((project) => (
						<ProjectRow
							key={project.id}
							project={project}
							labels={{
								status: t.status[project.status],
								fork: t.fork,
								source: t.source,
								live: t.live,
							}}
						/>
					))}
				</div>
			</div>
		</section>
	);
}

"use client";

import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import { GithubIcon } from "./social-icons";
import { useLanguage } from "./language-provider";
import { useInView } from "@/lib/use-in-view";

import type { WipItem } from "@/lib/github";

export function Workbench({ wipItems = [] }: { wipItems?: WipItem[] }) {
	const { language } = useLanguage();
	const { ref: sectionRef, isInView } = useInView<HTMLDivElement>({
		threshold: 0.08,
	});
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		if (isNaN(date.getTime())) return dateString;
		return date.toLocaleDateString(language === "en" ? "en-US" : "th-TH", {
			month: "short",
			day: "numeric",
		});
	};
	const t = {
		en: {
			kicker: "In Progress",
			title: "Workbench",
			desc: "Active experiments and prototypes. Things that are being built, broken, and rebuilt.",
		},
		th: {
			kicker: "กำลังพัฒนา",
			title: "Workbench",
			desc: "พื้นที่ทดลองและต้นแบบที่กำลังพัฒนา สิ่งที่กำลังถูกสร้าง พัง และสร้างใหม่",
		},
	}[language];

	return (
		<section
			id="workbench"
			className="px-4 sm:px-6 py-20 sm:py-28 border-t border-border/60 content-visibility-auto"
		>
			<div ref={sectionRef} className="mx-auto max-w-7xl">
				<div className={cn("mb-10 sm:mb-14 space-y-4 opacity-0", isInView && "animate-fade-in-up")}>
					<p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
						{t.kicker}
					</p>
					<h2 className="font-serif text-4xl sm:text-5xl font-medium tracking-tight">
						{t.title}
					</h2>
					<p className="max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
						{t.desc}
					</p>
				</div>

				<div className={cn("border border-border/70 bg-card opacity-0", isInView && "animate-fade-in-up stagger-2")}>
					<div className="divide-y divide-border/60">
						{wipItems.map((item, index) => (
							<a
								key={item.id}
								href={item.url}
								target="_blank"
								rel="noopener noreferrer"
								className={cn(
									"group flex flex-col gap-4 p-5 sm:p-6 transition-colors duration-300 sm:flex-row sm:items-center sm:justify-between hover:bg-secondary/30 opacity-0",
									isInView && "animate-fade-in",
								)}
								style={{ animationDelay: `${index * 80 + 300}ms` }}
							>
								<div className="flex-1 space-y-2 min-w-0">
									<div className="flex items-center gap-3">
										<h4 className="font-serif text-lg font-medium tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary truncate">
											{item.name}
										</h4>
										<div className="flex shrink-0 items-center gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
											<GithubIcon className="h-3.5 w-3.5 text-muted-foreground" />
											<ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
										</div>
									</div>
									<p className="text-xs text-muted-foreground line-clamp-2 sm:line-clamp-1">
										{item.description}
									</p>
								</div>

								<div className="flex items-center justify-between gap-6 sm:justify-end">
									<div className="flex w-full items-center gap-3 sm:w-44 sm:flex-none">
										<div className="h-1 w-full overflow-hidden rounded-full bg-secondary">
											<div
												className="h-full rounded-full bg-primary transition-all duration-1000 ease-out"
												style={{ width: isInView ? `${item.progress}%` : "0%" }}
											/>
										</div>
										<span className="w-10 shrink-0 font-mono text-xs text-muted-foreground">
											{item.progress}%
										</span>
									</div>

									<span className="shrink-0 font-mono text-xs text-muted-foreground">
										{formatDate(item.lastUpdated)}
									</span>
								</div>
							</a>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}

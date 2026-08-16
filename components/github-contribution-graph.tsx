"use client";

import { useMemo } from "react";
import { useLanguage } from "./language-provider";
import { useInView } from "@/lib/use-in-view";
import { cn } from "@/lib/utils";
import type { Contributions } from "@/lib/github";

const MONTHS = [
	"Jan", "Feb", "Mar", "Apr", "May", "Jun",
	"Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const WEEKDAY_ROWS = [
	{ row: 1, label: "Mon" },
	{ row: 3, label: "Wed" },
	{ row: 5, label: "Fri" },
] as const;

const LEVEL_CLASSES = [
	"bg-border/50",
	"bg-primary/25",
	"bg-primary/45",
	"bg-primary/70",
	"bg-primary",
] as const;

interface GithubContributionGraphProps {
	contributions: Contributions;
}

export function GithubContributionGraph({
	contributions,
}: GithubContributionGraphProps) {
	const { language } = useLanguage();
	const { ref: sectionRef, isInView } = useInView<HTMLDivElement>({
		threshold: 0.05,
	});

	const t = {
		en: {
			kicker: "GitHub",
			title: "Contribution Activity",
			desc: "My last 365 days of building, experimenting and shipping — straight from the contribution calendar.",
			total: "contributions in the last year",
			less: "Less",
			more: "More",
		},
		th: {
			kicker: "GitHub",
			title: "กิจกรรมการคอมมิต",
			desc: "365 วันที่ผ่านมาของการสร้างสรรค์ ทดลอง และปล่อยผลงาน — ตรงจากปฏิทินการคอมมิต",
			total: "คอมมิตในรอบปีที่ผ่านมา",
			less: "น้อย",
			more: "มาก",
		},
	}[language];

	const { weeks, monthRow } = useMemo(() => {
		const weeks = contributions.weeks;
		const monthRow: Array<{ kind: "label"; label: string } | { kind: "spacer" }> = [];
		let lastMonth = -1;
		for (const week of weeks) {
			// Label the first week that contains a day of a new month so the
			// column header lines up with where that month's days actually start.
			let label: string | undefined;
			for (const day of week.days) {
				const month = day?.date
					? new Date(`${day.date}T12:00:00`).getMonth()
					: -1;
				if (month >= 0 && month !== lastMonth) {
					lastMonth = month;
					label = MONTHS[month];
					break;
				}
			}
			monthRow.push(label ? { kind: "label", label } : { kind: "spacer" });
		}
		return { weeks, monthRow };
	}, [contributions]);

	return (
		<section className="px-4 sm:px-6 py-20 sm:py-28 content-visibility-auto">
			<div ref={sectionRef} className="mx-auto max-w-7xl">
				<div className={cn("mb-12 sm:mb-16 space-y-4 opacity-0", isInView && "animate-fade-in-up")}>
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

				<div
					className={cn(
						"border border-border/70 bg-card p-5 sm:p-8 opacity-0",
						isInView && "animate-fade-in-up stagger-2",
					)}
				>
					<div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<p className="font-mono text-xs text-muted-foreground">
							<span className="font-serif text-3xl font-medium text-primary">
								{contributions.total.toLocaleString()}
							</span>{" "}
							{t.total}
						</p>
						<div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
							<span>{t.less}</span>
							{LEVEL_CLASSES.map((cls, index) => (
								<span key={index} className={cn("h-[11px] w-[11px] rounded-[3px]", cls)} />
							))}
							<span>{t.more}</span>
						</div>
					</div>

					{weeks.length === 0 ? (
						<p className="py-12 text-center font-mono text-xs text-muted-foreground">
							{language === "th" ? "ยังไม่มีข้อมูล" : "No contribution data yet"}
						</p>
					) : (
						<div className="overflow-x-auto pb-2 scrollbar-hide">
							<div className="inline-block min-w-full">
								{/* Month labels */}
								<div className="mb-1 flex gap-[3px] pl-[30px] font-mono text-[9px] text-muted-foreground">
									{monthRow.map((entry, index) =>
										entry.kind === "label" ? (
											<span key={index} className="w-[13px] sm:w-[15px] overflow-visible whitespace-nowrap">
												{entry.label}
											</span>
										) : (
											<span key={index} className="w-[13px] sm:w-[15px]" />
										),
									)}
								</div>

								<div className="flex">
									{/* Weekday labels */}
									<div className="mr-1 flex w-[28px] flex-col gap-[3px] font-mono text-[9px] leading-none text-muted-foreground pt-[3px]">
										{Array.from({ length: 7 }, (_, row) => {
											const label = WEEKDAY_ROWS.find((w) => w.row === row)?.label;
											return (
												<span key={row} className="flex h-[11px] items-center">
													{label ?? ""}
												</span>
											);
										})}
									</div>

									{/* The calendar */}
									<div className="flex gap-[3px]">
										{weeks.map((week, weekIndex) => (
											<div key={weekIndex} className="flex flex-col gap-[3px]">
												{Array.from({ length: 7 }, (_, dayIndex) => {
													const day = week.days[dayIndex];
													if (!day) {
														return (
															<span
																key={dayIndex}
																className="h-[11px] w-[13px] sm:h-[13px] sm:w-[15px]"
															/>
														);
													}
													return (
														<span
															key={dayIndex}
															title={`${day.date}: ${day.count} contributions`}
															className={cn(
																"h-[11px] w-[13px] rounded-[3px] sm:h-[13px] sm:w-[15px] transition-transform duration-200 hover:scale-125",
																LEVEL_CLASSES[day.level],
															)}
														/>
													);
												})}
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</section>
	);
}

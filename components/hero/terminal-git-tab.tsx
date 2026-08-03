"use client";

import Link from "next/link";
import type { ActivityItem } from "@/lib/github";
import { formatRelativeTime, getMessageText, truncate } from "@/lib/hero-utils";

interface GitTabProps {
	activities: ActivityItem[];
	language: "en" | "th";
}

export function GitTab({ activities, language }: GitTabProps) {
	const gitLogs = activities.slice(0, 3).map((act, index) => {
		const hashVal = (act.project + act.time + index)
			.split("")
			.reduce((acc, char) => acc + char.charCodeAt(0), 0);
		const hexHash = (hashVal * 9876543).toString(16).substring(0, 7);
		const msg = getMessageText(act.message, language);
		const relTime = formatRelativeTime(act.time, language);
		const refText = index === 0 ? " (HEAD -> main, origin/main)" : "";
		return {
			hash: hexHash,
			ref: refText,
			project: act.project,
			message: msg,
			time: relTime,
		};
	});

	return (
		<div className="space-y-1.5 animate-fade-in text-[10.5px]">
			{gitLogs.map((log, index) => (
				<div key={index} className="flex flex-wrap items-start gap-1 font-mono">
					<span className="text-zinc-600 font-bold">*</span>
					<span className="text-amber-400 font-semibold">{log.hash}</span>
					{log.ref && (
						<span className="text-cyan-400 font-semibold">{log.ref}</span>
					)}
					<span className="text-emerald-400 font-medium">[{log.project}]</span>
					<span className="text-slate-100 flex-1 min-w-[150px] break-words">
						{truncate(log.message, 50)}
					</span>
					<span className="text-zinc-500 font-normal font-sans ml-auto text-[9px]">
						{log.time}
					</span>
					<span className="text-sky-400 font-semibold text-[9px]">
						&lt;WinTuner&gt;
					</span>
				</div>
			))}

			<div className="pt-3 flex items-center gap-1.5 border-t border-zinc-900/60 mt-4">
				<span className="text-fuchsia-500 font-bold">❯</span>
				<Link
					href="/workbench"
					className="text-primary hover:underline font-bold flex items-center gap-1 group/link text-[10px]"
				>
					git show --workbench
					<span className="text-muted-foreground text-[9px] font-normal group-hover/link:translate-x-1 transition-transform">
						→
					</span>
				</Link>
			</div>
		</div>
	);
}

"use client"

import Link from "next/link";
import type { ActivityItem } from "@/lib/github";
import {
	formatJournalDate,
	formatRelativeTime,
	getLogType,
	getMessageText,
} from "@/lib/hero-utils";

interface StatusTabProps {
	activities: ActivityItem[];
	language: "en" | "th";
}

export function StatusTab({ activities, language }: StatusTabProps) {
	const latest = activities[0];
	const latestMsg = getMessageText(latest.message, language);
	const relativeTime = formatRelativeTime(latest.time, language);
	const systemdTime = new Date(latest.time).toUTCString().replace("GMT", "UTC");
	const logType = getLogType(latest.type);
	const prActionText = latest.prAction
		? ` [${latest.prAction.toUpperCase()}]`
		: "";

	return (
		<div className="space-y-1.5 animate-fade-in">
			<div className="flex items-center gap-1">
				<span className="text-emerald-500 font-bold animate-pulse">●</span>
				<span className="font-bold text-foreground">github-monitor.service</span>
				<span className="text-muted-foreground/80">
					- Live GitHub Activity Monitor
				</span>
			</div>
			<div className="pl-3 text-muted-foreground/90">
				Loaded: <span className="text-emerald-400">loaded</span>{" "}
				(/etc/systemd/system/github-monitor.service; enabled)
			</div>
			<div className="pl-3 text-muted-foreground/90">
				Active:{" "}
				<span className="text-emerald-400 font-bold">active (running)</span>{" "}
				since {systemdTime}
			</div>
			<div className="pl-3 text-muted-foreground/90">
				Status:{" "}
				<span className="text-sky-300">
					&quot;Synced with GitHub API (revalidated cache)&quot;
				</span>
			</div>
			<div className="pl-3 text-muted-foreground/90 mb-3">
				Main PID: 1337 (node-server)
			</div>

			<div className="border-t border-zinc-900 my-2 pt-2 text-[9px] text-muted-foreground/50 uppercase tracking-wider font-bold">
				Journalctl Logs:
			</div>
			<div className="space-y-1 text-[10.5px]">
				<div className="text-muted-foreground/75">
					<span className="text-zinc-500">
						{formatJournalDate(latest.time)}
					</span>{" "}
					arch systemd[1]: Started WinTuner&apos;s Live GitHub Monitor.
				</div>
				<div className="text-slate-200">
					<span className="text-zinc-500">{formatJournalDate(latest.time)}</span>{" "}
					arch{" "}
					<span className="text-cyan-400 font-semibold">
						github-monitor[1337]
					</span>
					:{" "}
					<span className="text-emerald-400 font-bold">
						[{logType}
						{prActionText}]
					</span>{" "}
					{latest.project} ❯ &quot;{latestMsg}&quot;{" "}
					<span className="text-muted-foreground text-[9px] font-normal font-sans ml-1">
						({relativeTime})
					</span>
				</div>
			</div>

			<div className="pt-3 flex items-center gap-1.5 border-t border-zinc-900/60 mt-3">
				<span className="text-fuchsia-500 font-bold">❯</span>
				<Link
					href="/workbench"
					className="text-primary hover:underline font-bold flex items-center gap-1 group/link text-[10px]"
				>
					./view-workbench.sh
					<span className="text-muted-foreground text-[9px] font-normal group-hover/link:translate-x-1 transition-transform">
						→
					</span>
				</Link>
			</div>
		</div>
	);
}

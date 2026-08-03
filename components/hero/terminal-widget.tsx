"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "../language-provider";
import { useIsMounted } from "@/lib/use-is-mounted";
import { cn } from "@/lib/utils";
import type { ActivityItem } from "@/lib/github";
import { StatusTab } from "./terminal-status-tab";
import { GitTab } from "./terminal-git-tab";
import { NeofetchTab } from "./terminal-neofetch-tab";
import { CliTab } from "./terminal-cli-tab";

const FALLBACK_ACTIVITIES: ActivityItem[] = [
	{
		type: "commit",
		project: "ProjectPruta",
		message: "Refine TypeScript structure",
		time: new Date().toISOString(),
	},
	{
		type: "commit",
		project: "OOP-Lab-2026",
		message: "Finalize Java lab submission",
		time: new Date(Date.now() - 3600000).toISOString(),
	},
	{
		type: "commit",
		project: "aim4-mod",
		message: "Improve HTML layout and sections",
		time: new Date(Date.now() - 7200000).toISOString(),
	},
];

const commands = {
	status: "systemctl status github-monitor.service",
	git: "git log -n 3 --oneline",
	neofetch: "neofetch",
	cli: "init-portfolio-cli.sh",
} as const;

type TerminalTab = "status" | "git" | "neofetch" | "cli";

interface TerminalWidgetProps {
	recentActivities?: ActivityItem[];
}

const TABS: Array<{ id: TerminalTab; label: string }> = [
	{ id: "status", label: "status.service" },
	{ id: "git", label: "git-log.sh" },
	{ id: "neofetch", label: "neofetch" },
	{ id: "cli", label: "portfolio-cli.sh" },
];

export function TerminalWidget({ recentActivities = [] }: TerminalWidgetProps) {
	const { language } = useLanguage();

	const [activeTab, setActiveTab] = useState<TerminalTab>("status");
	const [typedCommand, setTypedCommand] = useState("");
	const [isTyping, setIsTyping] = useState(false);
	const [showOutput, setShowOutput] = useState(false);

	// Interactive CLI States
	const [cliInput, setCliInput] = useState("");
	const [cliHistory, setCliHistory] = useState<
		Array<{ command: string; output: React.ReactNode }>
	>([
		{
			command: "init-portfolio-cli.sh",
			output: (
				<div className="space-y-1">
					<p className="text-emerald-400 font-bold">
						--- WIN&apos;S INTERACTIVE PORTFOLIO SHELL v1.0.0 ---
					</p>
					<p className="text-muted-foreground text-[10px]">
						Type <span className="text-primary font-bold">help</span> to view
						available commands.
					</p>
				</div>
			),
		},
	]);

	// Dynamic Real-time States
	const [cpuLoad, setCpuLoad] = useState(24.5);
	const [ramUsed, setRamUsed] = useState(12.44);
	const [localTime, setLocalTime] = useState("");
	const [liveActivities, setLiveActivities] =
		useState<ActivityItem[]>(recentActivities);
	const mounted = useIsMounted();

	useEffect(() => {
		const fetchLiveActivities = () => {
			fetch("https://api.github.com/users/WinTuner/events?per_page=10")
				.then((res) => {
					if (!res.ok) throw new Error("Status code " + res.status);
					return res.json();
				})
				.then((events) => {
					if (Array.isArray(events)) {
						const parsed: ActivityItem[] = [];
						for (const event of events) {
							if (parsed.length >= 5) break;
							const project = event.repo.name.replace("WinTuner/", "");
							const time = event.created_at;

							if (event.type === "PushEvent") {
								const commits = event.payload.commits || [];
								if (commits.length > 0) {
									parsed.push({
										type: "commit",
										project,
										message: commits[0].message,
										time,
									});
								}
							} else if (event.type === "PullRequestEvent") {
								const pr = event.payload.pull_request;
								parsed.push({
									type: "pr",
									project,
									message: {
										en: `${event.payload.action.toUpperCase()}: ${pr?.title || ""}`,
										th: `${event.payload.action === "opened" ? "เปิด" : event.payload.action === "closed" ? "ปิด" : "รวม"} PR: ${pr?.title || ""}`,
									},
									time,
									prAction: event.payload.action as ActivityItem["prAction"],
									prTitle: pr?.title || "",
								});
							} else if (
								event.type === "CreateEvent" &&
								event.payload.ref_type === "repository"
							) {
								parsed.push({
									type: "create",
									project,
									message: {
										en: `Created repository ${project}`,
										th: `สร้างรีโพสิทอรี ${project}`,
									},
									time,
								});
							}
						}
						if (parsed.length > 0) {
							setLiveActivities(parsed);
						}
					}
				})
				.catch((err) =>
					console.warn(
						"Failed client-side live fetch, using build fallback:",
						err,
					),
				);
		};

		fetchLiveActivities();

		// Periodically fetch live activity every 60 seconds
		const activityInterval = setInterval(fetchLiveActivities, 60000);

		// CPU and RAM dynamic fluctuation ticker (every 2.5 seconds)
		const sysInterval = setInterval(() => {
			setCpuLoad((prev) => {
				const change = (Math.random() - 0.5) * 6;
				return parseFloat(Math.min(90, Math.max(5, prev + change)).toFixed(1));
			});
			setRamUsed((prev) => {
				const change = (Math.random() - 0.5) * 0.3;
				return parseFloat(
					Math.min(30.2, Math.max(8.4, prev + change)).toFixed(2),
				);
			});
		}, 2500);

		// Thailand local clock ticking
		const clockInterval = setInterval(() => {
			const options: Intl.DateTimeFormatOptions = {
				timeZone: "Asia/Bangkok",
				hour: "2-digit",
				minute: "2-digit",
				second: "2-digit",
				hour12: false,
			};
			setLocalTime(
				new Intl.DateTimeFormat("en-US", options).format(new Date()) + " (ICT)",
			);
		}, 1000);

		return () => {
			clearInterval(activityInterval);
			clearInterval(sysInterval);
			clearInterval(clockInterval);
		};
	}, [recentActivities]);

	const handleCliSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault();
		const input = cliInput.trim().toLowerCase();
		if (!input) return;

		let output: React.ReactNode = null;

		switch (input) {
			case "help":
				output = (
					<div className="space-y-1 text-slate-350 text-[10px]">
						<p className="text-primary font-bold">Available Commands:</p>
						<p>
							{" "}
							<span className="text-emerald-400 font-bold">about</span> -
							Display profile bio summary
						</p>
						<p>
							{" "}
							<span className="text-emerald-400 font-bold">skills</span> - List
							primary tech stack with charts
						</p>
						<p>
							{" "}
							<span className="text-emerald-400 font-bold">projects</span> -
							Show links to active GitHub repositories
						</p>
						<p>
							{" "}
							<span className="text-emerald-400 font-bold">clear</span> - Clear
							terminal logs
						</p>
						<p>
							{" "}
							<span className="text-emerald-400 font-bold">exit</span> - Exit
							CLI and return to live status
						</p>
					</div>
				);
				break;
			case "about":
				output = (
					<div className="space-y-1 text-[10px]">
						<p className="font-bold text-foreground">
							Thanatphong Tarin (WinTuner)
						</p>
						<p className="text-muted-foreground leading-normal">
							{language === "th"
								? "นักศึกษาสายวิศวกรรมซอฟต์แวร์ มหาวิทยาลัยเชียงใหม่ ผู้ร่วมก่อตั้งและ CTO ของ Muanjai เชี่ยวชาญด้าน Agentic AI, เว็บแอปพลิเคชัน และ DevOps"
								: "Software engineering student at Chiang Mai University and Co-Founder & CTO of Muanjai. Specializing in Agentic AI, full-stack, and DevOps."}
						</p>
					</div>
				);
				break;
			case "skills":
				output = (
					<div className="space-y-0.5 font-mono text-[9.5px]">
						<p className="text-primary font-bold mb-1">
							Tech Stack & Proficiency:
						</p>
						<p>Next.js [██████████████░░░░] 75%</p>
						<p>TypeScript [████████████████░░] 80%</p>
						<p>Node.js [██████████████░░░░] 70%</p>
						<p>Linux/Bash [██████████████████] 90%</p>
					</div>
				);
				break;
			case "projects":
				output = (
					<div className="space-y-1 text-[10px]">
						<p className="text-primary font-bold">Recent Projects:</p>
						<p>
							•{" "}
							<a
								href="https://muanjai-ai.up.railway.app/chat/"
								target="_blank"
								rel="noopener noreferrer"
								className="text-emerald-400 underline hover:text-emerald-300"
							>
								Muanjai
							</a>{" "}
							- Agentic AI Travel Assistant
						</p>
						<p>
							•{" "}
							<a
								href="https://github.com/tinodin/AutoOS"
								target="_blank"
								rel="noopener noreferrer"
								className="text-emerald-400 underline hover:text-emerald-300"
							>
								AutoOS
							</a>{" "}
							- Native WinUI 3 Migrator
						</p>
						<p>
							•{" "}
							<a
								href="https://github.com/WinTuner/DotDoctor"
								target="_blank"
								rel="noopener noreferrer"
								className="text-emerald-400 underline hover:text-emerald-300"
							>
								DotDoctor
							</a>{" "}
							- Hyprland Config Checker
						</p>
					</div>
				);
				break;
			case "clear":
				setCliHistory([]);
				setCliInput("");
				return;
			case "exit":
				setActiveTab("status");
				setCliInput("");
				return;
			default:
				output = (
					<p className="text-rose-400 text-[10px]">
						Command not found: &quot;{input}&quot;. Type &apos;help&apos; for
						instructions.
					</p>
				);
		}

		setCliHistory((prev) => [...prev, { command: cliInput, output }]);
		setCliInput("");
	};

	useEffect(() => {
		const fullCommand = commands[activeTab];
		// eslint-disable-next-line react-hooks/set-state-in-effect -- intentional reset on tab switch
		setTypedCommand("");
		setShowOutput(false);
		setIsTyping(true);

		let i = 0;
		const interval = setInterval(() => {
			if (i < fullCommand.length) {
				setTypedCommand(fullCommand.slice(0, i + 1));
				i++;
			} else {
				clearInterval(interval);
				setIsTyping(false);
				setShowOutput(true);
			}
		}, 12);

		return () => clearInterval(interval);
	}, [activeTab]);

	const activitiesToUse =
		liveActivities.length > 0 ? liveActivities : FALLBACK_ACTIVITIES;

	return (
		<div className="w-full max-w-lg overflow-hidden rounded-xl border border-border bg-zinc-950/60 backdrop-blur-md shadow-2xl hover:border-primary/30 transition-all duration-300 animate-fade-in-up stagger-4">
			{/* Terminal Window Header */}
			<div className="flex items-center bg-zinc-950/90 border-b border-zinc-900/80 px-4">
				{/* Left Dot Controls */}
				<div className="flex items-center gap-1.5 mr-6 py-3.5">
					<div className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
					<div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
					<div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
				</div>

				{/* Custom Linux Styled Tabs */}
				<div className="flex items-end h-full gap-0.5 font-mono text-[10px]">
					{TABS.map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							aria-pressed={activeTab === tab.id}
							className={cn(
								"px-3 py-1.5 transition-colors duration-200 border-t border-x rounded-t-md font-semibold",
								activeTab === tab.id
									? "bg-zinc-900/80 border-zinc-800 text-primary border-t-primary"
									: "bg-zinc-950/40 border-transparent text-muted-foreground hover:bg-zinc-900/30 hover:text-foreground",
							)}
						>
							{tab.label}
						</button>
					))}
				</div>
			</div>

			{/* Terminal Body */}
			<div
				className={cn(
					"p-4 font-mono text-[11px] leading-relaxed text-slate-300 h-[205px] overflow-y-auto scrollbar-hide",
					activeTab === "cli" && "flex flex-col",
				)}
			>
				{/* Shell Prompt */}
				{activeTab !== "cli" && (
					<div className="flex items-center gap-1.5 text-muted-foreground/50 mb-3 border-b border-zinc-900 pb-2">
						<span className="text-sky-400 font-bold">wintuner</span>
						<span>@</span>
						<span className="text-purple-400 font-bold">archlinux</span>
						<span className="text-foreground/30">in</span>
						<span className="text-emerald-400">~</span>
						<span className="text-fuchsia-500 font-bold">❯</span>
						<span className="text-foreground font-semibold">
							{typedCommand}
						</span>
						{isTyping && (
							<span className="inline-block w-1.5 h-3.5 bg-primary animate-pulse ml-0.5" />
						)}
						{!isTyping && (
							<span className="inline-block w-1.5 h-3.5 bg-zinc-600 animate-pulse ml-0.5" />
						)}
					</div>
				)}

				{/* Tab Output Section */}
				{activeTab === "status" && showOutput && (
					<StatusTab activities={activitiesToUse} language={language} />
				)}

				{activeTab === "git" && showOutput && (
					<GitTab activities={activitiesToUse} language={language} />
				)}

				{activeTab === "neofetch" && showOutput && (
					<NeofetchTab
						mounted={mounted}
						cpuLoad={cpuLoad}
						ramUsed={ramUsed}
						localTime={localTime}
					/>
				)}

				{activeTab === "cli" && showOutput && (
					<CliTab
						history={cliHistory}
						input={cliInput}
						onInput={(e) => setCliInput(e.target.value)}
						onSubmit={handleCliSubmit}
					/>
				)}
			</div>
		</div>
	);
}

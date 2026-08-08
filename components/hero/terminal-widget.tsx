"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
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
	const { resolvedTheme, setTheme } = useTheme();

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
						--- WIN&apos;S INTERACTIVE PORTFOLIO SHELL v2.0.0 ---
					</p>
					<p className="text-muted-foreground text-[10px]">
						Type <span className="text-primary font-bold">help</span> to view
						available commands.
					</p>
				</div>
			),
		},
	]);
	const [commandHistory, setCommandHistory] = useState<string[]>([]);
	const [historyIndex, setHistoryIndex] = useState(-1);

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
		const rawInput = cliInput.trim();
		if (!rawInput) return;

		const [command, ...args] = rawInput.toLowerCase().split(/\s+/);

		// Meta commands act immediately and never pollute the transcript.
		if (command === "clear" || command === "exit" || command === "status" || command === "git" || command === "neofetch") {
			runCliCommand(command, args);
			setCliInput("");
			setHistoryIndex(-1);
			return;
		}

		setCliHistory((prev) => [...prev, { command: rawInput, output: runCliCommand(command, args) }]);
		setCliInput("");
		setCommandHistory((prev) => [...prev, rawInput]);
		setHistoryIndex(-1);
	};

	const handleCliKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "ArrowUp") {
			e.preventDefault();
			if (commandHistory.length === 0) return;
			const nextIndex =
				historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
			setHistoryIndex(nextIndex);
			setCliInput(commandHistory[nextIndex]);
		} else if (e.key === "ArrowDown") {
			e.preventDefault();
			if (historyIndex === -1) return;
			const nextIndex = historyIndex + 1;
			if (nextIndex >= commandHistory.length) {
				setHistoryIndex(-1);
				setCliInput("");
			} else {
				setHistoryIndex(nextIndex);
				setCliInput(commandHistory[nextIndex]);
			}
		}
	};

	const runCliCommand = (
		command: string,
		args: string[],
	): React.ReactNode => {
		const cyan = "text-sky-400";
		const green = "text-emerald-400";
		const dim = "text-muted-foreground";

		switch (command) {
			case "help":
				return (
					<div className="space-y-1 text-slate-350 text-[10px]">
						<p className="text-primary font-bold">
							{language === "th" ? "คำสั่งที่ใช้ได้:" : "Available Commands:"}
						</p>
						<p><span className={`${green} font-bold`}>help</span> - {language === "th" ? "แสดงคำสั่งทั้งหมด" : "Show all commands"}</p>
						<p><span className={`${green} font-bold`}>about</span> / <span className={`${green} font-bold`}>whoami</span> - {language === "th" ? "โปรไฟล์โดยย่อ" : "Profile bio summary"}</p>
						<p><span className={`${green} font-bold`}>skills</span> - {language === "th" ? "สกิลและเทคโนโลยี" : "List primary tech stack"}</p>
						<p><span className={`${green} font-bold`}>projects</span> - {language === "th" ? "โปรเจกต์เด่น" : "Show featured projects"}</p>
						<p><span className={`${green} font-bold`}>socials</span> - {language === "th" ? "ช่องทางติดต่อ" : "Social links"}</p>
						<p><span className={`${green} font-bold`}>open &lt;name&gt;</span> - {language === "th" ? "เปิดลิงก์ด่วน (เช่น open autoos)" : "Open a quick link (e.g. open autoos)"}</p>
						<p><span className={`${green} font-bold`}>ls</span> - {language === "th" ? "รายการคำสั่งลัด" : "List available topics"}</p>
						<p><span className={`${green} font-bold`}>echo &lt;text&gt;</span> - {language === "th" ? "พิมพ์ข้อความ" : "Print text"}</p>
						<p><span className={`${green} font-bold`}>date</span> - {language === "th" ? "วันและเวลา" : "Current date & time"}</p>
						<p><span className={`${green} font-bold`}>theme</span> - {language === "th" ? "สลับธีม" : "Toggle theme"}</p>
						<p><span className={`${green} font-bold`}>matrix</span> - {language === "th" ? "เข้าสู่เมทริกซ์ 🌧️" : "Enter the matrix 🌧️"}</p>
						<p><span className={`${green} font-bold`}>history</span> - {language === "th" ? "ประวัติคำสั่ง" : "Show command history"}</p>
						<p><span className={`${green} font-bold`}>status</span> / <span className={`${green} font-bold`}>git</span> / <span className={`${green} font-bold`}>neofetch</span> - {language === "th" ? "สลับแท็บเทอร์มินัล" : "Switch terminal tab"}</p>
						<p><span className={`${green} font-bold`}>clear</span> - {language === "th" ? "ล้างหน้าจอ" : "Clear terminal logs"}</p>
						<p><span className={`${green} font-bold`}>exit</span> - {language === "th" ? "ออกจาก CLI" : "Exit CLI"}</p>
					</div>
				);
			case "about":
			case "whoami":
			case "whois":
				return (
					<div className="space-y-1 text-[10px]">
						<p className="font-bold text-foreground">
							Thanatphong Tarin (WinTuner)
						</p>
						<p className={`${dim} leading-normal`}>
							{language === "th"
								? "นักศึกษาสายวิศวกรรมซอฟต์แวร์ มหาวิทยาลัยเชียงใหม่ ผู้ร่วมก่อตั้งและ CTO ของ Muanjai เชี่ยวชาญด้าน Agentic AI, เว็บแอปพลิเคชัน และ DevOps"
								: "Software engineering student at Chiang Mai University and Co-Founder & CTO of Muanjai. Specializing in Agentic AI, full-stack, and DevOps."}
						</p>
					</div>
				);
			case "skills":
				return (
					<div className="space-y-0.5 font-mono text-[9.5px]">
						<p className="text-primary font-bold mb-1">
							{language === "th" ? "สกิล & ความชำนาญ:" : "Tech Stack & Proficiency:"}
						</p>
						<p>Next.js [██████████████░░░░] 75%</p>
						<p>TypeScript [████████████████░░] 80%</p>
						<p>Node.js [██████████████░░░░] 70%</p>
						<p>Linux/Bash [██████████████████] 90%</p>
						<p>Python [████████████░░░░░░] 60%</p>
						<p>Java [██████████░░░░░░░░] 55%</p>
					</div>
				);
			case "projects":
				return (
					<div className="space-y-1 text-[10px]">
						<p className="text-primary font-bold">
							{language === "th" ? "โปรเจกต์ล่าสุด:" : "Recent Projects:"}
						</p>
						<p>
							•{" "}
							<a href="https://muanjai-ai.up.railway.app/chat/" target="_blank" rel="noopener noreferrer" className={`${green} underline hover:text-emerald-300`}>
								Muanjai
							</a>{" "}
							- {language === "th" ? "AI Compliance Helper Bot" : "AI Compliance Helper Bot"}
						</p>
						<p>
							•{" "}
							<a href="https://github.com/tinodin/AutoOS" target="_blank" rel="noopener noreferrer" className={`${green} underline hover:text-emerald-300`}>
								AutoOS
							</a>{" "}
							- Native WinUI 3 Migrator
						</p>
						<p>
							•{" "}
							<a href="https://github.com/WinTuner/DotDoctor" target="_blank" rel="noopener noreferrer" className={`${green} underline hover:text-emerald-300`}>
								DotDoctor
							</a>{" "}
							- Hyprland Config Checker
						</p>
					</div>
				);
			case "socials":
			case "contact":
				return (
					<div className="space-y-1 text-[10px]">
						<p className="text-primary font-bold">{language === "th" ? "ช่องทางติดต่อ:" : "Socials:"}</p>
						<p>• <span className={cyan}>GitHub</span>: <a href="https://github.com/WinTuner" target="_blank" rel="noopener noreferrer" className={`${green} underline`}>github.com/WinTuner</a></p>
						<p>• <span className={cyan}>LinkedIn</span>: <a href="https://www.linkedin.com/in/thanatphong-tarin-1b6619385/" target="_blank" rel="noopener noreferrer" className={`${green} underline`}>/in/thanatphong-tarin</a></p>
						<p>• <span className={cyan}>Email</span>: <a href="mailto:Thanatphong2719@gmail.com" className={`${green} underline`}>Thanatphong2719@gmail.com</a></p>
					</div>
				);
			case "blog":
				return (
					<div className="space-y-1 text-[10px]">
						<p className="text-primary font-bold">{language === "th" ? "บล็อกของผม:" : "My blog:"}</p>
						<p>
							• <a href="https://wintuner.dev/blog" target="_blank" rel="noopener noreferrer" className={`${green} underline`}>wintuner.dev/blog</a>{" "}
							- {language === "th" ? "บทความเทคนิคเกี่ยวกับ AI, Web และ Systems" : "Technical posts on AI, web & systems"}
						</p>
					</div>
				);
			case "ls":
				return (
					<div className="space-y-1 text-[10px]">
						<p className={`${dim}`}>{language === "th" ? "หัวข้อที่มีให้เปิด:" : "topics you can open:"}</p>
						<p><span className={green}>muanjai</span> <span className={green}>autoos</span> <span className={green}>dotdoctor</span> <span className={green}>github</span> <span className={green}>linkedin</span> <span className={green}>blog</span> <span className={green}>cv</span></p>
						<p className={`${dim}`}>{language === "th" ? "ใช้คำสั่ง: open &lt;name&gt;" : "usage: open <name>"}</p>
					</div>
				);
			case "open": {
				const target = (args[0] || "").toLowerCase();
				const links: Record<string, string> = {
					muanjai: "https://muanjai-ai.up.railway.app/chat/",
					autoos: "https://github.com/tinodin/AutoOS",
					dotdoctor: "https://github.com/WinTuner/DotDoctor",
					github: "https://github.com/WinTuner",
					linkedin: "https://www.linkedin.com/in/thanatphong-tarin-1b6619385/",
					blog: "https://wintuner.dev/blog",
					cv: "https://wintuner.dev/introduction",
				};
				const url = links[target];
				if (!url) {
					return (
						<p className="text-rose-400 text-[10px]">
							{language === "th"
								? `ไม่พบ '${target}' พิมพ์ 'ls' เพื่อดูหัวข้อ`
								: `Unknown target '${target}'. Type 'ls' to see topics.`}
						</p>
					);
				}
				window.open(url, "_blank", "noopener,noreferrer");
				return (
					<p className="text-[10px]">
						<span className={green}>opening</span> <span className={cyan}>{url}</span>
					</p>
				);
			}
			case "echo":
				return <p className="text-[10px] text-slate-300">{args.join(" ")}</p>;
			case "date": {
				const now = new Date().toLocaleString("en-GB", {
					timeZone: "Asia/Bangkok",
					hour12: false,
				});
				return <p className="text-[10px]">{now} (ICT)</p>;
			}
			case "theme":
				setTheme(resolvedTheme === "dark" ? "light" : "dark");
				return (
					<p className="text-[10px]">
						<span className={green}>{language === "th" ? "สลับธีมแล้ว" : "theme toggled"}</span> → {resolvedTheme === "dark" ? "light" : "dark"}
					</p>
				);
			case "matrix":
				window.dispatchEvent(new Event("wintuner:party"));
				return (
					<p className="text-emerald-400 text-[10px]">
						{language === "th" ? "กำลังเข้าสู่เมทริกซ์… 🌧️" : "Wake up, Neo... 🌧️"}
					</p>
				);
			case "banner":
				return (
					<pre className="text-[8px] leading-tight text-primary">
{`  __      __        _   _                 
  \\ \\    / /__ _  _| |_| |_ ___ _ __ _  _ 
   \\ \\/\\/ / _ \\ || |  _|  _/ -_) '_ \\ || |
    \\_/\\_/\\___/\\_,_|\\__|\\__\\___| .__/\\_,_|
                                |_|        `}
					</pre>
				);
			case "sudo":
				if (args[0] === "!!" || args[0]) {
					return (
						<p className="text-rose-400 text-[10px]">
							wintuner is not in the sudoers file. This incident will be reported. 👮
						</p>
					);
				}
				return (
					<p className="text-rose-400 text-[10px]">
						{language === "th" ? "ต้องใช้คำสั่ง: sudo <คำสั่ง>" : "usage: sudo <command>"}
					</p>
				);
			case "history":
				if (commandHistory.length === 0) {
					return <p className={`${dim} text-[10px]`}>{language === "th" ? "ยังไม่มีคำสั่ง" : "No commands yet"}</p>;
				}
				return (
					<div className="space-y-0.5 text-[10px]">
						{commandHistory.map((cmd, idx) => (
							<p key={idx} className={`${dim}`}>
								{String(idx + 1).padStart(2, " ")} {cmd}
							</p>
						))}
					</div>
				);
			case "status":
				setActiveTab("status");
				setCliInput("");
				return null;
			case "git":
				setActiveTab("git");
				setCliInput("");
				return null;
			case "neofetch":
				setActiveTab("neofetch");
				setCliInput("");
				return null;
			case "clear":
				setCliHistory([]);
				setCliInput("");
				return null;
			case "exit":
				setActiveTab("status");
				setCliInput("");
				return null;
			default:
				return (
					<p className="text-rose-400 text-[10px]">
						{language === "th"
							? `ไม่พบคำสั่ง: "${command}" พิมพ์ 'help' เพื่อดูคำแนะนำ`
							: `Command not found: "${command}". Type 'help' for instructions.`}
					</p>
				);
		}
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
						commandHistory={commandHistory}
						historyIndex={historyIndex}
						onInput={(e) => setCliInput(e.target.value)}
						onKeyDown={handleCliKeyDown}
						onSubmit={handleCliSubmit}
					/>
				)}
			</div>
		</div>
	);
}

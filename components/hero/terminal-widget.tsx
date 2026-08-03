"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useLanguage } from "../language-provider"
import { cn } from "@/lib/utils"
import type { ActivityItem } from "@/lib/github"
import { formatJournalDate, formatRelativeTime, getLogType, getMessageText, truncate } from "@/lib/hero-utils"

const FALLBACK_ACTIVITIES: ActivityItem[] = [
  { type: "commit", project: "ProjectPruta", message: "Refine TypeScript structure", time: new Date().toISOString() },
  { type: "commit", project: "OOP-Lab-2026", message: "Finalize Java lab submission", time: new Date(Date.now() - 3600000).toISOString() },
  { type: "commit", project: "aim4-mod", message: "Improve HTML layout and sections", time: new Date(Date.now() - 7200000).toISOString() },
]

const commands = {
  status: "systemctl status github-monitor.service",
  git: "git log -n 3 --oneline",
  neofetch: "neofetch",
  cli: "init-portfolio-cli.sh",
} as const

type TerminalTab = 'status' | 'git' | 'neofetch' | 'cli'

interface TerminalWidgetProps {
  recentActivities?: ActivityItem[]
}

export function TerminalWidget({ recentActivities = [] }: TerminalWidgetProps) {
  const { language } = useLanguage()

  const [activeTab, setActiveTab] = useState<TerminalTab>('status')
  const [typedCommand, setTypedCommand] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showOutput, setShowOutput] = useState(false)

  // Interactive CLI States
  const [cliInput, setCliInput] = useState("")
  const [cliHistory, setCliHistory] = useState<Array<{ command: string; output: React.ReactNode }>>([
    {
      command: "init-portfolio-cli.sh",
      output: (
        <div className="space-y-1">
          <p className="text-emerald-400 font-bold">--- WIN'S INTERACTIVE PORTFOLIO SHELL v1.0.0 ---</p>
          <p className="text-muted-foreground text-[10px]">Type <span className="text-primary font-bold">help</span> to view available commands.</p>
        </div>
      ),
    },
  ])

  // Dynamic Real-time States
  const [cpuLoad, setCpuLoad] = useState(24.5)
  const [ramUsed, setRamUsed] = useState(12.44)
  const [localTime, setLocalTime] = useState("")
  const [liveActivities, setLiveActivities] = useState<ActivityItem[]>(recentActivities)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const fetchLiveActivities = () => {
      fetch("https://api.github.com/users/WinTuner/events?per_page=10")
        .then((res) => {
          if (!res.ok) throw new Error("Status code " + res.status)
          return res.json()
        })
        .then((events) => {
          if (Array.isArray(events)) {
            const parsed: ActivityItem[] = []
            for (const event of events) {
              if (parsed.length >= 5) break
              const project = event.repo.name.replace("WinTuner/", "")
              const time = event.created_at

              if (event.type === "PushEvent") {
                const commits = event.payload.commits || []
                if (commits.length > 0) {
                  parsed.push({
                    type: "commit",
                    project,
                    message: commits[0].message,
                    time,
                  })
                }
              } else if (event.type === "PullRequestEvent") {
                const pr = event.payload.pull_request
                parsed.push({
                  type: "pr",
                  project,
                  message: {
                    en: `${event.payload.action.toUpperCase()}: ${pr?.title || ""}`,
                    th: `${event.payload.action === "opened" ? "เปิด" : event.payload.action === "closed" ? "ปิด" : "รวม"} PR: ${pr?.title || ""}`,
                  },
                  time,
                  prAction: event.payload.action as any,
                  prTitle: pr?.title || "",
                })
              } else if (event.type === "CreateEvent" && event.payload.ref_type === "repository") {
                parsed.push({
                  type: "create",
                  project,
                  message: {
                    en: `Created repository ${project}`,
                    th: `สร้างรีโพสิทอรี ${project}`,
                  },
                  time,
                })
              }
            }
            if (parsed.length > 0) {
              setLiveActivities(parsed)
            }
          }
        })
        .catch((err) => console.warn("Failed client-side live fetch, using build fallback:", err))
    }

    fetchLiveActivities()

    // Periodically fetch live activity every 60 seconds
    const activityInterval = setInterval(fetchLiveActivities, 60000)

    // CPU and RAM dynamic fluctuation ticker (every 2.5 seconds)
    const sysInterval = setInterval(() => {
      setCpuLoad((prev) => {
        const change = (Math.random() - 0.5) * 6
        return parseFloat(Math.min(90, Math.max(5, prev + change)).toFixed(1))
      })
      setRamUsed((prev) => {
        const change = (Math.random() - 0.5) * 0.3
        return parseFloat(Math.min(30.2, Math.max(8.4, prev + change)).toFixed(2))
      })
    }, 2500)

    // Thailand local clock ticking
    const clockInterval = setInterval(() => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Bangkok",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }
      setLocalTime(new Intl.DateTimeFormat("en-US", options).format(new Date()) + " (ICT)")
    }, 1000)

    return () => {
      clearInterval(activityInterval)
      clearInterval(sysInterval)
      clearInterval(clockInterval)
    }
  }, [recentActivities])

  const handleCliSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    const input = cliInput.trim().toLowerCase()
    if (!input) return

    let output: React.ReactNode = null

    switch (input) {
      case "help":
        output = (
          <div className="space-y-1 text-slate-350 text-[10px]">
            <p className="text-primary font-bold">Available Commands:</p>
            <p>  <span className="text-emerald-400 font-bold">about</span>    - Display profile bio summary</p>
            <p>  <span className="text-emerald-400 font-bold">skills</span>   - List primary tech stack with charts</p>
            <p>  <span className="text-emerald-400 font-bold">projects</span> - Show links to active GitHub repositories</p>
            <p>  <span className="text-emerald-400 font-bold">clear</span>    - Clear terminal logs</p>
            <p>  <span className="text-emerald-400 font-bold">exit</span>     - Exit CLI and return to live status</p>
          </div>
        )
        break
      case "about":
        output = (
          <div className="space-y-1 text-[10px]">
            <p className="font-bold text-foreground">Thanatphong Tarin (WinTuner)</p>
            <p className="text-muted-foreground leading-normal">
              {language === "th"
                ? "นักศึกษาสายวิศวกรรมซอฟต์แวร์ มหาวิทยาลัยเชียงใหม่ ผู้ร่วมก่อตั้งและ CTO ของ Muanjai เชี่ยวชาญด้าน Agentic AI, เว็บแอปพลิเคชัน และ DevOps"
                : "Software engineering student at Chiang Mai University and Co-Founder & CTO of Muanjai. Specializing in Agentic AI, full-stack, and DevOps."}
            </p>
          </div>
        )
        break
      case "skills":
        output = (
          <div className="space-y-0.5 font-mono text-[9.5px]">
            <p className="text-primary font-bold mb-1">Tech Stack & Proficiency:</p>
            <p>Next.js   [██████████████░░░░] 75%</p>
            <p>TypeScript [████████████████░░] 80%</p>
            <p>Node.js    [██████████████░░░░] 70%</p>
            <p>Linux/Bash [██████████████████] 90%</p>
          </div>
        )
        break
      case "projects":
        output = (
          <div className="space-y-1 text-[10px]">
            <p className="text-primary font-bold">Recent Projects:</p>
            <p>• <a href="https://muanjai-ai.up.railway.app/chat/" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline hover:text-emerald-300">Muanjai</a> - Agentic AI Travel Assistant</p>
            <p>• <a href="https://github.com/tinodin/AutoOS" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline hover:text-emerald-300">AutoOS</a> - Native WinUI 3 Migrator</p>
            <p>• <a href="https://github.com/WinTuner/DotDoctor" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline hover:text-emerald-300">DotDoctor</a> - Hyprland Config Checker</p>
          </div>
        )
        break
      case "clear":
        setCliHistory([])
        setCliInput("")
        return
      case "exit":
        setActiveTab("status")
        setCliInput("")
        return
      default:
        output = <p className="text-rose-400 text-[10px]">Command not found: "{input}". Type 'help' for instructions.</p>
    }

    setCliHistory((prev) => [...prev, { command: cliInput, output }])
    setCliInput("")
  }

  useEffect(() => {
    const fullCommand = commands[activeTab]
    setTypedCommand("")
    setShowOutput(false)
    setIsTyping(true)

    let i = 0
    const interval = setInterval(() => {
      if (i < fullCommand.length) {
        setTypedCommand(fullCommand.slice(0, i + 1))
        i++
      } else {
        clearInterval(interval)
        setIsTyping(false)
        setShowOutput(true)
      }
    }, 12)

    return () => clearInterval(interval)
  }, [activeTab])

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
          <button
            onClick={() => setActiveTab('status')}
            className={cn(
              "px-3 py-1.5 transition-colors duration-200 border-t border-x rounded-t-md font-semibold",
              activeTab === 'status'
                ? "bg-zinc-900/80 border-zinc-800 text-primary border-t-primary"
                : "bg-zinc-950/40 border-transparent text-muted-foreground hover:bg-zinc-900/30 hover:text-foreground"
            )}
          >
            status.service
          </button>
          <button
            onClick={() => setActiveTab('git')}
            className={cn(
              "px-3 py-1.5 transition-colors duration-200 border-t border-x rounded-t-md font-semibold",
              activeTab === 'git'
                ? "bg-zinc-900/80 border-zinc-800 text-primary border-t-primary"
                : "bg-zinc-950/40 border-transparent text-muted-foreground hover:bg-zinc-900/30 hover:text-foreground"
            )}
          >
            git-log.sh
          </button>
          <button
            onClick={() => setActiveTab('neofetch')}
            className={cn(
              "px-3 py-1.5 transition-colors duration-200 border-t border-x rounded-t-md font-semibold",
              activeTab === 'neofetch'
                ? "bg-zinc-900/80 border-zinc-800 text-primary border-t-primary"
                : "bg-zinc-950/40 border-transparent text-muted-foreground hover:bg-zinc-900/30 hover:text-foreground"
            )}
          >
            neofetch
          </button>
          <button
            onClick={() => setActiveTab('cli')}
            className={cn(
              "px-3 py-1.5 transition-colors duration-200 border-t border-x rounded-t-md font-semibold",
              activeTab === 'cli'
                ? "bg-zinc-900/80 border-zinc-800 text-primary border-t-primary"
                : "bg-zinc-950/40 border-transparent text-muted-foreground hover:bg-zinc-900/30 hover:text-foreground"
            )}
          >
            portfolio-cli.sh
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      <div className={cn("p-4 font-mono text-[11px] leading-relaxed text-slate-300 h-[205px] overflow-y-auto scrollbar-hide", activeTab === 'cli' && "flex flex-col")}>
        {/* Shell Prompt */}
        {activeTab !== 'cli' && (
          <div className="flex items-center gap-1.5 text-muted-foreground/50 mb-3 border-b border-zinc-900 pb-2">
            <span className="text-sky-400 font-bold">wintuner</span>
            <span>@</span>
            <span className="text-purple-400 font-bold">archlinux</span>
            <span className="text-foreground/30">in</span>
            <span className="text-emerald-400">~</span>
            <span className="text-fuchsia-500 font-bold">❯</span>
            <span className="text-foreground font-semibold">{typedCommand}</span>
            {isTyping && <span className="inline-block w-1.5 h-3.5 bg-primary animate-pulse ml-0.5" />}
            {!isTyping && <span className="inline-block w-1.5 h-3.5 bg-zinc-600 animate-pulse ml-0.5" />}
          </div>
        )}

        {/* Tab Output Section */}
        {activeTab === 'status' && showOutput && (() => {
          const activitiesToUse = liveActivities.length > 0 ? liveActivities : FALLBACK_ACTIVITIES
          const latest = activitiesToUse[0]
          const latestMsg = getMessageText(latest.message, language)
          const relativeTime = formatRelativeTime(latest.time, language)
          const systemdTime = new Date(latest.time).toUTCString().replace("GMT", "UTC")
          const logType = getLogType(latest.type)
          const prActionText = latest.prAction ? ` [${latest.prAction.toUpperCase()}]` : ''

          return (
            <div className="space-y-1.5 animate-fade-in">
              <div className="flex items-center gap-1">
                <span className="text-emerald-500 font-bold animate-pulse">●</span>
                <span className="font-bold text-foreground">github-monitor.service</span>
                <span className="text-muted-foreground/80">- Live GitHub Activity Monitor</span>
              </div>
              <div className="pl-3 text-muted-foreground/90">
                Loaded: <span className="text-emerald-400">loaded</span> (/etc/systemd/system/github-monitor.service; enabled)
              </div>
              <div className="pl-3 text-muted-foreground/90">
                Active: <span className="text-emerald-400 font-bold">active (running)</span> since {systemdTime}
              </div>
              <div className="pl-3 text-muted-foreground/90">
                Status: <span className="text-sky-300">"Synced with GitHub API (revalidated cache)"</span>
              </div>
              <div className="pl-3 text-muted-foreground/90 mb-3">
                Main PID: 1337 (node-server)
              </div>

              <div className="border-t border-zinc-900 my-2 pt-2 text-[9px] text-muted-foreground/50 uppercase tracking-wider font-bold">
                Journalctl Logs:
              </div>
              <div className="space-y-1 text-[10.5px]">
                <div className="text-muted-foreground/75">
                  <span className="text-zinc-500">{formatJournalDate(latest.time)}</span> arch systemd[1]: Started WinTuner's Live GitHub Monitor.
                </div>
                <div className="text-slate-200">
                  <span className="text-zinc-500">{formatJournalDate(latest.time)}</span> arch <span className="text-cyan-400 font-semibold">github-monitor[1337]</span>: <span className="text-emerald-400 font-bold">[{logType}{prActionText}]</span> {latest.project} ❯ "{latestMsg}" <span className="text-muted-foreground text-[9px] font-normal font-sans ml-1">({relativeTime})</span>
                </div>
              </div>

              <div className="pt-3 flex items-center gap-1.5 border-t border-zinc-900/60 mt-3">
                <span className="text-fuchsia-500 font-bold">❯</span>
                <Link
                  href="/workbench"
                  className="text-primary hover:underline font-bold flex items-center gap-1 group/link text-[10px]"
                >
                  ./view-workbench.sh
                  <span className="text-muted-foreground text-[9px] font-normal group-hover/link:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            </div>
          )
        })()}

        {activeTab === 'git' && showOutput && (() => {
          const activitiesToUse = liveActivities.length > 0 ? liveActivities : FALLBACK_ACTIVITIES
          const gitLogs = activitiesToUse.slice(0, 3).map((act, index) => {
            const hashVal = (act.project + act.time + index).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
            const hexHash = (hashVal * 9876543).toString(16).substring(0, 7)
            const msg = getMessageText(act.message, language)
            const relTime = formatRelativeTime(act.time, language)
            const refText = index === 0 ? " (HEAD -> main, origin/main)" : ""
            return { hash: hexHash, ref: refText, project: act.project, message: msg, time: relTime }
          })

          return (
            <div className="space-y-1.5 animate-fade-in text-[10.5px]">
              {gitLogs.map((log, index) => (
                <div key={index} className="flex flex-wrap items-start gap-1 font-mono">
                  <span className="text-zinc-600 font-bold">*</span>
                  <span className="text-amber-400 font-semibold">{log.hash}</span>
                  {log.ref && <span className="text-cyan-400 font-semibold">{log.ref}</span>}
                  <span className="text-emerald-400 font-medium">[{log.project}]</span>
                  <span className="text-slate-100 flex-1 min-w-[150px] break-words">
                    {truncate(log.message, 50)}
                  </span>
                  <span className="text-zinc-500 font-normal font-sans ml-auto text-[9px]">{log.time}</span>
                  <span className="text-sky-400 font-semibold text-[9px]">&lt;WinTuner&gt;</span>
                </div>
              ))}

              <div className="pt-3 flex items-center gap-1.5 border-t border-zinc-900/60 mt-4">
                <span className="text-fuchsia-500 font-bold">❯</span>
                <Link
                  href="/workbench"
                  className="text-primary hover:underline font-bold flex items-center gap-1 group/link text-[10px]"
                >
                  git show --workbench
                  <span className="text-muted-foreground text-[9px] font-normal group-hover/link:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            </div>
          )
        })()}

        {activeTab === 'neofetch' && showOutput && (
          <div className="flex flex-col sm:flex-row gap-5 animate-fade-in text-[10px] sm:text-[10.5px]">
            {/* Arch Logo in ASCII */}
            <pre className="text-cyan-400 leading-none select-none font-bold font-mono">
{`      /\\
     /  \\
    /\\   \\
   /  __  \\
  /  (  )  \\
 /  .-'\`'-. \\
/___(____)___\\`}
            </pre>

            {/* Spec list */}
            <div className="space-y-0.5 text-slate-300 flex-1">
              <div>
                <span className="text-[#a78bfa] font-bold">wintuner</span>@<span className="text-cyan-400 font-bold">cachyos</span>
              </div>
              <div className="text-zinc-700 font-sans leading-none pb-1">---------------------</div>
              <div>
                <span className="text-sky-400">OS</span>: CachyOS Linux (Arch-based) x86_64
              </div>
              <div>
                <span className="text-sky-400">Host</span>: Next.js Vercel Edge Server
              </div>
              <div>
                <span className="text-sky-400">Kernel</span>: Linux 6.10-cachyos
              </div>
              <div>
                <span className="text-sky-400">Uptime</span>: 99.9% (Continuous Caching)
              </div>
              <div>
                <span className="text-sky-400">Shell</span>: zsh 5.9
              </div>
              <div>
                <span className="text-sky-400">WM</span>: Hyprland (Wayland)
              </div>
              <div>
                <span className="text-sky-400">CPU</span>: AMD Ryzen 7 7840HS (8C 16T) @ 5.1GHz{" "}
                <span className="text-emerald-400 font-mono text-[9px] ml-2 animate-pulse bg-emerald-500/10 border border-emerald-500/30 px-1 py-0.5 rounded">
                  {mounted ? `${cpuLoad}% load` : "Calculating..."}
                </span>
              </div>
              <div>
                <span className="text-sky-400">Memory</span>:{" "}
                {mounted ? `${ramUsed}GB / 32GB` : "16GB / 32GB"}{" "}
                <span className="text-muted-foreground/60 text-[9px] ml-1">
                  {mounted ? `(${Math.round((ramUsed / 32) * 100)}%)` : "(50%)"}
                </span>
              </div>
              <div>
                <span className="text-sky-400">Time (CMU/TH)</span>:{" "}
                <span className="text-yellow-400 font-mono font-semibold">
                  {mounted ? localTime : "Loading... (ICT)"}
                </span>
              </div>

              {/* Color blocks */}
              <div className="flex gap-1 pt-2">
                <span className="inline-block w-3.5 h-3 bg-black border border-zinc-800" />
                <span className="inline-block w-3.5 h-3 bg-red-500" />
                <span className="inline-block w-3.5 h-3 bg-green-500" />
                <span className="inline-block w-3.5 h-3 bg-yellow-500" />
                <span className="inline-block w-3.5 h-3 bg-blue-500" />
                <span className="inline-block w-3.5 h-3 bg-fuchsia-500" />
                <span className="inline-block w-3.5 h-3 bg-cyan-500" />
                <span className="inline-block w-3.5 h-3 bg-white" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cli' && showOutput && (
          <div className="flex flex-col flex-1 h-full select-text min-h-0">
            <div className="flex-1 overflow-y-auto space-y-1.5 scrollbar-hide min-h-0 mb-2 pr-0.5">
              {cliHistory.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center gap-1 text-muted-foreground/50">
                    <span className="text-sky-400">wintuner</span>@<span className="text-purple-400">archlinux</span>
                    <span className="text-fuchsia-500 font-bold">❯</span>
                    <span className="text-foreground font-semibold">{item.command}</span>
                  </div>
                  <div className="pl-3 text-slate-300 leading-normal">{item.output}</div>
                </div>
              ))}
            </div>
            <form onSubmit={handleCliSubmit} className="flex items-center gap-1.5 border-t border-zinc-950 pt-2.5 mt-auto bg-zinc-950/80">
              <span className="text-sky-400 font-bold">wintuner</span>@<span className="text-purple-400 font-bold">archlinux</span>
              <span className="text-fuchsia-500 font-bold">❯</span>
              <input
                type="text"
                value={cliInput}
                onChange={(e) => setCliInput(e.target.value)}
                placeholder="type 'help'..."
                className="flex-1 bg-transparent border-none outline-none text-foreground p-0 m-0 font-mono text-[11px] focus:ring-0 focus:outline-none"
                autoFocus
              />
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

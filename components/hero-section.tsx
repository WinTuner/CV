"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useLanguage } from "./language-provider"
import { cn } from "@/lib/utils"
import type { ActivityItem } from "@/lib/github"

const roles = {
  en: ["building interfaces", "exploring systems", "breaking barriers", "forging ideas", "crafting code"],
  th: ["สร้างอินเทอร์เฟซ", "สำรวจระบบ", "ทลายข้อจำกัด", "หลอมรวมไอเดีย", "เขียนโค้ดอย่างประณีต"],
} as const

function formatRelativeTime(dateString: string, language: 'en' | 'th') {
  const date = new Date(dateString)
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  
  if (isNaN(seconds)) return dateString

  const intervals = {
    en: [
      { label: 'year', secs: 31536000 },
      { label: 'month', secs: 2592000 },
      { label: 'day', secs: 86400 },
      { label: 'hour', secs: 3600 },
      { label: 'minute', secs: 60 },
      { label: 'second', secs: 1 }
    ],
    th: [
      { label: 'ปี', secs: 31536000 },
      { label: 'เดือน', secs: 2592000 },
      { label: 'วัน', secs: 86400 },
      { label: 'ชั่วโมง', secs: 3600 },
      { label: 'นาที', secs: 60 },
      { label: 'วินาที', secs: 1 }
    ]
  }

  const currentIntervals = intervals[language]
  for (const interval of currentIntervals) {
    const count = Math.floor(seconds / interval.secs)
    if (count >= 1) {
      if (language === 'en') {
        return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`
      } else {
        return `${count} ${interval.label}ที่แล้ว`
      }
    }
  }
  return language === 'en' ? 'just now' : 'เมื่อสักครู่'
}

function formatJournalDate(dateString: string) {
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return "Jun 26 22:09:54"
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const month = months[date.getMonth()]
  const day = String(date.getDate()).padStart(2, ' ')
  const time = date.toTimeString().split(' ')[0] // e.g. "22:09:54"
  return `${month} ${day} ${time}`
}

function getMessageText(msg: any, lang: 'en' | 'th') {
  if (!msg) return ""
  if (typeof msg === 'string') return msg
  return msg[lang] || msg.en || ""
}

function truncate(str: string, len: number) {
  return str.length > len ? str.slice(0, len) + "..." : str
}

function getLogType(type: string) {
  switch(type) {
    case 'commit': return 'COMMIT'
    case 'pr': return 'PULL_REQ'
    case 'create': return 'CREATE'
    default: return 'ACTIVITY'
  }
}

export interface HeroSectionProps {
  recentActivities?: ActivityItem[]
}

export function HeroSection({ recentActivities = [] }: HeroSectionProps) {
  const { language } = useLanguage()
  const [currentRole, setCurrentRole] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const currentRoles = roles[language]

  // Terminal Dashboard State
  const [activeTab, setActiveTab] = useState<'status' | 'git' | 'neofetch'>('status')
  const [typedCommand, setTypedCommand] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showOutput, setShowOutput] = useState(false)

  const commands = {
    status: "systemctl status github-monitor.service",
    git: "git log -n 3 --oneline",
    neofetch: "neofetch"
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

  const copy = {
    en: {
      kicker: "WinTuner - Where Code Meets Curiosity",
      intro:
        "DevOps Engineer & Open Source Contributor. I specialize in building high-performance web applications and optimizing IT infrastructures. Currently focused on Next.js, Node.js, and Linux system engineering.",
      explore: "explore artifacts",
      resume: "resume",
      scroll: "scroll",
      status: "status: forging",
      loaded: "experiments loaded: 12",
      spark: "last spark: today",
    },
    th: {
      kicker: "WinTuner - ที่ที่โค้ดเจอกับความอยากรู้อยากเห็น",
      intro:
        "DevOps Engineer และ Open Source Contributor เชี่ยวชาญการสร้างเว็บแอปพลิเคชันประสิทธิภาพสูงและการจัดการโครงสร้างพื้นฐานไอที เน้นการพัฒนาด้วย Next.js, Node.js และวิศวกรรมระบบ Linux",
      explore: "สำรวจผลงาน",
      resume: "เรซูเม่",
      scroll: "เลื่อนลง",
      status: "สถานะ: กำลังพัฒนา",
      loaded: "โหลดการทดลองแล้ว: 12",
      spark: "อัปเดตล่าสุด: วันนี้",
    },
  } as const

  const t = copy[language]

  useEffect(() => {
    const targetText = currentRoles[currentRole]
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (displayText.length < targetText.length) {
            setDisplayText(targetText.slice(0, displayText.length + 1))
          } else {
            setTimeout(() => setIsDeleting(true), 2000)
          }
        } else {
          if (displayText.length > 0) {
            setDisplayText(displayText.slice(0, -1))
          } else {
            setIsDeleting(false)
            setCurrentRole((prev) => (prev + 1) % currentRoles.length)
          }
        }
      },
      isDeleting ? 50 : 100,
    )
    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, currentRole, currentRoles])

  return (
    <section className="relative px-4 sm:px-6 pt-28 sm:pt-36 pb-16 sm:pb-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 lg:items-center lg:min-h-[70vh]">
          {/* Left column - Text */}
          <div className="space-y-8 sm:space-y-10">
            <div className="space-y-3 animate-fade-in-up">
              <p className="font-mono text-xs uppercase tracking-[0.25em] sm:tracking-[0.35em] text-primary">
                {t.kicker}
              </p>
              <h1 className="text-4xl font-bold tracking-tight sm:text-4xl lg:text-5xl xl:text-6xl text-balance">
                Forging digital
                <br />
                <span
                  className="bg-gradient-to-l from-primary/50 to-accent text-transparent bg-clip-text typing-cursor inline-block min-h-[1.2em]"
                >
                  {displayText || "\u00A0"}
                </span>
              </h1>
            </div>

            <p className="max-w-lg text-base sm:text-lg leading-relaxed text-muted-foreground animate-fade-in-up stagger-2">
              {t.intro}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up stagger-3">
              <a
                href="#projects"
                className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-lg border border-primary bg-primary/10 px-7 py-4 sm:py-3.5 font-mono text-sm text-primary transition-all duration-500 hover:bg-primary hover:text-primary-foreground active:scale-[0.98]"
              >
                <span className="relative z-10">{t.explore}</span>
                <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">→</span>
                {/* Animated background */}
                <span className="absolute inset-0 -translate-x-full bg-primary transition-transform duration-500 group-hover:translate-x-0" />
              </a>
              <Link
                href="/introduction"
                className="group inline-flex items-center justify-center gap-3 rounded-lg border border-border px-7 py-4 sm:py-3.5 font-mono text-sm text-muted-foreground transition-all duration-300 hover:border-foreground hover:text-foreground hover:bg-secondary/50 active:scale-[0.98]"
              >
                <span>{t.resume}</span>
                <span className="opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                  →
                </span>
              </Link>
            </div>

            {/* Minimal Custom Linux Terminal Widget */}
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
                </div>
              </div>

              {/* Terminal Body */}
              <div className="p-4 font-mono text-[11px] leading-relaxed text-slate-300 h-[205px] overflow-y-auto scrollbar-hide">
                {/* Shell Prompt */}
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

                {/* Tab Output Section */}
                {activeTab === 'status' && showOutput && (() => {
                  const activitiesToUse = recentActivities.length > 0 ? recentActivities : [
                    { type: "commit" as const, project: "ProjectPruta", message: "Refine TypeScript structure", time: new Date().toISOString() },
                    { type: "commit" as const, project: "OOP-Lab-2026", message: "Finalize Java lab submission", time: new Date(Date.now() - 3600000).toISOString() },
                    { type: "commit" as const, project: "aim4-mod", message: "Improve HTML layout and sections", time: new Date(Date.now() - 7200000).toISOString() },
                  ]
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
                  const activitiesToUse = recentActivities.length > 0 ? recentActivities : [
                    { type: "commit" as const, project: "ProjectPruta", message: "Refine TypeScript structure", time: new Date().toISOString() },
                    { type: "commit" as const, project: "OOP-Lab-2026", message: "Finalize Java lab submission", time: new Date(Date.now() - 3600000).toISOString() },
                    { type: "commit" as const, project: "aim4-mod", message: "Improve HTML layout and sections", time: new Date(Date.now() - 7200000).toISOString() },
                  ]
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
                        <span className="text-sky-400">CPU</span>: AMD Ryzen 7 7840HS (8C 16T) @ 5.1GHz
                      </div>
                      <div>
                        <span className="text-sky-400">Memory</span>: 16GB / 32GB
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
              </div>
            </div>
          </div>

          {/* Right column - Visual / Portrait */}
          <div className="relative animate-scale-in stagger-4">
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card/60 glass p-1 hover-lift shadow-2xl shadow-primary/10">
              {/* Terminal header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-background/40 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
                  <div className="h-2.5 w-2.5 rounded-full bg-primary/60" />
                </div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/70">
                  identity_protocol.v0
                </div>
                <div className="w-10" /> {/* Spacer */}
              </div>

              {/* Image Container */}
              <div className="relative aspect-[3/4] overflow-hidden group">
                <img
                  src="/developer-portrait.png"
                  alt="Developer Portrait"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[0.2] contrast-[1.1]"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800"
                  }}
                />
                
                {/* Scanline overlay */}
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%]" />
                
                {/* Vignette */}
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle,transparent_40%,rgba(0,0,0,0.4)_100%)]" />

                {/* Status Overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-lg border border-white/10 bg-black/40 backdrop-blur-md p-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-2 w-2">
                      <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-75" />
                      <div className="relative h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-mono text-[10px] uppercase text-white/90 leading-none mb-1">Status</span>
                      <span className="font-mono text-[12px] text-primary font-bold leading-none">{t.status.split(': ')[1]}</span>
                    </div>
                  </div>
                  <div className="h-8 w-px bg-white/10" />
                  <div className="flex flex-col items-end">
                    <span className="font-mono text-[10px] uppercase text-white/90 leading-none mb-1">Uptime</span>
                    <span className="font-mono text-[12px] text-white/70 font-bold leading-none">99.9%</span>
                  </div>
                </div>
              </div>

              {/* Data footer */}
              <div className="px-4 py-4 grid grid-cols-2 gap-4 border-t border-border/50 bg-background/20">
                <div className="space-y-1">
                  <p className="font-mono text-[9px] uppercase text-muted-foreground">Coordinates</p>
                  <p className="font-mono text-xs text-foreground">13.7563° N, 100.5018° E</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="font-mono text-[9px] uppercase text-muted-foreground">Kernel</p>
                  <p className="font-mono text-xs text-primary">v16.2.4-stable</p>
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <div className="absolute -right-4 -top-4 rounded-xl border border-primary/30 bg-primary/10 backdrop-blur-xl px-4 py-2 font-mono text-[11px] text-primary animate-float shadow-xl shadow-primary/20">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                <span>AUTHORIZED_USER</span>
              </div>
            </div>
            
            <div
              className="absolute -bottom-4 -left-4 rounded-xl border border-border bg-card/80 backdrop-blur-xl px-4 py-2 font-mono text-[11px] text-muted-foreground animate-float shadow-xl"
              style={{ animationDelay: "1.5s" }}
            >
              LOC: BANGKOK_TH
            </div>

            {/* Glow background */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] rounded-full bg-primary/10 blur-3xl animate-pulse" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 animate-fade-in stagger-6">
        <span className="font-mono text-xs text-muted-foreground">{t.scroll}</span>
        <div className="w-px h-12 bg-gradient-to-b from-primary/50 to-transparent animate-pulse" />
      </div>
    </section>
  )
}

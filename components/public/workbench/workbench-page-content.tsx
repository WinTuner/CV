"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Github, ExternalLink, Clock, GitBranch, Activity } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

const wipItems = {
  en: [
    {
      id: 100,
      name: "aim4-mod",
      description: "HTML project for AIM4 Mod and static layout practice",
      progress: 40,
      lastUpdated: "2026",
      url: "https://github.com/WinTuner/aim4-mod",
      branch: "main",
      commits: 12,
    },
    {
      id: 101,
      name: "ProjectPruta",
      description: "Forked from farpinta/ProjectPruta and extended as a TypeScript municipal web app",
      progress: 55,
      lastUpdated: "2026",
      url: "https://github.com/WinTuner/ProjectPruta",
      branch: "main",
      commits: 24,
    },
    {
      id: 102,
      name: "OOP-Lab-2026",
      description: "Java final project for OOP Lab 2026",
      progress: 70,
      lastUpdated: "2026",
      url: "https://github.com/WinTuner/OOP-Lab-2026",
      branch: "final",
      commits: 18,
    },
  ],
  th: [
    {
      id: 100,
      name: "aim4-mod",
      description: "โปรเจกต์ HTML สำหรับ AIM4 Mod และฝึกจัดเลย์เอาต์แบบ static",
      progress: 40,
      lastUpdated: "2026",
      url: "https://github.com/WinTuner/aim4-mod",
      branch: "main",
      commits: 12,
    },
    {
      id: 101,
      name: "ProjectPruta",
      description: "Fork จาก farpinta/ProjectPruta และต่อยอดเป็นเว็บแอปเทศบาลด้วย TypeScript",
      progress: 55,
      lastUpdated: "2026",
      url: "https://github.com/WinTuner/ProjectPruta",
      branch: "main",
      commits: 24,
    },
    {
      id: 102,
      name: "OOP-Lab-2026",
      description: "โปรเจกต์ Java ส่งท้ายวิชา OOP Lab 2026",
      progress: 70,
      lastUpdated: "2026",
      url: "https://github.com/WinTuner/OOP-Lab-2026",
      branch: "final",
      commits: 18,
    },
  ],
} as const

const recentActivity = {
  en: [
    { type: "commit", project: "ProjectPruta", message: "Refine TypeScript structure", time: "2 hours ago" },
    { type: "commit", project: "OOP-Lab-2026", message: "Finalize Java lab submission", time: "6 hours ago" },
    { type: "commit", project: "aim4-mod", message: "Improve HTML layout and sections", time: "1 day ago" },
  ],
  th: [
    { type: "commit", project: "ProjectPruta", message: "ปรับโครงสร้าง TypeScript", time: "2 ชั่วโมงที่แล้ว" },
    { type: "commit", project: "OOP-Lab-2026", message: "สรุปงานส่งท้ายแลป Java", time: "6 ชั่วโมงที่แล้ว" },
    { type: "commit", project: "aim4-mod", message: "ปรับเลย์เอาต์ HTML และส่วนเนื้อหา", time: "1 วันที่แล้ว" },
  ],
} as const

export function WorkbenchPageContent() {
  const { language } = useLanguage()
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  const t = {
    en: {
      kicker: "Work in Progress",
      title: "Workbench",
      desc:
        "Active experiments and prototypes. Things that are being built, broken, and rebuilt. Real-time progress on ongoing projects.",
      live: "live",
      commits: "commits",
      pressEnter: "press enter to run",
      stats: "Stats",
      active: "Active",
      avgProgress: "Avg Progress",
      recentActivity: "Recent Activity",
    },
    th: {
      kicker: "กำลังพัฒนา",
      title: "Workbench",
      desc: "พื้นที่ทดลองและต้นแบบที่กำลังพัฒนา สิ่งที่กำลังถูกสร้าง พัง และสร้างใหม่ พร้อมความคืบหน้าแบบเรียลไทม์",
      live: "ออนไลน์",
      commits: "คอมมิต",
      pressEnter: "กด enter เพื่อรัน",
      stats: "สถิติ",
      active: "กำลังทำ",
      avgProgress: "ความคืบหน้าเฉลี่ย",
      recentActivity: "กิจกรรมล่าสุด",
    },
  }[language]

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="px-4 sm:px-6 py-12 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <div className={cn("mb-12 sm:mb-16 space-y-4 opacity-0", isVisible && "animate-fade-in-up")}>
          <p className="font-mono text-xs uppercase tracking-[0.25em] sm:tracking-[0.35em] text-primary">{t.kicker}</p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">{t.title}</h1>
          <p className="max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">{t.desc}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div
              className={cn(
                "rounded-xl border border-border bg-card/40 glass backdrop-blur-sm overflow-hidden hover-lift opacity-0",
                isVisible && "animate-scale-in stagger-2",
              )}
            >
              <div className="flex items-center gap-3 border-b border-border/50 bg-secondary/40 px-4 sm:px-5 py-3.5 sm:py-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-destructive/60 transition-colors hover:bg-destructive cursor-pointer" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/60 transition-colors hover:bg-yellow-500 cursor-pointer" />
                  <div className="h-3 w-3 rounded-full bg-primary/60 transition-colors hover:bg-primary cursor-pointer" />
                </div>
                <span className="ml-4 font-mono text-xs text-muted-foreground truncate">~/WinTuner/active</span>
                <div className="ml-auto flex items-center gap-2 text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="font-mono text-xs">{t.live}</span>
                </div>
              </div>

              <div className="divide-y divide-border/30">
                {wipItems[language].map((item, index) => (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "group flex flex-col gap-4 p-5 sm:p-6 transition-all duration-300 sm:flex-row sm:items-center sm:justify-between opacity-0",
                      isVisible && "animate-fade-in",
                      hoveredItem === item.id && "bg-secondary/30",
                    )}
                    style={{ animationDelay: `${index * 80 + 300}ms` }}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <div className="flex-1 space-y-2 min-w-0">
                      <div className="flex items-center gap-3">
                        <span className="text-primary font-mono text-sm shrink-0 transition-transform duration-300 group-hover:translate-x-1">$</span>
                        <h4 className="font-mono text-sm font-medium tracking-tight transition-colors group-hover:text-gradient truncate">
                          {item.name}
                        </h4>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <Github className="h-3.5 w-3.5 text-muted-foreground" />
                          <ExternalLink className="h-3 w-3 text-muted-foreground" />
                        </div>
                      </div>
                      <p className="pl-6 text-xs text-muted-foreground line-clamp-2 sm:line-clamp-1">{item.description}</p>
                      <div className="pl-6 flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <GitBranch className="h-3 w-3" />
                          {item.branch}
                        </span>
                        <span>
                          {item.commits} {t.commits}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-6 pl-6 sm:pl-0 sm:justify-end">
                      <div className="flex items-center gap-3 flex-1 sm:flex-none">
                        <div className="h-2 w-full sm:w-28 overflow-hidden rounded-full bg-secondary/80 relative">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all duration-700 ease-out",
                              item.progress >= 80 ? "bg-primary" : item.progress >= 50 ? "bg-yellow-500" : "bg-orange-500",
                            )}
                            style={{ width: `${item.progress}%` }}
                          />
                          <div className="absolute inset-0 animate-shimmer opacity-30" />
                        </div>
                        <span
                          className={cn(
                            "font-mono text-xs w-10 shrink-0 transition-colors",
                            item.progress >= 80 ? "text-primary" : "text-muted-foreground",
                          )}
                        >
                          {item.progress}%
                        </span>
                      </div>

                      <span className="font-mono text-xs text-muted-foreground shrink-0">{item.lastUpdated}</span>
                    </div>
                  </a>
                ))}
              </div>

              <div className="border-t border-border/50 bg-secondary/30 px-4 sm:px-5 py-4">
                <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                  <span className="text-primary">❯</span>
                  <span className="typing-cursor truncate">git status --all</span>
                  <span className="ml-auto text-primary/50 hidden sm:block">{t.pressEnter}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div
              className={cn(
                "rounded-xl border border-border bg-card/40 glass p-5 opacity-0",
                isVisible && "animate-fade-in-up stagger-3",
              )}
            >
              <h3 className="font-mono text-xs uppercase tracking-wider text-primary mb-4">{t.stats}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 rounded-lg bg-secondary/30">
                  <p className="text-2xl font-bold text-foreground">{wipItems[language].length}</p>
                  <p className="font-mono text-xs text-muted-foreground">{t.active}</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-secondary/30">
                  <p className="text-2xl font-bold text-primary">
                    {Math.round(wipItems[language].reduce((a, b) => a + b.progress, 0) / wipItems[language].length)}%
                  </p>
                  <p className="font-mono text-xs text-muted-foreground">{t.avgProgress}</p>
                </div>
              </div>
            </div>

            <div
              className={cn(
                "rounded-xl border border-border bg-card/40 glass p-5 opacity-0",
                isVisible && "animate-fade-in-up stagger-4",
              )}
            >
              <h3 className="font-mono text-xs uppercase tracking-wider text-primary mb-4 flex items-center gap-2">
                <Activity className="h-3.5 w-3.5" />
                {t.recentActivity}
              </h3>
              <div className="space-y-3">
                {recentActivity[language].map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 text-xs">
                    <span
                      className={cn(
                        "shrink-0 w-1.5 h-1.5 rounded-full mt-1.5",
                        activity.type === "commit" ? "bg-primary" : "bg-yellow-500",
                      )}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-foreground truncate">{activity.message}</p>
                      <p className="text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

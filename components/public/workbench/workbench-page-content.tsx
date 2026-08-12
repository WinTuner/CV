"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { ExternalLink, Clock, GitBranch, Activity } from "lucide-react"
import { GithubIcon } from "../../social-icons"
import { useLanguage } from "@/components/language-provider"
import type { WipItem, ActivityItem } from "@/lib/github"
import { useLiveGithubActivity } from "@/lib/use-live-github-activity"

function formatDate(dateString: string, language: 'en' | 'th') {
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return dateString
  return date.toLocaleDateString(language === 'en' ? 'en-US' : 'th-TH', {
    month: 'short',
    day: 'numeric'
  })
}

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

export function WorkbenchPageContent({
  wipItems = [],
  recentActivity = [],
}: {
  wipItems?: WipItem[]
  recentActivity?: ActivityItem[]
}) {
  const { language } = useLanguage()
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const liveActivity = useLiveGithubActivity(recentActivity)

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
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional mount animation trigger
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
                {wipItems.map((item, index) => (
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
                          <GithubIcon className="h-3.5 w-3.5 text-muted-foreground" />
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

                      <span className="font-mono text-xs text-muted-foreground shrink-0">{formatDate(item.lastUpdated, language)}</span>
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
                  <p className="text-2xl font-bold text-foreground">{wipItems.length}</p>
                  <p className="font-mono text-xs text-muted-foreground">{t.active}</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-secondary/30">
                  <p className="text-2xl font-bold text-primary">
                    {wipItems.length > 0
                      ? `${Math.round(wipItems.reduce((a, b) => a + b.progress, 0) / wipItems.length)}%`
                      : "0%"}
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
                {liveActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 text-xs">
                    <span
                      className={cn(
                        "shrink-0 w-1.5 h-1.5 rounded-full mt-1.5",
                        activity.type === "commit" && "bg-primary",
                        activity.type === "pr" && activity.prAction === "opened" && "bg-emerald-500",
                        activity.type === "pr" && activity.prAction === "merged" && "bg-purple-500",
                        activity.type === "pr" && activity.prAction === "closed" && "bg-rose-500",
                        (!activity.type || (activity.type !== "commit" && activity.type !== "pr")) && "bg-yellow-500"
                      )}
                    />
                    <div className="min-w-0 flex-1">
                      {activity.type === "pr" && activity.prAction && activity.prTitle ? (
                        <div className="flex flex-wrap items-center gap-1.5 text-foreground leading-normal">
                          <span
                            className={cn(
                              "rounded px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider border shrink-0",
                              activity.prAction === "opened" && "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                              activity.prAction === "merged" && "bg-purple-500/10 text-purple-400 border-purple-500/20",
                              activity.prAction === "closed" && "bg-rose-500/10 text-rose-400 border-rose-500/20"
                            )}
                          >
                            {activity.prAction === "opened" ? (language === "th" ? "เปิด" : "OPENED") :
                             activity.prAction === "merged" ? (language === "th" ? "รวม" : "MERGED") :
                             (language === "th" ? "ปิด" : "CLOSED")}
                          </span>
                          <span className="truncate flex-1">{activity.prTitle}</span>
                        </div>
                      ) : (
                        <p className="text-foreground truncate">
                          {typeof activity.message === "object" ? activity.message[language] : activity.message}
                        </p>
                      )}
                      <p className="text-muted-foreground flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" />
                        {formatRelativeTime(activity.time, language)}
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

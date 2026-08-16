"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ExternalLink, Clock, GitBranch, Activity } from "lucide-react";
import { GithubIcon } from "../../social-icons";
import { useLanguage } from "@/components/language-provider";
import type { WipItem, ActivityItem } from "@/lib/github";
import { useLiveGithubActivity } from "@/lib/use-live-github-activity";
import { formatRelativeTime } from "@/lib/hero-utils";

function formatDate(dateString: string, language: "en" | "th") {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString(language === "en" ? "en-US" : "th-TH", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
  });
}

export function WorkbenchPageContent({
  wipItems = [],
  recentActivity = [],
}: {
  wipItems?: WipItem[];
  recentActivity?: ActivityItem[];
}) {
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const liveActivity = useLiveGithubActivity(recentActivity);

  const t = {
    en: {
      kicker: "In Progress",
      title: "Workbench",
      desc:
        "Active experiments and prototypes. Things that are being built, broken, and rebuilt. Real-time progress on ongoing projects.",
      commits: "commits",
      stats: "Stats",
      active: "Active",
      avgProgress: "Avg Progress",
      recentActivity: "Recent Activity",
    },
    th: {
      kicker: "กำลังพัฒนา",
      title: "Workbench",
      desc: "พื้นที่ทดลองและต้นแบบที่กำลังพัฒนา สิ่งที่กำลังถูกสร้าง พัง และสร้างใหม่ พร้อมความคืบหน้าแบบเรียลไทม์",
      commits: "คอมมิต",
      stats: "สถิติ",
      active: "กำลังทำ",
      avgProgress: "ความคืบหน้าเฉลี่ย",
      recentActivity: "กิจกรรมล่าสุด",
    },
  }[language];

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional mount animation trigger
    setIsVisible(true);
  }, []);

  return (
    <section className="px-4 sm:px-6 py-12 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <div className={cn("mb-12 sm:mb-16 space-y-4 opacity-0", isVisible && "animate-fade-in-up")}>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">{t.kicker}</p>
          <h1 className="font-serif text-5xl sm:text-6xl font-medium tracking-tight">{t.title}</h1>
          <p className="max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">{t.desc}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className={cn("border border-border/70 bg-card opacity-0", isVisible && "animate-fade-in-up stagger-2")}>
              <div className="divide-y divide-border/60">
                {wipItems.map((item, index) => (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "group flex flex-col gap-4 p-5 sm:p-6 transition-colors duration-300 sm:flex-row sm:items-center sm:justify-between opacity-0 hover:bg-secondary/30",
                      isVisible && "animate-fade-in",
                    )}
                    style={{ animationDelay: `${index * 80 + 200}ms` }}
                  >
                    <div className="flex-1 space-y-2 min-w-0">
                      <div className="flex items-center gap-3">
                        <h4 className="font-serif text-lg font-medium tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary truncate">
                          {item.name}
                        </h4>
                        <div className="flex shrink-0 items-center gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          <GithubIcon className="h-3.5 w-3.5 text-muted-foreground" />
                          <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 sm:line-clamp-1">{item.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <GitBranch className="h-3 w-3" />
                          {item.branch}
                        </span>
                        <span>
                          {item.commits} {t.commits}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-6 sm:justify-end">
                      <div className="flex w-full items-center gap-3 sm:w-40 sm:flex-none">
                        <div className="h-1 w-full overflow-hidden rounded-full bg-secondary">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all duration-700 ease-out",
                              item.progress >= 80 ? "bg-primary" : item.progress >= 50 ? "bg-accent" : "bg-muted-foreground/60",
                            )}
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                        <span
                          className={cn(
                            "w-10 shrink-0 font-mono text-xs",
                            item.progress >= 80 ? "text-primary" : "text-muted-foreground",
                          )}
                        >
                          {item.progress}%
                        </span>
                      </div>

                      <span className="shrink-0 font-mono text-xs text-muted-foreground">{formatDate(item.lastUpdated, language)}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className={cn("border border-border/70 bg-card p-6 opacity-0", isVisible && "animate-fade-in-up stagger-3")}>
              <h3 className="mb-5 font-mono text-xs uppercase tracking-wider text-primary">{t.stats}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-border/60 p-4">
                  <p className="font-serif text-3xl font-medium text-foreground">{wipItems.length}</p>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">{t.active}</p>
                </div>
                <div className="border border-border/60 p-4">
                  <p className="font-serif text-3xl font-medium text-primary">
                    {wipItems.length > 0
                      ? `${Math.round(wipItems.reduce((a, b) => a + b.progress, 0) / wipItems.length)}%`
                      : "0%"}
                  </p>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">{t.avgProgress}</p>
                </div>
              </div>
            </div>

            <div className={cn("border border-border/70 bg-card p-6 opacity-0", isVisible && "animate-fade-in-up stagger-4")}>
              <h3 className="mb-5 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-primary">
                <Activity className="h-3.5 w-3.5" />
                {t.recentActivity}
              </h3>
              <div className="space-y-4">
                {liveActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 text-xs">
                    <span
                      className={cn(
                        "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                        activity.type === "commit" && "bg-primary",
                        activity.type === "pr" && activity.prAction === "opened" && "bg-accent",
                        activity.type === "pr" && activity.prAction === "merged" && "bg-primary",
                        activity.type === "pr" && activity.prAction === "closed" && "bg-muted-foreground",
                        (!activity.type || (activity.type !== "commit" && activity.type !== "pr")) && "bg-muted-foreground/50",
                      )}
                    />
                    <div className="min-w-0 flex-1">
                      {activity.type === "pr" && activity.prAction && activity.prTitle ? (
                        <div className="flex flex-wrap items-center gap-1.5 text-foreground leading-normal">
                          <span
                            className={cn(
                              "shrink-0 rounded border px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider",
                              activity.prAction === "opened" && "border-accent/30 bg-accent/10 text-accent",
                              activity.prAction === "merged" && "border-primary/30 bg-primary/10 text-primary",
                              activity.prAction === "closed" && "border-border text-muted-foreground",
                            )}
                          >
                            {activity.prAction === "opened" ? (language === "th" ? "เปิด" : "OPENED") :
                             activity.prAction === "merged" ? (language === "th" ? "รวม" : "MERGED") :
                             (language === "th" ? "ปิด" : "CLOSED")}
                          </span>
                          <span className="flex-1 truncate">{activity.prTitle}</span>
                        </div>
                      ) : (
                        <p className="truncate text-foreground">
                          {typeof activity.message === "object" ? activity.message[language] : activity.message}
                        </p>
                      )}
                      <p className="mt-1 flex items-center gap-1 text-muted-foreground">
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
  );
}

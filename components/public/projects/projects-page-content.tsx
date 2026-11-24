"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Search, Filter, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/components/language-provider"
import { useLiveGithubRepos } from "@/lib/use-live-github-repos"
import { LivePill } from "@/components/live-pill"
import { ProjectRow } from "@/components/project-row"
import type { Project } from "@/lib/github"

const filters = ["all", "shipped", "in-progress", "archived"]

const sortOptions = ["recent", "stars", "forks", "name", "year"] as const

export type SortKey = (typeof sortOptions)[number]

function sortProjects(projects: Project[], sortBy: SortKey): Project[] {
  const sorted = [...projects]
  switch (sortBy) {
    case "stars":
      return sorted.sort((a, b) => b.stars - a.stars)
    case "forks":
      return sorted.sort((a, b) => b.forks - a.forks)
    case "name":
      return sorted.sort((a, b) => a.title.localeCompare(b.title))
    case "year": {
      const yearOf = (p: Project) => {
        const match = /(\d{4})/.exec(p.year)
        return match ? Number(match[1]) : 0
      }
      return sorted.sort((a, b) => yearOf(b) - yearOf(a))
    }
    case "recent":
    default:
      return sorted
  }
}

const t = {
  en: {
    kicker: "Selected Work",
    title: "Open Source Projects",
    desc:
      "A collection of tools, experiments, and contributions to the open source community. Built with passion, maintained with care.",
    search: "Search projects...",
    featured: "Featured",
    fork: "Fork",
    source: "source",
    live: "live",
    liveBadge: "live",
    noResults: "No projects found matching your criteria.",
    sortLabel: "sort by",
    clearFilters: "clear filters",
    count: (n: number) => `${n} project${n === 1 ? "" : "s"}`,
    filters: {
      all: "all",
      shipped: "shipped",
      "in-progress": "in-progress",
      archived: "archived",
    },
    sort: {
      recent: "recent",
      stars: "stars",
      forks: "forks",
      name: "name",
      year: "year",
    },
  },
  th: {
    kicker: "ผลงานที่คัดสรร",
    title: "โปรเจกต์โอเพนซอร์ส",
    desc: "รวมเครื่องมือ งานทดลอง และผลงานที่แบ่งปันให้ชุมชนโอเพนซอร์ส สร้างด้วยความตั้งใจ ดูแลต่อเนื่อง",
    search: "ค้นหาโปรเจกต์...",
    featured: "แนะนำ",
    fork: "ฟอร์ก",
    source: "ซอร์สโค้ด",
    live: "เว็บไซต์",
    liveBadge: "สด",
    noResults: "ไม่พบโปรเจกต์ที่ตรงกับเงื่อนไขที่เลือก",
    sortLabel: "เรียงตาม",
    clearFilters: "ล้างตัวกรอง",
    count: (n: number) => `${n} โปรเจกต์`,
    filters: {
      all: "ทั้งหมด",
      shipped: "เผยแพร่แล้ว",
      "in-progress": "กำลังพัฒนา",
      archived: "เก็บถาวร",
    },
    sort: {
      recent: "ล่าสุด",
      stars: "ดาว",
      forks: "ฟอร์ก",
      name: "ชื่อ",
      year: "ปี",
    },
  },
	ja: {
    kicker: "Selected Work",
    title: "Open Source Projects",
    desc:
      "A collection of tools, experiments, and contributions to the open source community. Built with passion, maintained with care.",
    search: "Search projects...",
    featured: "Featured",
    fork: "Fork",
    source: "source",
    live: "live",
    liveBadge: "live",
    noResults: "No projects found matching your criteria.",
    sortLabel: "sort by",
    clearFilters: "clear filters",
    count: (n: number) => `${n} project${n === 1 ? "" : "s"}`,
    filters: {
      all: "all",
      shipped: "shipped",
      "in-progress": "in-progress",
      archived: "archived",
    },
    sort: {
      recent: "recent",
      stars: "stars",
      forks: "forks",
      name: "name",
      year: "year",
    },
  },
	zh: {
    kicker: "Selected Work",
    title: "Open Source Projects",
    desc:
      "A collection of tools, experiments, and contributions to the open source community. Built with passion, maintained with care.",
    search: "Search projects...",
    featured: "Featured",
    fork: "Fork",
    source: "source",
    live: "live",
    liveBadge: "live",
    noResults: "No projects found matching your criteria.",
    sortLabel: "sort by",
    clearFilters: "clear filters",
    count: (n: number) => `${n} project${n === 1 ? "" : "s"}`,
    filters: {
      all: "all",
      shipped: "shipped",
      "in-progress": "in-progress",
      archived: "archived",
    },
    sort: {
      recent: "recent",
      stars: "stars",
      forks: "forks",
      name: "name",
      year: "year",
    },
  },
} as const


/** Static page hero: paints with the shell so it never waits on the GitHub fetch below. */
export function ProjectsHero() {
  const { language } = useLanguage()

  return (
    <section className="px-4 sm:px-6 pt-12 sm:pt-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 sm:mb-16 space-y-4">
          <p className="flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-primary">
            {t[language].kicker}
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl font-medium tracking-tight">{t[language].title}</h1>
          <p className="max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
            {t[language].desc}
          </p>
        </div>
      </div>
    </section>
  )
}

export function ProjectsPageContent({ projects: initialProjects = [] }: { projects?: Project[] }) {
  const { language } = useLanguage()
  const [activeFilter, setActiveFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<SortKey>("recent")
  const { repos: projects, updatedAt, isLive } = useLiveGithubRepos(initialProjects)

  const allTags = [...new Set(projects.flatMap((p) => p.tags))]

  const filteredProjects = sortProjects(
    projects.filter((p) => {
      const matchesFilter = activeFilter === "all" || p.status === activeFilter
      const matchesSearch =
        searchQuery === "" ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => p.tags.includes(tag))
      return matchesFilter && matchesSearch && matchesTags
    }),
    sortBy,
  )

  const hasActiveFilters = activeFilter !== "all" || searchQuery !== "" || selectedTags.length > 0

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const clearFilters = () => {
    setActiveFilter("all")
    setSearchQuery("")
    setSelectedTags([])
    setSortBy("recent")
  }

  return (
    <section className="px-4 sm:px-6 pb-12 sm:pb-20">
      <div className="mx-auto max-w-7xl">
        {/* Search and Filters — not gated behind `useInView`/opacity-0 so
            the controls paint with the server HTML. */}
        <div className="mb-10 space-y-6">
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t[language].search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card/40 border-border/60 focus:border-primary/50"
            />
          </div>

          {/* Status Filters — one scrollable row on phones, wrapped on desktop */}
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-hide scroll-fade-x sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  "shrink-0 rounded-lg border px-4 min-h-11 font-mono text-xs uppercase tracking-wider transition-all duration-300 active:scale-[0.98]",
                  activeFilter === filter
                    ? "border-primary bg-primary/15 text-primary shadow-sm shadow-primary/20"
                    : "border-border text-muted-foreground hover:border-foreground/50 hover:text-foreground hover:bg-secondary/50",
                )}
              >
                {t[language].filters[filter as keyof typeof t.en.filters]}
              </button>
            ))}
          </div>

          {/* Tag Filters — one scrollable row on phones, wrapped on desktop */}
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide scroll-fade-x sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
            <Filter className="h-4 w-4 shrink-0 text-muted-foreground mr-2 self-center" />
            {allTags.slice(0, 10).map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={cn(
                  "shrink-0 rounded-md border px-3 min-h-11 font-mono text-xs transition-all duration-200",
                  selectedTags.includes(tag)
                    ? "border-primary/50 bg-primary/10 text-primary"
                    : "border-border/60 bg-secondary/40 text-muted-foreground hover:border-primary/30 hover:text-foreground",
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Results meta row */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border/40 pb-4">
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-muted-foreground">
            <span>{t[language].count(filteredProjects.length)}</span>
            <LivePill updatedAt={updatedAt} isLive={isLive} label={t[language].liveBadge} language={language} />
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 text-primary transition-colors hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
                {t[language].clearFilters}
              </button>
            )}
          </div>
          <div className="-mx-4 flex items-center gap-1.5 overflow-x-auto px-4 pb-1 scrollbar-hide scroll-fade-x sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
            <span className="mr-1 shrink-0 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {t[language].sortLabel}
            </span>
            {sortOptions.map((option) => (
              <button
                key={option}
                onClick={() => setSortBy(option)}
                aria-pressed={sortBy === option}
                className={cn(
                  "inline-flex shrink-0 items-center rounded-md border px-3 font-mono text-[11px] transition-all duration-200 min-h-10 sm:min-h-0 sm:px-2.5 sm:py-1.5",
                  sortBy === option
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border/60 text-muted-foreground hover:border-primary/30 hover:text-foreground",
                )}
              >
                {t[language].sort[option]}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid border-b border-border/70 sm:grid-cols-2 sm:gap-x-12">
          {filteredProjects.map((project) => (
            <ProjectRow
              key={project.id}
              project={project}
              labels={{
                status: t[language].filters[project.status as keyof typeof t.en.filters],
                fork: t[language].fork,
                source: t[language].source,
                live: t[language].live,
              }}
            />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-20">
            <p className="font-mono text-sm text-muted-foreground">{t[language].noResults}</p>
          </div>
        )}
      </div>
    </section>
  )
}

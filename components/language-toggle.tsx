"use client"

import { cn } from "@/lib/utils"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useMemo, Suspense } from "react"
import { useLanguage } from "./language-provider"

function LanguageToggleContent() {
  const { language, setLanguage } = useLanguage()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const nextHref = useMemo(
    () => (nextLanguage: "th" | "en") => {
      const params = new URLSearchParams(searchParams.toString())
      params.set("lang", nextLanguage)
      const query = params.toString()
      return query ? `${pathname}?${query}` : pathname
    },
    [pathname, searchParams],
  )

  const handleLanguageChange = (nextLanguage: "th" | "en") => {
    setLanguage(nextLanguage)
    router.replace(nextHref(nextLanguage), { scroll: false })
  }

  return (
    <div className="flex items-center rounded-lg border border-border/60 bg-card/70 p-0.5">
      <button
        type="button"
        onClick={() => handleLanguageChange("th")}
        className={cn(
          "rounded-md px-2 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors",
          language === "th"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground",
        )}
        aria-label="Switch language to Thai"
      >
        TH
      </button>
      <button
        type="button"
        onClick={() => handleLanguageChange("en")}
        className={cn(
          "rounded-md px-2 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors",
          language === "en"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground",
        )}
        aria-label="Switch language to English"
      >
        EN
      </button>
    </div>
  )
}

export function LanguageToggle() {
  return (
    <Suspense fallback={<div className="w-12 h-6 bg-muted animate-pulse rounded-lg" />}>
      <LanguageToggleContent />
    </Suspense>
  )
}

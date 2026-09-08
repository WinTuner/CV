"use client"

import { cn } from "@/lib/utils"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useMemo, Suspense, useState, useRef, useEffect } from "react"
import { useLanguage, type SiteLanguage } from "./language-provider"
import { SUPPORTED_LANGUAGES } from "@/constants/languages"
import { Globe, ChevronDown } from "lucide-react"

function LanguageToggleContent() {
  const { language, setLanguage } = useLanguage()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const nextHref = useMemo(
    () => (nextLanguage: SiteLanguage) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set("lang", nextLanguage)
      const query = params.toString()
      return query ? `${pathname}?${query}` : pathname
    },
    [pathname, searchParams],
  )

  const handleLanguageChange = (nextLanguage: SiteLanguage) => {
    setLanguage(nextLanguage)
    router.replace(nextHref(nextLanguage), { scroll: false })
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEsc)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEsc)
    }
  }, [open])

  const current = SUPPORTED_LANGUAGES.find((l) => l.code === language) ?? SUPPORTED_LANGUAGES[0]

  // For 2 languages keep compact segmented for backwards compat, for >2 use dropdown
  if (SUPPORTED_LANGUAGES.length <= 2) {
    return (
      <div className="flex items-center rounded-lg border border-border/60 bg-card/70 p-0.5">
        {SUPPORTED_LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            type="button"
            onClick={() => handleLanguageChange(lang.code)}
            className={cn(
              "rounded-md min-h-11 min-w-12 px-3 font-mono text-[10px] uppercase tracking-wider transition-colors",
              language === lang.code
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
            aria-label={`Switch language to ${lang.nativeLabel}`}
            aria-pressed={language === lang.code}
          >
            {lang.label}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-card/70 px-3 min-h-11 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Select language"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <Globe className="h-3.5 w-3.5" />
        <span className="font-mono text-[11px] uppercase tracking-wider">{current.label}</span>
        <ChevronDown className={cn("h-3 w-3 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div
          role="listbox"
          className="absolute right-0 mt-2 min-w-[160px] rounded-lg border border-border/60 bg-card p-1 shadow-lg z-50 animate-fade-in"
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              role="option"
              aria-selected={language === lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-left text-sm transition-colors",
                language === lang.code
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <span className="text-base leading-none">{lang.flag}</span>
              <span className="flex-1 font-medium">{lang.nativeLabel}</span>
              <span className="font-mono text-[10px] opacity-60">{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function LanguageToggle() {
  return (
    <Suspense fallback={<div className="w-24 h-11 bg-muted animate-pulse rounded-lg" />}>
      <LanguageToggleContent />
    </Suspense>
  )
}

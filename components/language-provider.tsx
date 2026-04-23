"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"

export type SiteLanguage = "en" | "th"

type LanguageContextValue = {
  language: SiteLanguage
  setLanguage: (language: SiteLanguage) => void
}

const STORAGE_KEY = "site-language"
const COOKIE_NAME = "site-language"

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SiteLanguage>("en")

  const applyLanguageDocumentState = (nextLanguage: SiteLanguage) => {
    document.documentElement.lang = nextLanguage
    document.cookie = `${COOKIE_NAME}=${nextLanguage}; path=/; max-age=31536000; samesite=lax`
  }

  useEffect(() => {
    const urlLanguage = new URLSearchParams(window.location.search).get("lang") as SiteLanguage | null
    if (urlLanguage === "th" || urlLanguage === "en") {
      setLanguageState(urlLanguage)
      applyLanguageDocumentState(urlLanguage)
      localStorage.setItem(STORAGE_KEY, urlLanguage)
      return
    }

    const cookieLanguage = document.cookie
      .split("; ")
      .find((entry) => entry.startsWith(`${COOKIE_NAME}=`))
      ?.split("=")[1] as SiteLanguage | undefined

    if (cookieLanguage === "th" || cookieLanguage === "en") {
      setLanguageState(cookieLanguage)
      applyLanguageDocumentState(cookieLanguage)
      localStorage.setItem(STORAGE_KEY, cookieLanguage)
      return
    }

    const savedLanguage = localStorage.getItem(STORAGE_KEY) as SiteLanguage | null
    if (savedLanguage === "th" || savedLanguage === "en") {
      setLanguageState(savedLanguage)
      applyLanguageDocumentState(savedLanguage)
      return
    }
    applyLanguageDocumentState("en")
  }, [])

  const setLanguage = (nextLanguage: SiteLanguage) => {
    setLanguageState(nextLanguage)
    localStorage.setItem(STORAGE_KEY, nextLanguage)
    applyLanguageDocumentState(nextLanguage)
  }

  const value = useMemo(
    () => ({
      language,
      setLanguage,
    }),
    [language],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider")
  }
  return context
}

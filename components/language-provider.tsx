"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import {
	LANGUAGE_COOKIE,
	type SupportedLanguageCode,
	DEFAULT_LANGUAGE,
} from "@/constants/languages"

export type SiteLanguage = SupportedLanguageCode

type LanguageContextValue = {
  language: SiteLanguage
  setLanguage: (language: SiteLanguage) => void
}

const STORAGE_KEY = "site-language"
const COOKIE_NAME = LANGUAGE_COOKIE

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({
  children,
  initialLanguage = DEFAULT_LANGUAGE,
}: {
  children: React.ReactNode
  initialLanguage?: SiteLanguage
}) {
  const [language, setLanguageState] = useState<SiteLanguage>(initialLanguage)

  const applyLanguageDocumentState = useCallback((nextLanguage: SiteLanguage) => {
    document.documentElement.lang = nextLanguage
    document.cookie = `${COOKIE_NAME}=${nextLanguage}; path=/; max-age=31536000; samesite=lax`
  }, [])

  useEffect(() => {
    // The server decides the language from the URL prefix and passes it in;
    // this only mirrors it to the document and the cookie.
    localStorage.setItem(STORAGE_KEY, language)
    applyLanguageDocumentState(language)
  }, [language, applyLanguageDocumentState])

  const setLanguage = useCallback((nextLanguage: SiteLanguage) => {
    setLanguageState(nextLanguage)
    localStorage.setItem(STORAGE_KEY, nextLanguage)
    applyLanguageDocumentState(nextLanguage)
  }, [applyLanguageDocumentState])

  const value = useMemo(
    () => ({
      language,
      setLanguage,
    }),
    [language, setLanguage],
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

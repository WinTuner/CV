"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { useLanguage } from "./language-provider"
import { cn } from "@/lib/utils"
import { 
  Search, 
  Home, 
  User, 
  FolderGit2, 
  Hammer, 
  BookOpen, 
  Languages, 
  SunMoon, 
  Printer, 
  Sparkles,
  Command
} from "lucide-react"

interface CommandItem {
  icon: React.ComponentType<{ className?: string }>
  label: { en: string; th: string }
  category: { en: string; th: string }
  action: () => void
}

export function CommandMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  
  const router = useRouter()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { language, setLanguage } = useLanguage()
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const items: CommandItem[] = [
    // Navigation
    {
      icon: Home,
      label: { en: "Go to Home", th: "ไปที่หน้าแรก" },
      category: { en: "Navigation", th: "การนำทาง" },
      action: () => { router.push("/"); setIsOpen(false); }
    },
    {
      icon: User,
      label: { en: "Go to Resume & Introduction", th: "ไปที่เรซูเม่และแนะนำตัว" },
      category: { en: "Navigation", th: "การนำทาง" },
      action: () => { router.push("/introduction"); setIsOpen(false); }
    },
    {
      icon: FolderGit2,
      label: { en: "Go to Projects", th: "ไปที่หน้าโปรเจกต์" },
      category: { en: "Navigation", th: "การนำทาง" },
      action: () => { router.push("/projects"); setIsOpen(false); }
    },
    {
      icon: Hammer,
      label: { en: "Go to Workbench", th: "ไปที่หน้าเวิร์กเบนช์" },
      category: { en: "Navigation", th: "การนำทาง" },
      action: () => { router.push("/workbench"); setIsOpen(false); }
    },
    {
      icon: BookOpen,
      label: { en: "Go to Blog", th: "ไปที่หน้าบล็อก" },
      category: { en: "Navigation", th: "การนำทาง" },
      action: () => { router.push("/blog"); setIsOpen(false); }
    },
    // Custom Actions
    {
      icon: SunMoon,
      label: { en: "Toggle Dark/Light Mode", th: "สลับโหมด มืด/สว่าง" },
      category: { en: "Preferences", th: "การตั้งค่า" },
      action: () => { setTheme(theme === "dark" ? "light" : "dark"); setIsOpen(false); }
    },
    {
      icon: Languages,
      label: { en: "Switch Language to Thai", th: "เปลี่ยนภาษาเป็นภาษาไทย" },
      category: { en: "Preferences", th: "การตั้งค่า" },
      action: () => { setLanguage("th"); setIsOpen(false); }
    },
    {
      icon: Languages,
      label: { en: "Switch Language to English", th: "เปลี่ยนภาษาเป็นภาษาอังกฤษ" },
      category: { en: "Preferences", th: "การตั้งค่า" },
      action: () => { setLanguage("en"); setIsOpen(false); }
    },
    {
      icon: Printer,
      label: { en: "Print / Save Resume as PDF", th: "พิมพ์ / บันทึกเรซูเม่เป็น PDF" },
      category: { en: "Actions", th: "คำสั่งพิเศษ" },
      action: () => {
        setIsOpen(false)
        if (pathname === "/introduction") {
          window.print()
        } else {
          router.push("/introduction?print=true")
        }
      }
    }
  ]

  // Filter items on search query
  const filteredItems = items.filter(item => 
    item.label[language].toLowerCase().includes(search.toLowerCase()) ||
    item.category[language].toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle on Cmd+K / Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setIsOpen(prev => !prev)
      }
      
      // Open on '/' if no input is focused
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault()
        setIsOpen(true)
      }

      if (!isOpen) return

      // Handle Escape to close
      if (e.key === "Escape") {
        setIsOpen(false)
      }

      // Handle Arrow keys navigation
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex(prev => (prev + 1) % filteredItems.length)
      }
      if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length)
      }

      // Handle Enter to select
      if (e.key === "Enter" && filteredItems[selectedIndex]) {
        e.preventDefault()
        filteredItems[selectedIndex].action()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, filteredItems, selectedIndex])

  // Focus input when menu opens
  useEffect(() => {
    if (isOpen) {
      setSearch("")
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.children[selectedIndex] as HTMLElement
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest" })
      }
    }
  }, [selectedIndex])

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 bg-black/40 backdrop-blur-sm print:hidden animate-fade-in"
      onClick={() => setIsOpen(false)}
    >
      <div 
        className="w-full max-w-lg overflow-hidden rounded-xl border border-border bg-card/95 glass-strong shadow-2xl animate-scale-in origin-top"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-border/50 px-4 py-3 bg-background/30">
          <Search className="h-4.5 w-4.5 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            placeholder={language === "th" ? "พิมพ์ค้นหาคำสั่ง..." : "Type a command to search..."}
            value={search}
            onChange={e => { setSearch(e.target.value); setSelectedIndex(0); }}
            className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground/60 text-sm font-sans focus:ring-0 focus:outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-border bg-secondary/50 px-2 py-0.5 font-mono text-[10px] text-muted-foreground font-semibold shadow-sm">
            ESC
          </kbd>
        </div>

        {/* Action Lists */}
        {filteredItems.length > 0 ? (
          <div 
            ref={listRef}
            className="max-h-[300px] overflow-y-auto p-2 space-y-0.5"
          >
            {filteredItems.map((item, index) => {
              const Icon = item.icon
              const isSelected = index === selectedIndex
              const isFirstOfCategory = index === 0 || filteredItems[index - 1].category[language] !== item.category[language]

              return (
                <div key={index} className="space-y-0.5">
                  {isFirstOfCategory && (
                    <div className="px-3 py-1.5 font-mono text-[9px] uppercase tracking-wider text-primary/80 font-bold">
                      {item.category[language]}
                    </div>
                  )}
                  <button
                    onClick={item.action}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all duration-150 cursor-pointer text-xs font-medium",
                      isSelected 
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.01]" 
                        : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon className={cn("h-4 w-4 shrink-0", isSelected ? "text-primary-foreground" : "text-muted-foreground")} />
                      <span className="truncate">{item.label[language]}</span>
                    </div>
                    {isSelected && (
                      <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded bg-primary-foreground/20 px-1.5 py-0.5 font-mono text-[9px] text-primary-foreground shadow-sm">
                        ENTER
                      </kbd>
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-muted-foreground flex flex-col items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary/60 animate-pulse" />
            <p>{language === "th" ? "ไม่พบคำสั่งที่คุณค้นหา" : "No commands match your query."}</p>
          </div>
        )}

        {/* Footer shortcuts helper */}
        <div className="flex items-center justify-between border-t border-border/50 px-4 py-2.5 bg-background/30 font-mono text-[9px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Command className="h-3 w-3" />
            <span>+ K or / to toggle</span>
          </div>
        </div>
      </div>
    </div>
  )
}

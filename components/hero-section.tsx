"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useLanguage } from "./language-provider"

const roles = {
  en: ["building interfaces", "exploring systems", "breaking barriers", "forging ideas", "crafting code"],
  th: ["สร้างอินเทอร์เฟซ", "สำรวจระบบ", "ทลายข้อจำกัด", "หลอมรวมไอเดีย", "เขียนโค้ดอย่างประณีต"],
} as const

export function HeroSection() {
  const { language } = useLanguage()
  const [currentRole, setCurrentRole] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const currentRoles = roles[language]

  const copy = {
    en: {
      kicker: "WinTuner - Where Code Meets Curiosity",
      intro:
        "Welcome to my digital workshop - a space for experiments, prototypes, and open-source artifacts. Currently building at ... Here, ideas are forged, tested, and refined. Not a portfolio. A laboratory.",
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
        "ยินดีต้อนรับสู่เวิร์กช็อปดิจิทัลของผม พื้นที่สำหรับทดลอง สร้างต้นแบบ และแบ่งปันโอเพนซอร์ส ตอนนี้กำลังพัฒนาอยู่ที่ ... ที่นี่ไอเดียจะถูกหลอม ทดสอบ และปรับแต่ง ไม่ใช่พอร์ตโฟลิโอ แต่คือห้องแล็บ",
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
                  className="bg-gradient-to-l from-primary/50 to-accent text-transparent bg-clip-text typing-cursor"
                >
                  {displayText}
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

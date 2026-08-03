"use client"

import { useState } from "react"
import { useLanguage } from "./language-provider"
import { cn } from "@/lib/utils"
import { Mail, CheckCircle2, MessageSquare, ArrowRight } from "lucide-react"

export function ContactSection() {
    const { language } = useLanguage()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSent, setIsSent] = useState(false)

    const t = {
        en: {
            kicker: "Interlink",
            title: "Get in Touch",
            desc: "Available for new opportunities and collaborations. Drop a message or just say hi.",
            name: "Your Name",
            email: "your@email.com",
            message: "How can I help you?",
            send: "Transmit Message",
            sending: "Transmitting...",
            sent: "Transmission Complete",
            footer: "Direct frequency: Thanatphong2719@gmail.com"
        },
        th: {
            kicker: "การเชื่อมต่อ",
            title: "ติดต่อสอบถาม",
            desc: "เปิดรับโอกาสใหม่และร่วมงานกับทุกคนเสมอ ส่งข้อความหาผมได้เลยครับ",
            name: "ชื่อของคุณ",
            email: "อีเมลของคุณ",
            message: "พิมพ์ข้อความที่นี่...",
            send: "ส่งข้อความ",
            sending: "กำลังส่ง...",
            sent: "ส่งข้อความสำเร็จ",
            footer: "ติดต่อโดยตรงที่: Thanatphong2719@gmail.com"
        }
    }[language]

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false)
            setIsSent(true)
        }, 2000)
    }

    return (
        <section id="contact" className="relative px-4 sm:px-6 py-20 sm:py-32 overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full max-h-4xl rounded-full bg-primary/5 blur-[120px] -z-10" />

            <div className="mx-auto max-w-7xl">
                <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary animate-fade-in">
                                {t.kicker}
                            </p>
                            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl animate-fade-in-up">
                                {t.title}
                            </h2>
                            <p className="max-w-lg text-base sm:text-lg text-muted-foreground leading-relaxed animate-fade-in-up stagger-1">
                                {t.desc}
                            </p>
                        </div>

                        <div className="space-y-6 animate-fade-in-up stagger-2">
                            <div className="flex items-center gap-4 group">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card/50 transition-colors group-hover:border-primary/50 group-hover:bg-primary/5">
                                    <Mail className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Direct Email</p>
                                    <p className="text-sm font-medium">Thanatphong2719@gmail.com</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card/50 transition-colors group-hover:border-primary/50 group-hover:bg-primary/5">
                                    <MessageSquare className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Social Hub</p>
                                    <p className="text-sm font-medium">github.com/WinTuner</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="animate-scale-in">
                        <div className="relative rounded-2xl border border-border/50 bg-card/40 p-1 glass backdrop-blur-xl">
                            {/* Form Header / Terminal bar */}
                            <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50">
                                <div className="h-2.5 w-2.5 rounded-full bg-destructive/50" />
                                <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/50" />
                                <div className="h-2.5 w-2.5 rounded-full bg-primary/50" />
                                <span className="ml-4 font-mono text-[10px] text-muted-foreground uppercase tracking-widest">message_protocol.v1</span>
                            </div>

                            <div className="p-6 sm:p-8">
                                {isSent ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
                                        <div className="mb-6 rounded-full bg-primary/10 p-4">
                                            <CheckCircle2 className="h-12 w-12 text-primary animate-pulse-glow" />
                                        </div>
                                        <h3 className="mb-2 text-2xl font-bold">{t.sent}</h3>
                                        <p className="text-muted-foreground">ขอบคุณสำหรับการติดต่อ ผมจะรีบตอบกลับโดยเร็วที่สุดครับ</p>
                                        <button
                                            onClick={() => setIsSent(false)}
                                            className="mt-8 text-xs font-mono text-primary hover:underline underline-offset-4"
                                        >
                                            Send another message
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <label className="font-mono text-[10px] uppercase text-muted-foreground ml-1">{t.name}</label>
                                                <input
                                                    required
                                                    type="text"
                                                    className="w-full rounded-lg border border-border/50 bg-background/50 px-4 py-3 text-sm transition-all focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="font-mono text-[10px] uppercase text-muted-foreground ml-1">{t.email}</label>
                                                <input
                                                    required
                                                    type="email"
                                                    className="w-full rounded-lg border border-border/50 bg-background/50 px-4 py-3 text-sm transition-all focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="font-mono text-[10px] uppercase text-muted-foreground ml-1">{t.message}</label>
                                            <textarea
                                                required
                                                rows={4}
                                                className="w-full rounded-lg border border-border/50 bg-background/50 px-4 py-3 text-sm transition-all focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none resize-none"
                                            />
                                        </div>

                                        <button
                                            disabled={isSubmitting}
                                            type="submit"
                                            className={cn(
                                                "group relative w-full overflow-hidden rounded-lg bg-primary py-4 font-mono text-sm font-bold text-primary-foreground transition-all active:scale-[0.98]",
                                                isSubmitting && "opacity-80"
                                            )}
                                        >
                                            <span className="relative z-10 flex items-center justify-center gap-2">
                                                {isSubmitting ? t.sending : t.send}
                                                {!isSubmitting && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
                                            </span>
                                            {/* Animated shimmer */}
                                            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

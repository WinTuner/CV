"use client"

import { useLanguage } from "./language-provider"
import { cn } from "@/lib/utils"
import {
    Code2,
    Terminal,
    Cpu,
    Globe,
    Layers,
    ShieldCheck,
    Database,
    Cloud
} from "lucide-react"

const skills = {
    en: [
        {
            category: "Frontend",
            icon: Globe,
            items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"]
        },
        {
            category: "Backend & Database",
            icon: Database,
            items: ["Node.js", "Express", "Java", "PostgreSQL", "Supabase"]
        },
        {
            category: "Infrastructure",
            icon: Cloud,
            items: ["Docker", "CI/CD", "Vercel", "Nginx", "Arch Linux / CachyOS", "WireGuard VPN"]
        },
        {
            category: "Tools & Media",
            icon: Terminal,
            items: ["Git", "GitHub Actions", "Postman", "DaVinci Resolve", "CapCut", "OBS Studio"]
        }
    ],
    th: [
        {
            category: "ฟรอนต์เอนด์",
            icon: Globe,
            items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"]
        },
        {
            category: "แบ็กเอนด์ & ฐานข้อมูล",
            icon: Database,
            items: ["Node.js", "Express", "Java", "PostgreSQL", "Supabase"]
        },
        {
            category: "อินฟราสตรัคเจอร์",
            icon: Cloud,
            items: ["Docker", "CI/CD", "Vercel", "Nginx", "Arch Linux / CachyOS", "WireGuard VPN"]
        },
        {
            category: "เครื่องมือ & มีเดีย",
            icon: Terminal,
            items: ["Git", "GitHub Actions", "Postman", "DaVinci Resolve", "CapCut", "OBS Studio"]
        }
    ]
} as const

export function SkillsMatrix() {
    const { language } = useLanguage()
    const t = {
        en: {
            kicker: "Power Grid",
            title: "Technical Stack",
            desc: "Architecturing the future with a selection of modern technologies and industry-standard tools."
        },
        th: {
            kicker: "ขุมพลัง",
            title: "ทักษะทางเทคนิค",
            desc: "สร้างสรรค์นวัตกรรมด้วยเทคโนโลยีสมัยใหม่และเครื่องมือมาตรฐานสากล"
        }
    }[language]

    return (
        <section id="skills" className="px-4 sm:px-6 py-20 sm:py-28">
            <div className="mx-auto max-w-7xl">
                <div className="mb-12 sm:mb-16 space-y-4 text-center">
                    <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary animate-fade-in-up">
                        {t.kicker}
                    </p>
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl animate-fade-in-up stagger-1">
                        {t.title}
                    </h2>
                    <p className="mx-auto max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed animate-fade-in-up stagger-2">
                        {t.desc}
                    </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {skills[language].map((skill, index) => (
                        <div
                            key={skill.category}
                            className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/30 p-8 glass transition-all duration-300 hover:border-primary/30 hover:bg-card/50 animate-scale-in"
                            style={{ animationDelay: `${index * 100 + 300}ms` }}
                        >
                            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                                <skill.icon className="h-6 w-6" />
                            </div>

                            <h3 className="mb-4 text-lg font-bold tracking-tight">{skill.category}</h3>

                            <div className="flex flex-wrap gap-2">
                                {skill.items.map((item) => (
                                    <span
                                        key={item}
                                        className="rounded-md border border-border/50 bg-secondary/50 px-2 py-1 font-mono text-[10px] text-muted-foreground transition-all duration-300 hover:border-primary/50 hover:text-primary"
                                    >
                                        {item}
                                    </span>
                                ))}
                            </div>

                            {/* Decorative background number */}
                            <div className="absolute -right-4 -bottom-4 font-mono text-6xl font-black text-primary/5 select-none transition-all duration-500 group-hover:scale-110 group-hover:text-primary/10">
                                0{index + 1}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

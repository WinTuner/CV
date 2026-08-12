"use client";

import { useLanguage } from "@/components/language-provider";

export function BlogHero() {
  const { language } = useLanguage();
  const t = {
    en: {
      kicker: "Journal",
      title: "Blog &",
      accent: "Insights",
      desc:
        "Technical deep-dives, experiments, and lessons learned. Exploring code, systems, and the craft of building software.",
    },
    th: {
      kicker: "บันทึก",
      title: "บล็อก &",
      accent: "อินไซต์",
      desc:
        "บทความเชิงเทคนิค งานทดลอง และบทเรียน สำรวจโค้ด ระบบ และศิลปะของการสร้างซอฟต์แวร์",
    },
  }[language];

  return (
    <section className="px-4 sm:px-6 pt-32 pb-16 sm:pt-40 sm:pb-20">
      <div className="mx-auto max-w-7xl">
        <div className="space-y-4 animate-fade-in-up">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
            {t.kicker}
          </p>
          <h1 className="font-serif text-5xl font-medium tracking-tight sm:text-6xl text-balance">
            {t.title}{" "}
            <span className="italic text-primary">{t.accent}</span>
          </h1>
          <p className="max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
            {t.desc}
          </p>
        </div>
      </div>
    </section>
  );
}

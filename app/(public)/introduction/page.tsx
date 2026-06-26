"use client"

import {
  Briefcase,
  ExternalLink,
  GraduationCap,
  Mail,
  Phone,
  Trophy,
  BookOpen,
  Award,
  Users,
  Code2,
  Rocket,
  Lightbulb,
} from "lucide-react"
import { awards, copy, education, experiences, leadership, professionalExperience, selfDevelopment } from "@/constants/cv-data"
import { useLanguage } from "@/components/language-provider"

const renderTextWithLinks = (text: string) => {
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    parts.push(
      <a
        key={match.index}
        href={match[2]}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline font-semibold"
      >
        {match[1]}
      </a>
    );
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : text;
};

export default function IntroductionPage() {
  const { language } = useLanguage()
  const t = copy[language]

  return (
    <div className="pb-20">
      {/* Header Section */}
      <section className="relative min-h-[50vh] px-4 sm:px-6 pt-28 sm:pt-32 pb-16">
        <div className="mx-auto max-w-4xl">
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">{t.pageLabel}</p>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-balance">
                {t.name}
              </h1>
              <p className="text-base sm:text-lg leading-relaxed text-muted-foreground max-w-3xl">
                {t.intro}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <a
                href="mailto:Thanatphong2719@gmail.com"
                className="group flex items-center gap-3 rounded-lg border border-border/50 bg-card/50 px-4 py-3 transition-all duration-300 hover:border-primary/50 hover:bg-card"
              >
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground group-hover:text-foreground">
                  Thanatphong2719@gmail.com
                </span>
              </a>
              <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-card/50 px-4 py-3">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">+66 91 876 3373</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 space-y-24">

        {/* 1. Professional Experience */}
        <section id="experience" className="space-y-12">
          <div className="space-y-3 text-center sm:text-left">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">{t.sectionProf}</p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Working Experiments</h2>
          </div>

          <div className="grid gap-12">
            {(Object.keys(professionalExperience[language]) as Array<keyof typeof t.categories>).map((cat) => (
              <div key={cat} className="space-y-6">
                <h3 className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1 text-xs font-mono uppercase tracking-widest text-primary">
                  {cat === 'production' && <Rocket className="h-3 w-3" />}
                  {cat === 'competition' && <Trophy className="h-3 w-3" />}
                  {cat === 'academic' && <BookOpen className="h-3 w-3" />}
                  {cat === 'personal' && <Code2 className="h-3 w-3" />}
                  {cat === 'openSource' && <Users className="h-3 w-3" />}
                  {t.categories[cat]}
                </h3>

                <div className="grid gap-6 md:grid-cols-2">
                  {professionalExperience[language][cat].map((proj) => (
                    <article key={proj.name} className="group relative rounded-xl border border-border/50 bg-card/30 p-6 glass transition-all duration-300 hover:border-primary/40 hover:bg-card/50">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <h4 className="text-lg font-bold group-hover:text-primary transition-colors">{proj.name}</h4>
                          {"url" in proj && (
                            <a href={(proj as any).url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                        </div>

                        <div className="space-y-3 text-sm">
                          <div>
                            <span className="block font-mono text-[10px] uppercase text-primary mb-1">{t.roleLabel}</span>
                            <p className="text-foreground/90">{proj.role}</p>
                          </div>
                          <div>
                            <span className="block font-mono text-[10px] uppercase text-primary mb-1">{t.targetLabel}</span>
                            <p className="text-muted-foreground line-clamp-2">{proj.target}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4 pt-2">
                            <div>
                              <span className="block font-mono text-[10px] uppercase text-primary mb-1">{t.problemLabel}</span>
                              <p className="text-xs text-muted-foreground leading-relaxed">{proj.problem}</p>
                            </div>
                            <div>
                              <span className="block font-mono text-[10px] uppercase text-primary mb-1">{t.learnedLabel}</span>
                              <p className="text-xs text-muted-foreground leading-relaxed italic">"{proj.learned}"</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Self-Development */}
        <section className="space-y-12">
          <div className="space-y-3">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">{t.sectionSelf}</p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t.sectionSelf}</h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-xl border border-border/50 bg-card/30 p-6 space-y-6">
              <h3 className="flex items-center gap-2 font-bold"><Award className="h-5 w-5 text-primary" />{t.certLabel}</h3>
              <ul className="space-y-4">
                {selfDevelopment[language].certifications.map((cert) => (
                  <li key={cert.name} className="group flex flex-col gap-1 border-l-2 border-primary/20 pl-4 transition-all hover:border-primary">
                    <span className="text-sm font-semibold">{cert.name}</span>
                    <span className="text-xs text-muted-foreground">{cert.institution}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-border/50 bg-card/30 p-6 space-y-6">
              <h3 className="flex items-center gap-2 font-bold"><Lightbulb className="h-5 w-5 text-primary" />{t.workshopLabel}</h3>
              <ul className="space-y-4">
                {selfDevelopment[language].workshops.map((ws) => (
                  <li key={ws.name} className="group flex flex-col gap-1 border-l-2 border-border pl-4 transition-all hover:border-primary">
                    <span className="text-sm font-semibold">{ws.name}</span>
                    <span className="text-xs text-muted-foreground">{ws.institution}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 3. Awards */}
        <section className="space-y-12">
          <div className="space-y-3">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">{t.sectionAwards}</p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">Achievements</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {awards[language].competitions.map((comp) => (
              <div key={comp.name} className="flex items-center gap-5 rounded-xl border border-primary/20 bg-primary/5 p-6 transition-transform hover:scale-[1.02]">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <Trophy className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold">{comp.name}</h4>
                  <p className="text-sm text-primary font-mono">{comp.rank}</p>
                  <p className="text-xs text-muted-foreground">{comp.theme}</p>
                </div>
              </div>
            ))}
            {awards[language].honors.map((hon) => (
              <div key={hon.name} className="flex items-center gap-5 rounded-xl border border-border/50 bg-card/30 p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold">{hon.name}</h4>
                  <p className="text-sm text-muted-foreground">{hon.institution}</p>
                  <p className="text-xs italic text-muted-foreground/70">{hon.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Leadership & Volunteer */}
        <section className="space-y-12">
          <div className="space-y-3">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">{t.sectionLead}</p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Soft Skills & Impact</h2>
          </div>
          <div className="grid gap-8">
            {leadership[language].map((item) => (
              <article key={item.title} className="relative overflow-hidden rounded-xl border border-border/50 bg-card/50 p-8 glass">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="space-y-4 max-w-2xl">
                    <div className="space-y-1">
                      <span className="font-mono text-xs text-primary">{item.period}</span>
                      <h3 className="text-xl font-bold">{item.title}</h3>
                      <p className="font-medium text-primary/80">{item.role}</p>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                  <div className="space-y-3">
                    <span className="block font-mono text-[10px] uppercase text-muted-foreground">{t.skillLabel}</span>
                    <div className="flex flex-wrap gap-2">
                      {item.softSkills.map(skill => (
                        <span key={skill} className="rounded border border-primary/20 bg-primary/5 px-2.5 py-1 text-[10px] font-medium text-primary">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Decorative background icon */}
                <Users className="absolute -right-8 -bottom-8 h-32 w-32 text-primary/5 -rotate-12 pointer-events-none" />
              </article>
            ))}
          </div>
        </section>

        {/* Education & Other */}
        <section className="pt-12 grid gap-12 md:grid-cols-2 border-t border-border/30">
          <div className="space-y-8">
            <h3 className="text-2xl font-bold flex items-center gap-3"><GraduationCap className="h-6 w-6 text-primary" />{t.sectionEd}</h3>
            <div className="space-y-6">
              {education[language].map((item) => (
                <div key={item.school} className="space-y-2 relative pl-6 before:absolute before:left-0 before:top-2 before:h-2 before:w-2 before:rounded-full before:bg-primary">
                  <div className="flex justify-between items-start gap-4">
                    <h4 className="font-bold text-sm">{item.school}</h4>
                    <span className="font-mono text-[10px] text-primary shrink-0">{item.period}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.detail}</p>
                  <p className="text-xs font-mono">{t.gpaLabel}: {item.gpa}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="text-2xl font-bold flex items-center gap-3"><Briefcase className="h-6 w-6 text-primary" />{language === 'en' ? 'Work' : 'ประสบการณ์ทำงาน'}</h3>
            <div className="space-y-6">
              {experiences[language].map((exp) => (
                <div key={exp.title} className="space-y-3">
                  <div className="flex justify-between items-start gap-4">
                    <h4 className="font-bold text-sm">{exp.title}</h4>
                    <span className="font-mono text-[10px] text-primary shrink-0">{exp.period}</span>
                  </div>
                  <ul className="space-y-1.5 pl-4">
                    {exp.points.map(pt => (
                      <li key={pt} className="text-xs text-muted-foreground list-disc marker:text-primary">
                        {renderTextWithLinks(pt)}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}

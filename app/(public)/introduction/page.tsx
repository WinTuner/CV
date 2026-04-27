"use client"

import {
  Briefcase,
  ExternalLink,
  GraduationCap,
  Languages,
  Mail,
  Phone,
  Trophy,
  Wrench,
  BookOpen,
  Award,
  Users,
  Code2,
  Rocket,
  Lightbulb,
} from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { cn } from "@/lib/utils"

const education = {
  en: [
    {
      school: "Chiang Rai Provincial Administrative Organization School",
      period: "2019 - 2025",
      detail: "Software Engineer Program",
      gpa: "3.97",
    },
    {
      school: "Chiang Mai University",
      period: "2025 - Present",
      detail: "CAMT, Bachelor of Science in Digital Industry Integration",
      gpa: "3.31",
    },
  ],
  th: [
    {
      school: "โรงเรียนองค์การบริหารส่วนจังหวัดเชียงราย",
      period: "2019 - 2025",
      detail: "แผนการเรียนวิศวกรรมซอฟต์แวร์",
      gpa: "3.97",
    },
    {
      school: "มหาวิทยาลัยเชียงใหม่",
      period: "2025 - ปัจจุบัน",
      detail: "CAMT, วท.บ. สาขาการบูรณาการอุตสาหกรรมดิจิทัล",
      gpa: "3.31",
    },
  ],
} as const

// 1. Professional Experience
const professionalExperience = {
  en: {
    production: [
      {
        name: "Municipality Web Application - Phlu Ta Luang",
        role: "Frontend Developer (Member)",
        description: "A web application built to streamline municipal operations and service management.",
        target: "Government staff and local citizens.",
        problem: "Manual paperwork and decentralized data management.",
        learned: "Real-world web application workflow and collaboration with municipal staff.",
        url: "https://github.com/farpinta/ProjectPruta",
      },
    ],
    competition: [
      {
        name: "HYLIFE Hackathon 2025",
        role: "Developer & Presenter",
        description: "Solution for Smart Agriculture and Food Supply Chain.",
        target: "Farmers and food supply chain managers.",
        problem: "Inefficiency in tracking produce quality and supply chain transparency.",
        learned: "Rapid prototyping, pitch deck preparation, and working under pressure.",
      },
    ],
    academic: [
      {
        name: "OOP Lab Project 2026",
        role: "Lead Developer",
        description: "A Java-based application implementing Object-Oriented Programming principles.",
        target: "CS Students / Faculty.",
        problem: "Need for a practical implementation of OOP patterns.",
        learned: "Advanced Java concepts, design patterns, and clean code principles.",
      },
      {
        name: "DII Design - CAMT Open House 2025",
        role: "Presentation & UX Designer",
        description: "Interactive presentation for exploring development roles.",
        target: "Prospective students.",
        problem: "Complexity in understanding different tech roles for beginners.",
        learned: "User-centric design and effective technical communication.",
      },
    ],
    personal: [
      {
        name: "AIM4 Mod",
        role: "Creator",
        description: "A modification project for AIM4 focused on static content delivery.",
        target: "Modding community.",
        problem: "Lack of lightweight and updated content for the platform.",
        learned: "Web layout fundamentals and community feedback integration.",
      },
    ],
    openSource: [
      {
        name: "ProjectPruta Contributions",
        role: "Contributor",
        description: "Maintenance and bug fixes for the open-source municipal template.",
        target: "Open-source developers.",
        problem: "Unresolved issues in the core template.",
        learned: "Git workflow, code review processes, and contributing to community projects.",
      },
    ],
  },
  th: {
    production: [
      {
        name: "เว็บแอปพลิเคชันเทศบาล - เทศบาลตำบลพลูตาหลวง",
        role: "นักพัฒนาส่วนหน้า (สมาชิกทีม)",
        description: "แอปพลิเคชันเพื่อช่วยจัดการฐานข้อมูลและบริการประชาชนของเทศบาล",
        target: "พนักงานเทศบาลและประชาชนในพื้นที่",
        problem: "การจัดการระบบเอกสารที่ซ้ำซ้อนและข้อมูลไม่รวมศูนย์",
        learned: "ได้เรียนรู้การทำงานร่วมกับพนักงานในสายงานปกครอง และ Workflow แอปจริง",
        url: "https://github.com/farpinta/ProjectPruta",
      },
    ],
    competition: [
      {
        name: "HYLIFE Hackathon 2025",
        role: "นักพัฒนาและผู้นำเสนอ",
        description: "โซลูชันสำหรับเกษตรกรรมอัจฉริยะและห่วงโซ่อุปทานอาหาร",
        target: "เกษตรกรและผู้จัดการห่วงโซ่อุปทาน",
        problem: "ความไม่มีประสิทธิภาพในการติดตามคุณภาพผลผลิตและความโปร่งใส",
        learned: "การสร้างต้นแบบอย่างรวดเร็ว (Prototyping) และการทำงานภายใต้ความกดดัน",
      },
    ],
    academic: [
      {
        name: "โปรเจกต์ OOP Lab 2026",
        role: "นักพัฒนาหลัก",
        description: "แอปพลิเคชัน Java ที่เน้นการนำหลักการ Object-Oriented มาใช้งานจริง",
        target: "นักศึกษาและผู้สนใจวิทยาการคอมพิวเตอร์",
        problem: "ต้องการตัวอย่างการประยุกต์ใช้ Design Patterns ที่ชัดเจน",
        learned: "เข้าใจหลักการ OOP เชิงลึกและการเขียนโค้ดที่บำรุงรักษาง่าย",
      },
      {
        name: "DII Design - CAMT Open House 2025",
        role: "ผู้ออกแบบการนำเสนอและ UX",
        description: "สื่อนำเสนอที่อธิบายเส้นทางสายอาชีพในยุคดิจิทัล",
        target: "นักเรียนมัธยมและผู้เข้าชมงาน",
        problem: "ความเข้าใจยากของบทบาทในสายงานไอทีสำหรับคนนอก",
        learned: "การออกแบบที่ยึดผู้ใช้เป็นหลักและการสื่อสารข้อมูลสายวิชาการให้เข้าใจง่าย",
      },
    ],
    personal: [
      {
        name: "AIM4 Mod",
        role: "ผู้สร้าง",
        description: "โปรเจกต์ปรับแต่ง AIM4 เน้นการจัดการเนื้อหาแบบ Static",
        target: "กลุ่มผู้ใช้งาน Mod",
        problem: "ขาดแพลตฟอร์มที่เบาและทันสมัยสำหรับข้อมูล Mod",
        learned: "พื้นฐานการจัดเลย์เอาต์เว็บและการรับฟีดแบ็กจากผู้ใช้",
      },
    ],
    openSource: [
      {
        name: "การช่วยพัฒนา ProjectPruta",
        role: "ผู้ร่วมพัฒนา",
        description: "การแก้ไข Bug และปรับปรุงฟังก์ชันในคลังโปรเจกต์สาธารณะ",
        target: "นักพัฒนาโอเพนซอร์ส",
        problem: "ต้องการการซ่อมแซม Bug ในตัวเทมเพลตหลัก",
        learned: "กระบวนการ Git Workflow และการตรวจสอบโค้ดร่วมกับผู้อื่น",
      },
    ],
  },
} as const

// 2. Self-Development
const selfDevelopment = {
  en: {
    certifications: [
      { name: "UX/UI Foundation Program 2025", institution: "T.C.C. Technology Co., Ltd." },
      
      { name: "Google Data Analytics", institution: "Coursera (In Progress)" },
    ],
    workshops: [
      { name: "Modern Web Infrastructure Workshop", institution: "Tech Community" },
      { name: "Agile Development Seminar", institution: "CAMT" },
    ],
  },
  th: {
    certifications: [
      { name: "โครงการพื้นฐาน UX/UI 2025", institution: "บริษัท ที.ซี.ซี. เทคโนโลยี จำกัด" },
      
      { name: "Google Data Analytics", institution: "Coursera (กำลังเรียน)" },
    ],
    workshops: [
      { name: "สัมมนาโครงสร้างเว็บพื้นฐานยุคใหม่", institution: "Tech Community" },
      { name: "สัมมนาการพัฒนาแบบ Agile", institution: "วิทยาลัยศิลปะ สื่อ และเทคโนโลยี" },
    ],
  },
} as const

// 3. Awards & Achievements
const awards = {
  en: {
    competitions: [
      { name: "HYLIFE Hackathon 2025", rank: "3rd Place Winner", theme: "Smart Agriculture" },
    ],
    honors: [
      { name: "Academic Excellence Award", institution: "Grade 12", detail: "Highest GPA in Software Program" },
    ],
  },
  th: {
    competitions: [
      { name: "HYLIFE Hackathon 2025", rank: "รางวัลชนะเลิศอันดับ 3", theme: "Smart Agriculture" },
    ],
    honors: [
      { name: "รางวัลผลการเรียนดีเด่น", institution: "ม.ปลาย", detail: "เกรดเฉลี่ยสูงสุดในแผนกซอฟต์แวร์" },
    ],
  },
} as const

// 4. Leadership & Volunteer
const leadership = {
  en: [
    {
      title: "Class Representative",
      role: "Student Leader",
      description: "Managed communications between students and faculty during high school.",
      softSkills: ["Communication", "Conflict Resolution", "EQ"],
      period: "2023 - 2025",
    },
  ],
  th: [
    {
      title: "หัวหน้าห้อง/ตัวแทนชั้นเรียน",
      role: "ผู้นำนักเรียน",
      description: "จัดการสื่อสารระหว่างเพื่อนร่วมชั้นและครูผู้สอนในช่วงมัธยมปลาย",
      softSkills: ["การสื่อสาร", "การจัดการความขัดแย้ง", "ความฉลาดทางอารมณ์"],
      period: "2566 - 2568",
    },
  ],
} as const

const experiences = {
  en: [
    {
      title: "P'CAT HOUSE - Part-time Administrative Assistant",
      period: "March 2022 - Present",
      points: [
        "Managed tenant records including personal information and utility tracking.",
        "Recorded payment data in Excel and Google Sheets.",
        "Organized administrative documents.",
        "Designed notices using Canva.",
      ],
    },
  ],
  th: [
    {
      title: "P'CAT HOUSE - ผู้ช่วยงานธุรการ (พาร์ตไทม์)",
      period: "มีนาคม 2022 - ปัจจุบัน",
      points: [
        "ดูแลข้อมูลผู้เช่าและข้อมูลการชำระเงิน",
        "บันทึกและดูแลข้อมูลด้วย Excel และ Google Sheets",
        "ช่วยจัดระเบียบและอัปเดตเอกสารงานธุรการ",
        "ออกแบบประกาศและเอกสารด้วย Canva",
      ],
    },
  ],
} as const

const copy = {
  en: {
    pageLabel: "Resume / CV",
    name: "Thanatphong Tarin",
    intro:
      "Entry-level software engineering student with practical administrative experience and a growing focus on web development and IT infrastructure.",
    sectionProf: "Professional Experience",
    sectionSelf: "Self-Development",
    sectionAwards: "Awards & Achievements",
    sectionLead: "Leadership & Volunteer",
    sectionEd: "Education",
    roleLabel: "Role",
    targetLabel: "Target / Audience",
    problemLabel: "Problem Solved",
    learnedLabel: "Lessons Learned",
    certLabel: "Certifications",
    workshopLabel: "Workshops & Seminars",
    compLabel: "Competitions",
    honorLabel: "Honors & Awards",
    skillLabel: "Soft Skills",
    gpaLabel: "GPA",
    categories: {
      production: "Production",
      competition: "Competition",
      academic: "Academic",
      personal: "Personal",
      openSource: "Open Source",
    },
  },
  th: {
    pageLabel: "เรซูเม่ / ประวัติย่อ",
    name: "ธณัฐพงค์ ทะรินทร์",
    intro:
      "นักศึกษาสายวิศวกรรมซอฟต์แวร์ระดับเริ่มต้น มีประสบการณ์งานธุรการจริง และมุ่งพัฒนาด้านเว็บแอปพลิเคชันรวมถึงโครงสร้างพื้นฐานไอที",
    sectionProf: "ประสบการณ์ระดับมืออาชีพ",
    sectionSelf: "การพัฒนาตนเอง",
    sectionAwards: "รางวัลและความสำเร็จ",
    sectionLead: "ความเป็นผู้นำและงานอาสา",
    sectionEd: "การศึกษา",
    roleLabel: "บทบาทของคุณ",
    targetLabel: "กลุ่มเป้าหมาย",
    problemLabel: "ปัญหาที่แก้ไข",
    learnedLabel: "สิ่งที่คุณได้เรียนรู้",
    certLabel: "ใบประกาศนียบัตร",
    workshopLabel: "การอบรมและสัมมนา",
    compLabel: "การแข่งขัน",
    honorLabel: "รางวัลเกียรติยศ",
    skillLabel: "ทักษะด้านอารมณ์และสังคม (Soft Skills)",
    gpaLabel: "เกรดเฉลี่ย",
    categories: {
      production: "Production Project",
      competition: "Competition Project",
      academic: "Academic Project",
      personal: "Personal Project",
      openSource: "Open Source / Contributions",
    },
  },
} as const

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
                      <li key={pt} className="text-xs text-muted-foreground list-disc marker:text-primary">{pt}</li>
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

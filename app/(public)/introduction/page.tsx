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
} from "lucide-react"
import { useLanguage } from "@/components/language-provider"

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

const experiences = {
  en: [
    {
      title: "P'CAT HOUSE - Part-time Administrative Assistant",
      period: "March 2022 - Present",
      points: [
        "Managed tenant records including personal information, rent status, and utility tracking.",
        "Recorded and maintained monthly payment data in Excel and Google Sheets.",
        "Organized and updated administrative documents.",
        "Designed basic notices and documents using Canva.",
      ],
    },
  ],
  th: [
    {
      title: "P'CAT HOUSE - ผู้ช่วยงานธุรการ (พาร์ตไทม์)",
      period: "มีนาคม 2022 - ปัจจุบัน",
      points: [
        "ดูแลข้อมูลผู้เช่า รวมถึงข้อมูลส่วนตัว สถานะค่าเช่า และค่าน้ำ/ค่าไฟ",
        "บันทึกและดูแลข้อมูลการชำระเงินรายเดือนด้วย Excel และ Google Sheets",
        "ช่วยจัดระเบียบและอัปเดตเอกสารงานธุรการ",
        "ออกแบบประกาศและเอกสารพื้นฐานด้วย Canva",
      ],
    },
  ],
} as const

const projects = {
  en: [
    {
      name: "Municipality Web Application - Phlu Ta Luang Subdistrict Municipality",
      status: "In Progress",
      description: "Developing a web application to support municipal operations.",
      url: "https://github.com/farpinta/ProjectPruta",
    },
    {
      name: "DII Design - CAMT Open House 2025",
      status: "Event-Based Project",
      description:
        "Helped create presentation slides that explain development roles to younger students at CAMT Open House.",
    },
  ],
  th: [
    {
      name: "เว็บแอปพลิเคชันเทศบาล - เทศบาลตำบลพลูตาหลวง",
      status: "กำลังพัฒนา",
      description: "พัฒนาเว็บแอปเพื่อสนับสนุนการทำงานของเทศบาล",
      url: "https://github.com/farpinta/ProjectPruta",
    },
    {
      name: "DII Design - CAMT Open House 2025",
      status: "โปรเจกต์ตามอีเวนต์",
      description: "ช่วยจัดทำสไลด์อธิบายบทบาทสายงานพัฒนาให้กับน้องๆ ในงาน CAMT Open House",
    },
  ],
} as const

const certifications = {
  en: [
    "HYLIFE Hackathon 2025",
    "UX/UI Foundation Program 2025 - T.C.C. Technology Co., Ltd.",
  ],
  th: ["HYLIFE Hackathon 2025", "UX/UI Foundation Program 2025 - T.C.C. Technology Co., Ltd."],
} as const

const interests = {
  en: [
    "IT support and system administration",
    "Computer hardware and operating systems",
    "Learning new technologies and troubleshooting techniques",
  ],
  th: [
    "งาน IT Support และ System Administration",
    "ฮาร์ดแวร์คอมพิวเตอร์และระบบปฏิบัติการ",
    "เรียนรู้เทคโนโลยีใหม่และเทคนิคการแก้ปัญหา",
  ],
} as const

const activities = {
  en: [
    "Self-study in IT support, networking, and system administration",
    "Practiced system setup and troubleshooting outside classroom activities",
  ],
  th: [
    "ศึกษาด้วยตนเองด้าน IT Support, Networking และ System Administration",
    "ฝึกติดตั้งระบบและแก้ปัญหานอกเวลาเรียน",
  ],
} as const

const mediumHighlights = {
  en: [
    {
      title: "AI and Software Dev: How to use it, not fear it",
      summary:
        "A practical note on treating AI as a daily development partner for ideation, coding, and debugging instead of seeing it as a replacement.",
    },
    {
      title: "Journey of My Project: From spreadsheet to real-time SQL",
      summary:
        "A build log about turning a city-planning idea into a real-time system and learning from the messy parts of product development.",
    },
    {
      title: "From Daily PC User to IT Support",
      summary:
        "A personal path from everyday computer use into hands-on IT support, troubleshooting, and system thinking.",
    },
    {
      title: "Wellness Economy and how it changed my perspective",
      summary:
        "A reflection on noticing value in ordinary things and how that changes the way we think about work, life, and decisions.",
    },
  ],
  th: [
    {
      title: "AI กับ Software Dev: ใช้ให้เป็น ไม่ต้องกลัว",
      summary:
        "บันทึกมุมมองเรื่องการใช้ AI เป็นผู้ช่วยในงานพัฒนา ช่วยคิด เขียน และแก้ปัญหาในชีวิตประจำวันของ Dev",
    },
    {
      title: "Journey of My Project: จาก Spreadsheet สู่ SQL แบบ Real-time",
      summary:
        "เบื้องหลังการพัฒนาโปรเจกต์วางผังเมืองดิจิทัล ตั้งแต่ไอเดียเริ่มต้นไปจนถึงระบบจริง และบทเรียนจากงานพัฒนา",
    },
    {
      title: "From Daily PC User to IT Support",
      summary:
        "เส้นทางจากคนใช้คอมพิวเตอร์ในชีวิตประจำวันไปสู่การลงมือทำงาน IT Support และการแก้ปัญหาเชิงระบบ",
    },
    {
      title: "Wellness Economy และมุมมองที่เปลี่ยนไป",
      summary:
        "บทสะท้อนว่าการมองเห็นคุณค่าของสิ่งใกล้ตัวช่วยเปลี่ยนวิธีคิดเรื่องงาน ชีวิต และการตัดสินใจอย่างไร",
    },
  ],
} as const

const copy = {
  en: {
    pageLabel: "Resume / CV",
    intro:
      "Entry-level software engineering student with practical administrative experience, strong academic performance, and a growing focus on web application development and IT support.",
    educationTag: "Education",
    educationTitle: "Education and Qualifications",
    experienceTag: "Experience and Projects",
    experienceTitle: "Working Experience",
    projectCardTitle: "Academic / Ongoing Project",
    sourceCode: "View Source Code",
    mediumProfile: "Visit Medium Profile",
    writingTitle: "Selected Writing",
    writingTag: "Articles and reflections",
    achievementsTitle: "Achievements and Certifications",
    certTitle: "Certifications",
    achievementLine: "HYLIFE Hackathon 2025 - 3rd Place Winner",
    achievementTheme: "Theme: Smart Agriculture and Food Supply Chain",
    languageTitle: "Languages",
    langThai: "Thai: Native",
    langEnglish: "English: CEFR B2",
    interestTitle: "Interests and Extra-Curricular Activities",
    gpaLabel: "GPA",
  },
  th: {
    pageLabel: "เรซูเม่ / ประวัติย่อ",
    intro:
      "นักศึกษาสายวิศวกรรมซอฟต์แวร์ระดับเริ่มต้น มีประสบการณ์งานธุรการจริง ผลการเรียนดี และมุ่งพัฒนาด้านเว็บแอปพลิเคชันรวมถึงงาน IT Support",
    educationTag: "การศึกษา",
    educationTitle: "การศึกษาและคุณวุฒิ",
    experienceTag: "ประสบการณ์และโปรเจกต์",
    experienceTitle: "ประสบการณ์ทำงาน",
    projectCardTitle: "โปรเจกต์การศึกษา / กำลังพัฒนา",
    sourceCode: "ดูซอร์สโค้ด",
    mediumProfile: "ไปยัง Medium Profile",
    writingTitle: "บทความที่คัดเลือก",
    writingTag: "บทความและข้อคิด",
    achievementsTitle: "ผลงานและประกาศนียบัตร",
    certTitle: "ประกาศนียบัตร",
    achievementLine: "HYLIFE Hackathon 2025 - รางวัลชนะเลิศอันดับ 3",
    achievementTheme: "หัวข้อ: Smart Agriculture and Food Supply Chain",
    languageTitle: "ภาษา",
    langThai: "ไทย: ภาษาแม่",
    langEnglish: "อังกฤษ: CEFR B2",
    interestTitle: "ความสนใจและกิจกรรมนอกหลักสูตร",
    gpaLabel: "เกรดเฉลี่ย",
  },
} as const

export default function IntroductionPage() {
  const { language } = useLanguage()
  const t = copy[language]

  return (
    <div>
      <section className="relative min-h-[60vh] px-4 sm:px-6 pt-28 sm:pt-32 pb-16 sm:pb-20">
        <div className="mx-auto max-w-4xl">
          <div className="space-y-6 sm:space-y-8">
            <div className="space-y-3">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">{t.pageLabel}</p>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance">Thanatphong Tarin</h1>
              <p className="text-base sm:text-lg leading-relaxed text-muted-foreground max-w-3xl">{t.intro}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <a
                href="mailto:Thanatphong2719@gmail.com"
                className="group flex items-center gap-3 rounded border border-border/50 bg-card/50 px-4 py-3 transition-all duration-300 hover:border-primary/50 hover:bg-card"
              >
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  Thanatphong2719@gmail.com
                </span>
              </a>
              <div className="flex items-center gap-3 rounded border border-border/50 bg-card/50 px-4 py-3">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">+66 91 876 3373</span>
              </div>
              <a
                href="https://github.com/WinTuner"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded border border-border/50 bg-card/50 px-4 py-3 transition-all duration-300 hover:border-primary/50 hover:bg-card sm:col-span-2"
              >
                <ExternalLink className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  github.com/WinTuner
                </span>
              </a>
              <a
                href="https://medium.com/@thanatphong2719"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded border border-border/50 bg-card/50 px-4 py-3 transition-all duration-300 hover:border-primary/50 hover:bg-card sm:col-span-2"
              >
                <ExternalLink className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  {t.mediumProfile}
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="relative px-4 sm:px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <div className="rounded border border-border/50 bg-card/50 p-6 sm:p-10 backdrop-blur-sm space-y-10">
            <div className="space-y-4">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">{t.educationTag}</p>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t.educationTitle}</h2>
            </div>

            <div className="space-y-4">
              {education[language].map((item) => (
                <article
                  key={item.school}
                  className="rounded border border-border/50 bg-background/40 p-5 sm:p-6"
                >
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="flex items-center gap-2 font-semibold text-foreground">
                        <GraduationCap className="h-4 w-4 text-primary" />
                        {item.school}
                      </h3>
                      <p className="text-sm text-muted-foreground">{item.detail}</p>
                    </div>
                    <span className="font-mono text-xs uppercase tracking-wider text-primary whitespace-nowrap">
                      {item.period}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t.gpaLabel}: {item.gpa}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative px-4 sm:px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 space-y-4">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">{t.experienceTag}</p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t.experienceTitle}</h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {experiences[language].map((experience) => (
              <div
                key={experience.title}
                className="rounded border border-border/50 bg-card/50 p-6 backdrop-blur-sm"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded border border-primary/30 bg-primary/10 text-primary">
                  <Briefcase className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-foreground">{experience.title}</h3>
                <p className="mt-2 font-mono text-xs uppercase tracking-wider text-primary">
                  {experience.period}
                </p>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {experience.points.map((point) => (
                    <li key={point} className="flex gap-2">
                      <span className="text-primary">-</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="rounded border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
              <h3 className="text-base font-semibold text-foreground">{t.projectCardTitle}</h3>
              <div className="mt-4 space-y-4">
                {projects[language].map((project) => (
                  <article key={project.name} className="rounded border border-border/50 bg-background/40 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="font-medium text-foreground leading-snug">{project.name}</h4>
                      <span className="font-mono text-[11px] uppercase tracking-wider text-primary whitespace-nowrap">
                        {project.status}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{project.description}</p>
                    {project.url ? (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        {t.sourceCode}
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    ) : null}
                  </article>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 rounded border border-border/50 bg-card/50 p-6 sm:p-8 backdrop-blur-sm space-y-6">
            <div className="space-y-4">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">{t.writingTag}</p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t.writingTitle}</h2>
                <a
                  href="https://medium.com/@thanatphong2719"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  {t.mediumProfile}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {mediumHighlights[language].map((article) => (
                <article key={article.title} className="rounded border border-border/50 bg-background/40 p-5">
                  <h3 className="font-semibold text-foreground leading-snug">{article.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{article.summary}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
              <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-foreground">
                <Trophy className="h-4 w-4 text-primary" />
                {t.achievementsTitle}
              </h3>
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>
                  <span className="text-foreground font-medium">{t.achievementLine}</span>
                  <br />
                  {t.achievementTheme}
                </p>
                <div>
                  <p className="font-medium text-foreground mb-2">{t.certTitle}</p>
                  <ul className="space-y-1.5">
                    {certifications[language].map((certification) => (
                      <li key={certification} className="flex gap-2">
                        <span className="text-primary">-</span>
                        <span>{certification}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="rounded border border-border/50 bg-card/50 p-6 backdrop-blur-sm space-y-6">
              <div>
                <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-foreground">
                  <Languages className="h-4 w-4 text-primary" />
                  {t.languageTitle}
                </h3>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  <li>{t.langThai}</li>
                  <li>{t.langEnglish}</li>
                </ul>
              </div>

              <div>
                <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-foreground">
                  <Wrench className="h-4 w-4 text-primary" />
                  {t.interestTitle}
                </h3>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  {interests[language].map((interest) => (
                    <li key={interest} className="flex gap-2">
                      <span className="text-primary">-</span>
                      <span>{interest}</span>
                    </li>
                  ))}
                </ul>
                <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
                  {activities[language].map((activity) => (
                    <li key={activity} className="flex gap-2">
                      <span className="text-primary">-</span>
                      <span>{activity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

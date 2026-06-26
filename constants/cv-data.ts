import type {
  AwardMap,
  CVCopyMap,
  EducationMap,
  ExperienceMap,
  LeadershipMap,
  ProfessionalExperienceMap,
  SelfDevelopmentMap,
} from "@/types/cv"

export const education = {
  en: [
    {
      school: "Chiang Rai Provincial Administrative Organization School",
      period: "2019 - 2025",
      detail: "Software Engineer Program",
      gpa: "3.97",
      image: "/crapao-school.png",
    },
    {
      school: "Chiang Mai University",
      period: "2025 - Present",
      detail: "CAMT, Bachelor of Science in Digital Industry Integration",
      gpa: "3.40 ",
      image: "/cmu-education.png",
    },
  ],
  th: [
    {
      school: "โรงเรียนองค์การบริหารส่วนจังหวัดเชียงราย",
      period: "2019 - 2025",
      detail: "แผนการเรียนวิศวกรรมซอฟต์แวร์",
      gpa: "3.97",
      image: "/crapao-school.png",
    },
    {
      school: "มหาวิทยาลัยเชียงใหม่",
      period: "2025 - ปัจจุบัน",
      detail: "CAMT, วท.บ. สาขาการบูรณาการอุตสาหกรรมดิจิทัล",
      gpa: "3.40 ",
      image: "/cmu-education.png",
    },
  ],
} satisfies EducationMap

export const professionalExperience = {
  en: {
    production: [
      {
        name: "Muanjai (ม่วนใจ๋)",
        role: "Co-Founder & Chief Technology Officer (CTO)",
        description: "An Agentic AI Travel Concierge connecting domestic and foreign tourists in Chiang Mai with independent local SMEs via LINE Official Account and Web platforms.",
        target: "Domestic and foreign tourists in Chiang Mai, and local independent SMEs.",
        problem: "Connecting tourists directly with local SMEs without high platform commissions, while providing a seamless, automated booking experience.",
        learned: "Integrating local LLMs (Pathumma LLM) on supercomputing infra (ThaiSC), designing autonomous conversational booking agents, and building secure real-time PromptPay verification.",
        url: "https://muanjai-ai.up.railway.app/chat/",
      },
      {
        name: "Municipality Web Application - Phlu Ta Luang",
        role: "Back-end Developer (Member)",
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
        name: "Muanjai (ม่วนใจ๋)",
        role: "ผู้ร่วมก่อตั้งและประธานเจ้าหน้าที่ฝ่ายเทคโนโลยี (Co-Founder & CTO)",
        description: "แพลตฟอร์มผู้ช่วยท่องเที่ยวอัจฉริยะ (Agentic AI Travel Concierge) ที่เชื่อมโยงนักท่องเที่ยวทั้งไทยและต่างประเทศในเชียงใหม่กับผู้ประกอบการ SME ท้องถิ่นผ่าน LINE OA และเว็บแอปพลิเคชัน",
        target: "นักท่องเที่ยวในจังหวัดเชียงใหม่ และผู้ประกอบการรายย่อย (SMEs) ในท้องถิ่น",
        problem: "การเข้าถึงนักท่องเที่ยวโดยตรงของร้านค้าท้องถิ่นโดยไม่ต้องผ่านแพลตฟอร์มคอมมิชชันสูง และความสะดวกในการจองท่องเที่ยวอัจฉริยะแบบเรียลไทม์",
        learned: "การผสานการใช้งาน Pathumma LLM บนโครงสร้างพื้นฐาน ThaiSC Supercomputer, ออกแบบการจองผ่าน LINE Chatbot และสร้างระบบสแกนชำระเงินและตรวจสอบสลิป PromptPay อัตโนมัติ",
        url: "https://muanjai-ai.up.railway.app/chat/",
      },
      {
        name: "เว็บแอปพลิเคชันเทศบาล - เทศบาลตำบลพลูตาหลวง",
        role: "นักพัฒนาส่วนหลัง (สมาชิกทีม)",
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
} satisfies ProfessionalExperienceMap

export const selfDevelopment = {
  en: {
    certifications: [
      { name: "UX/UI Foundation Program 2025", institution: "T.C.C. Technology Co., Ltd.", image: "/tcc-uxui.png" },
      { name: "Google Data Analytics", institution: "Coursera (In Progress)" },
    ],
    workshops: [
      { name: "Modern Web Infrastructure Workshop", institution: "Tech Community" },
      { name: "Agile Development Seminar", institution: "CAMT" },
    ],
  },
  th: {
    certifications: [
      { name: "โครงการพื้นฐาน UX/UI 2025", institution: "บริษัท ที.ซี.ซี. เทคโนโลยี จำกัด", image: "/tcc-uxui.png" },
      { name: "Google Data Analytics", institution: "Coursera (กำลังเรียน)" },
    ],
    workshops: [
      { name: "สัมมนาโครงสร้างเว็บพื้นฐานยุคใหม่", institution: "Tech Community" },
      { name: "สัมมนาการพัฒนาแบบ Agile", institution: "วิทยาลัยศิลปะ สื่อ และเทคโนโลยี" },
    ],
  },
} satisfies SelfDevelopmentMap

export const awards = {
  en: {
    competitions: [
      {
        name: "HYLIFE Hackathon 2025",
        rank: "3rd Place Winner",
        theme: "Smart Agriculture",
        image: "/hylife-hackathon.png",
      },
    ],
    honors: [
      { name: "Academic Excellence Award", institution: "Grade 12", detail: "Highest GPA in Software Program" },
    ],
  },
  th: {
    competitions: [
      {
        name: "HYLIFE Hackathon 2025",
        rank: "รางวัลชนะเลิศอันดับ 3",
        theme: "Smart Agriculture",
        image: "/hylife-hackathon.png",
      },
    ],
    honors: [{ name: "รางวัลผลการเรียนดีเด่น", institution: "ม.ปลาย", detail: "เกรดเฉลี่ยสูงสุดในแผนกซอฟต์แวร์" }],
  },
} satisfies AwardMap

export const leadership = {
  en: [
    {
      title: "School Representative - Japan Cultural Exchange",
      role: "Student Representative",
      description: "Selected as a school representative for the Language and Cultural Exchange Program at Shizuoka Seiko Academy in Shizuoka, Japan.",
      softSkills: ["Cross-Cultural Communication", "Adaptability", "Interpersonal Skills"],
      period: "April 12 - 26, 2023",
      image: "/IMG_0809.jpg",
    },
  ],
  th: [
    {
      title: "ตัวแทนโรงเรียน - โครงการแลกเปลี่ยนภาษาและวัฒนธรรมต่างประเทศ (ประเทศญี่ปุ่น)",
      role: "ตัวแทนนักเรียน",
      description: "ได้รับการคัดเลือกเป็นตัวแทนของโรงเรียน ในโครงการส่งเสริมประสบการณ์การเรียนรู้ภาษาและวัฒนธรรมต่างประเทศ (ประเทศญี่ปุ่น) ณ Shizuoka Seiko Academy, จังหวัดชิซึโอกะ ประเทศญี่ปุ่น ระหว่างวันที่ 12 - 26 เมษายน ๒๕๖๖",
      softSkills: ["การสื่อสารต่างวัฒนธรรม", "การปรับตัว", "มนุษยสัมพันธ์"],
      period: "12 - 26 เมษายน 2566",
      image: "/IMG_0809.jpg",
    },
  ],
} satisfies LeadershipMap

export const experiences = {
  en: [
    {
      title: "Muanjai (ม่วนใจ๋) - Co-Founder & Chief Technology Officer (CTO)",
      period: "June 2026 - Present",
      points: [
        "Co-founded and engineered Muanjai, an Agentic AI Travel Concierge platform connecting global tourists with local SMEs via [LINE OA](https://line.me/R/ti/p/%40636owbhl) and [Web Client](https://muanjai-ai.up.railway.app/chat/).",
        "Designed the core AI architecture, integrating NECTEC's Pathumma LLM leveraging ThaiSC's supercomputing infrastructure for localized AI agents.",
        "Developed scalable backend services supporting automated booking engines and real-time PromptPay payment verification.",
        "Established DevOps practices including cloud deployment, CI/CD automation, and rigorous security standards for proprietary code and data protection.",
      ],
    },
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
      title: "Muanjai (ม่วนใจ๋) - ผู้ร่วมก่อตั้งและประธานเจ้าหน้าที่ฝ่ายเทคโนโลยี (Co-Founder & CTO)",
      period: "มิถุนายน 2026 - ปัจจุบัน",
      points: [
        "ร่วมก่อตั้งและพัฒนา Muanjai แพลตฟอร์มผู้ช่วยท่องเที่ยวอัจฉริยะเพื่อสนับสนุนธุรกิจ SME ท้องถิ่นผ่าน [LINE OA](https://line.me/R/ti/p/%40636owbhl) และ [Web Client](https://muanjai-ai.up.railway.app/chat/)",
        "ออกแบบโครงสร้างระบบ AI เชื่อมต่อระบบจองอัตโนมัติ โดยผสานการใช้ Pathumma LLM บนโครงสร้างพื้นฐานซูเปอร์คอมพิวเตอร์ ThaiSC",
        "พัฒนา Backend สำหรับระบบจองท่องเที่ยวแบบเรียลไทม์ และระบบตรวจสอบความถูกต้องของสลิปและสแกนชำระเงินผ่าน PromptPay",
        "จัดทำโครงสร้างพื้นฐานระบบ Cloud, ระบบตรวจสอบความผิดพลาด (Observability), วางระบบ CI/CD และรักษาความลับของซอร์สโค้ดและข้อมูลส่วนตัว", 
      ],
    },
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
} satisfies ExperienceMap

export const copy = {
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
} satisfies CVCopyMap

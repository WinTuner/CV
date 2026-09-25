import type {
	AwardMap,
	CVCopyMap,
	EducationMap,
	ExperienceMap,
	LeadershipMap,
	ProfessionalExperienceMap,
	SelfDevelopmentMap,
} from "@/types/cv";

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
			gpa: "3.40",
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
			gpa: "3.40",
			image: "/cmu-education.png",
		},
	],
	ja: [
		{
			school: "チェンライ県行政学校",
			period: "2019 - 2025",
			detail: "ソフトウェア工学プログラム",
			gpa: "3.97",
			image: "/crapao-school.png",
		},
		{
			school: "チェンマイ大学",
			period: "2025 - 現在",
			detail: "CAMT デジタル産業統合学士課程",
			gpa: "3.40",
			image: "/cmu-education.png",
		},
	],
	zh: [
		{
			school: "清莱府行政学校",
			period: "2019 - 2025",
			detail: "软件工程项目",
			gpa: "3.97",
			image: "/crapao-school.png",
		},
		{
			school: "清迈大学",
			period: "2025 - 至今",
			detail: "CAMT 数字产业整合学士",
			gpa: "3.40",
			image: "/cmu-education.png",
		},
	],
} satisfies EducationMap;

export const professionalExperience = {
	en: {
		production: [
			{
				name: "Muanjai (ม่วนใจ๋)",
				role: "Co-Founder & Chief Technology Officer (CTO)",
				description:
					"An AI-powered compliance helper bot that helps hotels, homestays, and individuals manage their licenses, certificates, and document expiry via LINE Official Account and a web client.",
				target:
					"Hotels, homestays, and individuals who need to track licenses, certificates, and compliance deadlines.",
				problem:
					"License and certificate expiry dates are scattered across paper documents and spreadsheets — easy to miss, with fines and compliance risks when forgotten.",
				learned:
					"Building RAG-based document Q&A on local LLMs (Pathumma LLM on ThaiSC supercomputing infra), designing expiry reminder flows, building secure real-time PromptPay verification, hardening webhook reliability (retry dedup, reply-window deadlines, operator alerting), and enforcing security best practices (session secret fail-fast, CORS anchoring) — all guarded by a CI pipeline running 240+ tests.",
				url: "https://line.me/R/ti/p/%40636owbhl",
			},
			{
				name: "Municipality Web Application - Phlu Ta Luang",
				role: "Back-end Developer (Member)",
				description:
					"A web application built to streamline municipal operations and service management.",
				target: "Government staff and local citizens.",
				problem: "Manual paperwork and decentralized data management.",
				learned:
					"Real-world web application workflow and collaboration with municipal staff.",
				url: "https://github.com/farpinta/ProjectPruta",
			},
		],
		competition: [
			{
				name: "HYLIFE Hackathon 2025",
				role: "Developer & Presenter",
				description: "Solution for Smart Agriculture and Food Supply Chain.",
				target: "Farmers and food supply chain managers.",
				problem:
					"Inefficiency in tracking produce quality and supply chain transparency.",
				learned:
					"Rapid prototyping, pitch deck preparation, and working under pressure.",
			},
		],
		academic: [
			{
				name: "OOP Lab Project 2026",
				role: "Lead Developer",
				description:
					"A Java-based application implementing Object-Oriented Programming principles.",
				target: "CS Students / Faculty.",
				problem: "Need for a practical implementation of OOP patterns.",
				learned:
					"Advanced Java concepts, design patterns, and clean code principles.",
			},
			{
				name: "DII Design - CAMT Open House 2025",
				role: "Presentation & UX Designer",
				description:
					"Interactive presentation for exploring development roles.",
				target: "Prospective students.",
				problem:
					"Complexity in understanding different tech roles for beginners.",
				learned: "User-centric design and effective technical communication.",
			},
		],
		personal: [
			{
				name: "AIM4 Mod",
				role: "Creator",
				description:
					"A modification project for AIM4 focused on static content delivery.",
				target: "Modding community.",
				problem: "Lack of lightweight and updated content for the platform.",
				learned: "Web layout fundamentals and community feedback integration.",
				url: "https://github.com/WinTuner/aim4-mod",
			},
		],
		openSource: [
			{
				name: "AutoOS",
				role: "Contributor",
				description:
					"Native AOT WinUI 3 application that automates migrating to a new Windows installation on a separate partition — a cleaner, faster system tuned for gaming and productivity.",
				target: "Windows power users and gamers.",
				problem: "Manual Windows reinstalls are slow and leave behind bloat.",
				learned:
					"WinUI 3, Native AOT publishing, partition management, and upstream open-source collaboration.",
				url: "https://github.com/WinTuner/AutoOS",
				image: "/autoos-hero.png",
			},
			{
				name: "ProjectPruta Contributions",
				role: "Contributor",
				description:
					"Maintenance and bug fixes for the open-source municipal template.",
				target: "Open-source developers.",
				problem: "Unresolved issues in the core template.",
				learned:
					"Git workflow, code review processes, and contributing to community projects.",
				url: "https://github.com/farpinta/ProjectPruta",
			},
		],
	},
	th: {
		production: [
			{
				name: "Muanjai (ม่วนใจ๋)",
				role: "ผู้ร่วมก่อตั้งและประธานเจ้าหน้าที่ฝ่ายเทคโนโลยี (Co-Founder & CTO)",
				description:
					"บอทช่วยดูแลด้านการปฏิบัติตามข้อกำหนด (Compliance Helper Bot) ด้วย AI ช่วยให้โรงแรม โฮมสเตย์ และบุคคลทั่วไป จัดการใบอนุญาต ใบรับรอง และติดตามวันหมดอายุเอกสารผ่าน LINE OA และเว็บแอปพลิเคชัน",
				target:
					"โรงแรม โฮมสเตย์ และบุคคลทั่วไป ที่ต้องติดตามใบอนุญาต ใบรับรอง และวันครบกำหนดด้าน compliance",
				problem:
					"วันหมดอายุของใบอนุญาตและใบรับรองกระจายอยู่ในเอกสารกระดาษและสเปรดชีต — หลงลืมง่าย เสี่ยงค่าปรับและปัญหาทางกฎหมายเมื่อปล่อยเลยกำหนด",
				learned:
					"สร้างระบบถาม-ตอบเอกสารด้วย RAG บน LLM ภาษาไทย (Pathumma LLM บนโครงสร้างพื้นฐาน ThaiSC Supercomputer), ออกแบบระบบแจ้งเตือนวันหมดอายุ, สร้างระบบตรวจสอบสลิปและสแกนชำระเงิน PromptPay อัตโนมัติ, เสริมความน่าเชื่อถือของ webhook (กันข้อความซ้ำ, ควบคุมเวลาตอบกลับ, แจ้งเตือนผู้ดูแล), และยึดหลักปฏิบัติด้านความปลอดภัย (บังคับ SESSION_SECRET_KEY, ตรึงขอบเขต CORS) — โดยมี CI ที่รันเทสต์ 240+ รายการคอยดูแล",
				url: "https://line.me/R/ti/p/%40636owbhl",
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
				learned:
					"การสร้างต้นแบบอย่างรวดเร็ว (Prototyping) และการทำงานภายใต้ความกดดัน",
			},
		],
		academic: [
			{
				name: "โปรเจกต์ OOP Lab 2026",
				role: "นักพัฒนาหลัก",
				description:
					"แอปพลิเคชัน Java ที่เน้นการนำหลักการ Object-Oriented มาใช้งานจริง",
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
				url: "https://github.com/WinTuner/aim4-mod",
			},
		],
		openSource: [
			{
				name: "AutoOS",
				role: "ผู้ร่วมพัฒนา",
				description:
					"แอปพลิเคชัน WinUI 3 แบบ Native AOT ที่ช่วยย้ายการติดตั้ง Windows ใหม่ไปยังพาร์ติชันแยกอัตโนมัติ — ได้ระบบที่สะอาดและเร็วขึ้น เหมาะสำหรับเกมและงานทั่วไป",
				target: "ผู้ใช้ Windows ขั้นสูงและเกมเมอร์",
				problem: "การลง Windows ใหม่ด้วยตนเองช้าและทิ้งโปรแกรมไม่จำเป็นไว้",
				learned:
					"WinUI 3, การเผยแพร่แบบ Native AOT, การจัดการพาร์ติชัน และการร่วมงานกับโอเพนซอร์สต้นน้ำ",
				url: "https://github.com/WinTuner/AutoOS",
				image: "/autoos-hero.png",
			},
			{
				name: "การช่วยพัฒนา ProjectPruta",
				role: "ผู้ร่วมพัฒนา",
				description: "การแก้ไข Bug และปรับปรุงฟังก์ชันในคลังโปรเจกต์สาธารณะ",
				target: "นักพัฒนาโอเพนซอร์ส",
				problem: "ต้องการการซ่อมแซม Bug ในตัวเทมเพลตหลัก",
				learned: "กระบวนการ Git Workflow และการตรวจสอบโค้ดร่วมกับผู้อื่น",
				url: "https://github.com/farpinta/ProjectPruta",
			},
		],
	},
	ja: {
		production: [
			{
				name: "Muanjai (ม่วนใจ๋)",
				role: "共同創業者兼最高技術責任者 (Co-Founder & CTO)",
				description:
					"ホテル・民泊・個人向けにライセンスや証明書の有効期限を LINE OA と Web クライアントで管理する AI コンプライアンス支援ボット。",
				target:
					"ライセンスや証明書の期限管理が必要なホテル・民泊・個人。",
				problem:
					"有効期限が紙やスプレッドシートに分散し、見逃しやすく罰金やコンプライアンスリスクにつながる。",
				learned:
					"タイ語LLM（Pathumma LLM / ThaiSC）によるRAG文書QA、有効期限リマインダー、PromptPay 検証、Webhook の信頼性向上（リトライ重複排除、返信期限ガード、オペレーター通知）、セキュリティ（SESSION_SECRET 必須、CORS 固定）を構築 — CI は 240+ テストで保護。",
				url: "https://line.me/R/ti/p/%40636owbhl",
			},
			{
				name: "Municipality Web Application - Phlu Ta Luang",
				role: "バックエンド開発者（メンバー）",
				description:
					"自治体業務とサービス管理を効率化するWebアプリケーション。",
				target: "自治体職員と地域住民。",
				problem: "手作業の書類と分散したデータ管理。",
				learned:
					"自治体職員との協働と実務Webアプリのワークフロー。",
				url: "https://github.com/farpinta/ProjectPruta",
			},
		],
		competition: [
			{
				name: "HYLIFE Hackathon 2025",
				role: "開発者 & プレゼンター",
				description: "スマート農業と食品サプライチェーン向けソリューション。",
				target: "農家とサプライチェーンマネージャー。",
				problem:
					"農産物の品質追跡とサプライチェーンの透明性の非効率。",
				learned:
					"迅速なプロトタイピング、ピッチ準備、プレッシャー下での協働。",
			},
		],
		academic: [
			{
				name: "OOP Lab Project 2026",
				role: "リード開発者",
				description:
					"オブジェクト指向原理を実装した Java アプリケーション。",
				target: "CS 学生 / 教員。",
				problem: "OOP パターンの実践的な実装が必要。",
				learned:
					"高度な Java 概念、デザインパターン、クリーンコード原則。",
			},
			{
				name: "DII Design - CAMT Open House 2025",
				role: "プレゼンテーション & UX デザイナー",
				description:
					"開発職を探索するためのインタラクティブなプレゼンテーション。",
				target: "入学希望者。",
				problem:
					"初心者にとって異なる技術職を理解するのが複雑。",
				learned: "ユーザー中心設計と効果的な技術コミュニケーション。",
			},
		],
		personal: [
			{
				name: "AIM4 Mod",
				role: "クリエーター",
				description:
					"AIM4 のための改造プロジェクト、静的コンテンツ配信に焦点。",
				target: "Mod コミュニティ。",
				problem: "プラットフォーム向けの軽量で更新されたコンテンツの不足。",
				learned: "Web レイアウトの基礎とコミュニティフィードバック統合。",
				url: "https://github.com/WinTuner/aim4-mod",
			},
		],
		openSource: [
			{
				name: "AutoOS",
				role: "コントリビューター",
				description:
					"新しい Windows インストールへの移行を別パーティションに自動化する Native AOT WinUI 3 アプリ — ゲームと生産性向けにクリーンで高速なシステムを構築。",
				target: "Windows パワーユーザーとゲーマー。",
				problem: "手動の再インストールは遅く、ブロートウェアが残る。",
				learned:
					"WinUI 3、Native AOT 公開、パーティション管理、上流オープンソースとの協働。",
				url: "https://github.com/WinTuner/AutoOS",
				image: "/autoos-hero.png",
			},
			{
				name: "ProjectPruta Contributions",
				role: "コントリビューター",
				description:
					"オープンソースの自治体テンプレートの保守とバグ修正。",
				target: "オープンソース開発者。",
				problem: "コアテンプレートの未解決の問題。",
				learned:
					"Git ワークフロー、コードレビュー、コミュニティプロジェクトへの貢献。",
				url: "https://github.com/farpinta/ProjectPruta",
			},
		],
	},
	zh: {
		production: [
			{
				name: "Muanjai (ม่วนใจ๋)",
				role: "联合创始人兼首席技术官 (Co-Founder & CTO)",
				description:
					"为酒店、民宿与个人提供通过 LINE OA 与网页客户端管理许可证、证书及到期提醒的 AI 合规助手。",
				target:
					"需要跟踪许可证与到期期限的酒店、民宿及个人。",
				problem:
					"许可证到期日分散在纸质文件与表格中，容易遗漏，导致罚款与合规风险。",
				learned:
					"基于泰语大模型（Pathumma LLM / ThaiSC）构建 RAG 文档问答，设计到期提醒、PromptPay 实时核验、加固 Webhook 可靠性（去重、回复窗口、运营告警）与安全实践（SESSION_SECRET 强校验、CORS 固定），CI 守护 240+ 测试。",
				url: "https://line.me/R/ti/p/%40636owbhl",
			},
			{
				name: "Municipality Web Application - Phlu Ta Luang",
				role: "后端开发者（成员）",
				description:
					"用于优化市政运营与服务管理的网页应用。",
				target: "政府工作人员与当地居民。",
				problem: "手工文书与分散的数据管理。",
				learned:
					"真实的 Web 应用工作流及与市政人员协作。",
				url: "https://github.com/farpinta/ProjectPruta",
			},
		],
		competition: [
			{
				name: "HYLIFE Hackathon 2025",
				role: "开发者与演示者",
				description: "面向智慧农业与食品供应链的解决方案。",
				target: "农民与供应链管理者。",
				problem:
					"农产品质量追踪与供应链透明度效率低下。",
				learned:
					"快速原型、路演准备与高压协作。",
			},
		],
		academic: [
			{
				name: "OOP Lab Project 2026",
				role: "主程",
				description:
					"基于 Java 实现面向对象原则的应用程序。",
				target: "CS 学生 / 教师。",
				problem: "需要对 OOP 模式的实践性实现。",
				learned:
					"高级 Java 概念、设计模式与整洁代码原则。",
			},
			{
				name: "DII Design - CAMT Open House 2025",
				role: "演示与 UX 设计师",
				description:
					"用于探索开发角色的互动演示。",
				target: "潜在学生。",
				problem:
					"初学者难以理解不同技术角色的复杂性。",
				learned: "以用户为中心的设计与有效的技术沟通。",
			},
		],
		personal: [
			{
				name: "AIM4 Mod",
				role: "创作者",
				description:
					"面向 AIM4 的改造项目，专注于静态内容分发。",
				target: "Mod 社区。",
				problem: "平台缺乏轻量且更新的内容。",
				learned: "网页布局基础与社区反馈整合。",
				url: "https://github.com/WinTuner/aim4-mod",
			},
		],
		openSource: [
			{
				name: "AutoOS",
				role: "贡献者",
				description:
					"将全新 Windows 安装自动迁移到独立分区的 Native AOT WinUI 3 应用 — 打造为游戏与生产力优化的干净高速系统。",
				target: "Windows 高级用户与玩家。",
				problem: "手动重装缓慢且残留臃肿软件。",
				learned:
					"WinUI 3、Native AOT 发布、分区管理与上游开源协作。",
				url: "https://github.com/WinTuner/AutoOS",
				image: "/autoos-hero.png",
			},
			{
				name: "ProjectPruta Contributions",
				role: "贡献者",
				description:
					"开源市政模板的维护与缺陷修复。",
				target: "开源开发者。",
				problem: "核心模板中未解决的问题。",
				learned:
					"Git 工作流、代码评审与社区项目贡献。",
				url: "https://github.com/farpinta/ProjectPruta",
			},
		],
	},
} satisfies ProfessionalExperienceMap;

export const selfDevelopment = {
	en: {
		certifications: [
			{
				name: "UX/UI Foundation Program 2025",
				institution: "T.C.C. Technology Co., Ltd.",
				image: "/tcc-uxui.png",
			},
		],
		workshops: [
			{
				name: "Modern Web Infrastructure Workshop",
				institution: "Tech Community",
			},
			{ name: "Agile Development Seminar", institution: "CAMT" },
		],
	},
	th: {
		certifications: [
			{
				name: "โครงการพื้นฐาน UX/UI 2025",
				institution: "บริษัท ที.ซี.ซี. เทคโนโลยี จำกัด",
				image: "/tcc-uxui.png",
			},
		],
		workshops: [
			{ name: "สัมมนาโครงสร้างเว็บพื้นฐานยุคใหม่", institution: "Tech Community" },
			{
				name: "สัมมนาการพัฒนาแบบ Agile",
				institution: "วิทยาลัยศิลปะ สื่อ และเทคโนโลยี",
			},
		],
	},
	ja: {
		certifications: [
			{
				name: "UX/UI 基礎プログラム 2025",
				institution: "T.C.C. Technology Co., Ltd.",
				image: "/tcc-uxui.png",
			},
		],
		workshops: [
			{
				name: "モダンWebインフラワークショップ",
				institution: "Tech Community",
			},
			{ name: "アジャイル開発セミナー", institution: "CAMT" },
		],
	},
	zh: {
		certifications: [
			{
				name: "UX/UI 基础项目 2025",
				institution: "T.C.C. Technology Co., Ltd.",
				image: "/tcc-uxui.png",
			},
		],
		workshops: [
			{
				name: "现代 Web 基础设施研讨会",
				institution: "Tech Community",
			},
			{ name: "敏捷开发研讨会", institution: "CAMT" },
		],
	},
} satisfies SelfDevelopmentMap;

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
			{
				name: "Academic Excellence Award",
				institution: "Grade 12",
				detail: "Highest GPA in Software Program",
			},
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
		honors: [
			{
				name: "รางวัลผลการเรียนดีเด่น",
				institution: "ม.ปลาย",
				detail: "เกรดเฉลี่ยสูงสุดในแผนกซอฟต์แวร์",
			},
		],
	},
	ja: {
		competitions: [
			{
				name: "HYLIFE Hackathon 2025",
				rank: "第3位入賞",
				theme: "スマート農業",
				image: "/hylife-hackathon.png",
			},
		],
		honors: [
			{
				name: "学業優秀賞",
				institution: "高校3年",
					detail: "ソフトウェアプログラムで最高GPA",
			},
		],
	},
	zh: {
		competitions: [
			{
				name: "HYLIFE Hackathon 2025",
				rank: "季军",
				theme: "智慧农业",
				image: "/hylife-hackathon.png",
			},
		],
		honors: [
			{
				name: "学业优秀奖",
				institution: "高三",
					detail: "软件项目最高 GPA",
			},
		],
	},
} satisfies AwardMap;

export const leadership = {
	en: [
		{
			title: "School Representative - Japan Cultural Exchange",
			role: "Student Representative",
			description:
				"Selected as a school representative for the Language and Cultural Exchange Program at Shizuoka Seiko Academy in Shizuoka, Japan.",
			softSkills: [
				"Cross-Cultural Communication",
				"Adaptability",
				"Interpersonal Skills",
			],
			period: "April 12 - 26, 2023",
			image: "/IMG_0809.jpg",
		},
	],
	th: [
		{
			title:
				"ตัวแทนโรงเรียน - โครงการแลกเปลี่ยนภาษาและวัฒนธรรมต่างประเทศ (ประเทศญี่ปุ่น)",
			role: "ตัวแทนนักเรียน",
			description:
				"ได้รับการคัดเลือกเป็นตัวแทนของโรงเรียน ในโครงการส่งเสริมประสบการณ์การเรียนรู้ภาษาและวัฒนธรรมต่างประเทศ (ประเทศญี่ปุ่น) ณ Shizuoka Seiko Academy, จังหวัดชิซึโอกะ ประเทศญี่ปุ่น ระหว่างวันที่ 12 - 26 เมษายน ๒๕๖๖",
			softSkills: ["การสื่อสารต่างวัฒนธรรม", "การปรับตัว", "มนุษยสัมพันธ์"],
			period: "12 - 26 เมษายน 2566",
			image: "/IMG_0809.jpg",
		},
	],
	ja: [
		{
			title: "学校代表 - 日本文化交流",
			role: "生徒代表",
			description:
				"静岡県の静岡聖光学院における言語・文化交流プログラムの学校代表に選出。",
			softSkills: [
				"異文化コミュニケーション",
				"適応力",
				"対人スキル",
			],
			period: "2023年4月12日 - 26日",
			image: "/IMG_0809.jpg",
		},
	],
	zh: [
		{
			title: "学校代表 - 日本文化交流",
			role: "学生代表",
			description:
				"被选为学校代表参加在日本静冈县静冈圣光学院举行的语言与文化交流项目。",
			softSkills: ["跨文化沟通", "适应能力", "人际交往"],
			period: "2023年4月12日 - 26日",
			image: "/IMG_0809.jpg",
		},
	],
} satisfies LeadershipMap;

export const experiences = {
	en: [
		{
			title: "Muanjai (ม่วนใจ๋) - Co-Founder & Chief Technology Officer (CTO)",
			period: "June 2025 - Present",
			points: [
				"Co-founded and engineered Muanjai, an AI-powered compliance helper bot that helps hotels, homestays, and individuals track licenses and document expiry via [LINE OA](https://line.me/R/ti/p/%40636owbhl) and a [Web Client](https://muanjai-ai.up.railway.app/chat/).",
				"Designed the core AI architecture, integrating NECTEC's Pathumma LLM leveraging ThaiSC's supercomputing infrastructure for RAG-based document Q&A in Thai.",
				"Built expiry reminder flows, document upload and status summaries, plus secure real-time PromptPay payment verification.",
				"Hardened the LINE webhook pipeline: retry idempotency ledger, reply-window deadline guards, and concurrency caps so every message gets a reply inside LINE's 30s token window.",
				"Added operator alerting that pushes critical errors (e.g. webhook error-rate spikes) to an admin LINE account, rate-limited to avoid alert floods.",
				"Established DevOps practices including cloud deployment, CI/CD automation, and rigorous security standards for proprietary code and data protection — CI enforces lint, type checks, and 240+ tests.",
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
			title:
				"Muanjai (ม่วนใจ๋) - ผู้ร่วมก่อตั้งและประธานเจ้าหน้าที่ฝ่ายเทคโนโลยี (Co-Founder & CTO)",
			period: "มิถุนายน 2568 - ปัจจุบัน",
			points: [
				"ร่วมก่อตั้งและพัฒนา Muanjai บอทช่วยดูแลด้านการปฏิบัติตามข้อกำหนด (Compliance Helper Bot) ด้วย AI สำหรับโรงแรม โฮมสเตย์ และบุคคลทั่วไป ในการติดตามใบอนุญาตและวันหมดอายุเอกสาร ผ่าน [LINE OA](https://line.me/R/ti/p/%40636owbhl) และ [Web Client](https://muanjai-ai.up.railway.app/chat/)",
				"ออกแบบโครงสร้างระบบ AI ผสานการใช้ Pathumma LLM ของ NECTEC บนโครงสร้างพื้นฐานซูเปอร์คอมพิวเตอร์ ThaiSC สำหรับระบบถาม-ตอบเอกสาร (RAG) เป็นภาษาไทย",
				"พัฒนาระบบแจ้งเตือนวันหมดอายุเอกสาร, ระบบอัปโหลดเอกสารและสรุปสถานะ รวมถึงระบบตรวจสอบความถูกต้องของสลิปและสแกนชำระเงินผ่าน PromptPay แบบเรียลไทม์",
				"เสริมความน่าเชื่อถือให้ LINE Webhook: ระบบกันข้อความซ้ำ (idempotency), การควบคุมเวลาตอบกลับภายในหน้าต่าง reply token 30 วินาที และการจำกัดจำนวนงานพร้อมกัน",
				"เพิ่มระบบแจ้งเตือนอัตโนมัติถึงผู้ดูแลเมื่อมีข้อผิดพลาดรุนแรง (เช่น อัตราข้อผิดพลาด webhook สูง) ผ่าน LINE โดยจำกัดความถี่ไม่ให้รบกวนเกินไป",
				"จัดทำโครงสร้างพื้นฐานระบบ Cloud, ระบบตรวจสอบความผิดพลาด (Observability), วางระบบ CI/CD และรักษาความลับของซอร์สโค้ดและข้อมูลส่วนตัว — CI ตรวจ lint, type check และเทสต์ 240+ รายการ",
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
	ja: [
		{
			title: "Muanjai (ม่วนใจ๋) - 共同創業者兼最高技術責任者 (CTO)",
			period: "2025年6月 - 現在",
			points: [
				"Muanjai を共同創業・開発。ホテル・民泊・個人向けにライセンスや書類の期限を [LINE OA](https://line.me/R/ti/p/%40636owbhl) と [Webクライアント](https://muanjai-ai.up.railway.app/chat/) で追跡する AI コンプライアンス支援ボット。",
				"NECTEC の Pathumma LLM と ThaiSC スーパーコンピューティング基盤を統合した RAG 文書QAの中核 AI アーキテクチャを設計。",
				"有効期限リマインダー、書類アップロードとステータス要約、PromptPay リアルタイム決済検証を構築。",
				"LINE Webhook パイプラインを強化：リトライ冪等性台帳、返信期限ガード、同時実行上限で LINE の 30 秒トークンウィンドウ内に必ず返信。",
				"重大エラー（例：Webhook エラー率急増）を管理者 LINE アカウントへプッシュするオペレーターアラートを追加、レート制限で通知氾濫を防止。",
				"クラウドデプロイ、CI/CD 自動化、厳格なセキュリティ基準を含む DevOps プラクティスを確立 — CI は lint、型チェック、240+ テストを強制。",
			],
		},
		{
			title: "P'CAT HOUSE - パートタイム事務アシスタント",
			period: "2022年3月 - 現在",
			points: [
				"入居者の個人情報や光熱費を含むテナント記録を管理。",
				"Excel と Google スプレッドシートで支払いデータを記録。",
				"事務文書を整理。",
				"Canva で通知をデザイン。",
			],
		},
	],
	zh: [
		{
			title: "Muanjai (ม่วนใจ๋) - 联合创始人兼首席技术官 (CTO)",
			period: "2025年6月 - 至今",
			points: [
				"联合创立并开发 Muanjai — 为酒店、民宿与个人通过 [LINE OA](https://line.me/R/ti/p/%40636owbhl) 与 [网页客户端](https://muanjai-ai.up.railway.app/chat/) 跟踪许可证与到期日的 AI 合规助手。",
				"设计核心 AI 架构，集成 NECTEC Pathumma LLM 并依托 ThaiSC 超算基础设施实现泰语 RAG 文档问答。",
				"构建到期提醒、文档上传与状态汇总，以及安全的 PromptPay 实时支付核验。",
				"加固 LINE Webhook 链路：重试幂等台账、回复窗口截止保护与并发上限，确保在 LINE 30 秒令牌窗口内必达回复。",
				"新增运营告警，将严重错误（如 Webhook 错误率激增）推送至管理员 LINE 账号，并限流避免告警风暴。",
				"建立包含云部署、CI/CD 自动化与严格安全标准的 DevOps 实践 — CI 强制 lint、类型检查与 240+ 测试。",
			],
		},
		{
			title: "P'CAT HOUSE - 兼职行政助理",
			period: "2022年3月 - 至今",
			points: [
				"管理租客记录，包括个人信息与水电费跟踪。",
				"在 Excel 与 Google Sheets 中记录付款数据。",
				"整理行政文档。",
				"使用 Canva 设计通知。",
			],
		},
	],
} satisfies ExperienceMap;

export const copy = {
	en: {
		pageLabel: "Resume / CV — CAMT DII, CMU · Sec 1",
		name: "Thanatphong Tarin",
		intro:
			"Year-2 DII student at CAMT, Chiang Mai University (GPA 3.40; high-school Software Program 3.97) and Co-Founder & CTO of Muanjai. Building Thai RAG systems on Pathumma LLM + ThaiSC, LINE OA compliance bots with PromptPay verification, and full-stack web platforms — from OOP/Java foundations to production DevOps (240+ tests).",
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
		pageLabel: "เรซูเม่ / ประวัติย่อ — CAMT DII มช. Sec 1",
		name: "ธณัฐพงค์ ทะรินทร์",
		intro:
			"นักศึกษาชั้นปีที่ 2 สาขาการบูรณาการอุตสาหกรรมดิจิทัล (DII) วิทยาลัยศิลปะ สื่อ และเทคโนโลยี มหาวิทยาลัยเชียงใหม่ (GPA 3.40; มัธยมแผนวิศวกรรมซอฟต์แวร์ 3.97) และผู้ร่วมก่อตั้ง & CTO ของ Muanjai — พัฒนาระบบ RAG ภาษาไทยบน Pathumma LLM/ThaiSC, บอท LINE OA ด้าน compliance พร้อมตรวจ PromptPay และเว็บ Full-Stack ตั้งแต่ฐาน OOP/Java สู่ Production DevOps (เทสต์ 240+)",
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
	ja: {
		pageLabel: "履歴書 / CV — CAMT DII, CMU · Sec 1",
		name: "Thanatphong Tarin",
		intro:
			"CAMT チェンマイ大学 DII 2年（GPA 3.40；高校ソフトウェア学科 3.97）、Muanjai 共同創業者兼CTO。Pathumma LLM + ThaiSC によるタイ語 RAG、PromptPay 検証付き LINE OA コンプライアンスボット、フルスタックWeb — OOP/Java 基礎から本番 DevOps（240+ テスト）まで。",
		sectionProf: "職務経験",
		sectionSelf: "自己研鑽",
		sectionAwards: "受賞・成果",
		sectionLead: "リーダーシップ・ボランティア",
		sectionEd: "学歴",
		roleLabel: "役割",
		targetLabel: "対象 / オーディエンス",
		problemLabel: "解決した課題",
		learnedLabel: "学んだこと",
		certLabel: "認定",
		workshopLabel: "ワークショップ・セミナー",
		compLabel: "コンペティション",
		honorLabel: "表彰",
		skillLabel: "ソフトスキル",
		gpaLabel: "GPA",
		categories: {
			production: "プロダクション",
			competition: "コンペティション",
			academic: "アカデミック",
			personal: "パーソナル",
			openSource: "オープンソース",
		},
	},
	zh: {
		pageLabel: "简历 / CV — CAMT DII, CMU · Sec 1",
		name: "Thanatphong Tarin",
		intro:
			"清迈大学 CAMT DII 大二学生（GPA 3.40；高中软件工程 3.97），Muanjai 联合创始人兼CTO。基于 Pathumma LLM + ThaiSC 构建泰语 RAG，LINE OA 合规机器人含 PromptPay 核验，以及全栈网页平台 — 从 OOP/Java 基础到生产级 DevOps（240+ 测试）。",
		sectionProf: "专业经历",
		sectionSelf: "自我提升",
		sectionAwards: "奖项与成就",
		sectionLead: "领导力与志愿",
		sectionEd: "教育背景",
		roleLabel: "角色",
		targetLabel: "目标 / 受众",
		problemLabel: "解决的问题",
		learnedLabel: "收获",
		certLabel: "证书",
		workshopLabel: "研讨会",
		compLabel: "竞赛",
		honorLabel: "荣誉奖项",
		skillLabel: "软技能",
		gpaLabel: "GPA",
		categories: {
			production: "生产项目",
			competition: "竞赛项目",
			academic: "学术项目",
			personal: "个人项目",
			openSource: "开源贡献",
		},
	},
} satisfies CVCopyMap;

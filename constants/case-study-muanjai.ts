import type { SupportedLanguageCode } from "./languages";

/**
 * Muanjai case-study content. EN + TH are fully written; JA/ZH fall back
 * to EN via `pickTranslation` until dedicated translations land.
 */
export interface CaseStudySection {
	id: string;
	title: string;
	body: string[];
}

export interface CaseStudyMetric {
	value: string;
	label: string;
}

export interface CaseStudyCopy {
	kicker: string;
	title: string;
	subtitle: string;
	role: string;
	period: string;
	stackLabel: string;
	stack: string[];
	metrics: CaseStudyMetric[];
	sections: CaseStudySection[];
	learningsLabel: string;
	learnings: string[];
	ctaTitle: string;
	ctaLineOa: string;
	ctaProjects: string;
	backToProjects: string;
}

type PartialCopy = Partial<Record<SupportedLanguageCode, CaseStudyCopy>>;

const en: CaseStudyCopy = {
	kicker: "Case study",
	title: "Muanjai (ม่วนใจ๋)",
	subtitle:
		"An AI-powered compliance helper bot that helps hotels, homestays, and individuals track licenses, certificates, and document expiry — via LINE Official Account and a web client.",
	role: "Co-Founder & Chief Technology Officer",
	period: "June 2025 — Present",
	stackLabel: "Stack",
	stack: [
		"TypeScript",
		"Next.js",
		"LINE Messaging API",
		"Python · FastAPI",
		"PostgreSQL · pgvector",
		"RAG",
		"Pathumma LLM",
		"ThaiSC supercomputing",
		"PromptPay",
		"CI/CD",
	],
	metrics: [
		{ value: "240+", label: "Automated tests guarding CI" },
		{ value: "30s", label: "LINE reply-window guarantee" },
		{ value: "0", label: "Duplicate side-effects (idempotency ledger)" },
		{ value: "24/7", label: "Expiry reminders & doc status summaries" },
	],
	sections: [
		{
			id: "problem",
			title: "The problem",
			body: [
				"License and certificate expiry dates for small hotels and homestays live in paper folders and scattered spreadsheets. A missed renewal means fines — or worse, operating without a valid license.",
				"Owners needed something that meets them where they already are: LINE chat, in Thai, with answers grounded in their own documents — not a generic chatbot guessing from training data.",
			],
		},
		{
			id: "architecture",
			title: "Thai RAG architecture",
			body: [
				"The core is retrieval-augmented Q&A over Thai documents, built on NECTEC's Pathumma LLM running on ThaiSC supercomputing infrastructure. Uploaded documents are chunked, embedded, and retrieved at query time so every answer cites the owner's own paperwork.",
				"Keeping retrieval and generation decoupled means the knowledge base can grow — new license types, new regulations — without retraining anything. The model answers in Thai, grounded in retrieved context.",
			],
		},
		{
			id: "payments",
			title: "Real-time PromptPay verification",
			body: [
				"Subscriptions are paid over PromptPay, Thailand's national real-time rail. The system verifies payment slips and scan-to-pay transactions automatically instead of routing them through a human admin.",
				"Verification results feed straight back into the chat flow, so a user can go from expiry warning to paid-and-confirmed without leaving LINE.",
			],
		},
		{
			id: "reliability",
			title: "Webhook hardening",
			body: [
				"LINE enforces a hard ~30-second reply-token window: miss it and the user gets silence. The webhook pipeline answers inside that window with concurrency caps, deadline guards, and a retry idempotency ledger so a retried delivery never causes a duplicate charge, reminder, or reply.",
				"Critical failures — e.g. webhook error-rate spikes — push rate-limited alerts to an admin LINE account, so operators hear about incidents before users do.",
			],
		},
		{
			id: "devops",
			title: "DevOps & quality gates",
			body: [
				"Every change ships through cloud deployment with CI enforcing lint, type checks, and 240+ tests. Security practices are structural, not advisory: session secrets fail fast when missing, CORS origins are anchored, and proprietary code and customer data stay protected by pipeline policy.",
			],
		},
	],
	learningsLabel: "What I took away",
	learnings: [
		"Grounding beats model size: a modest Thai LLM with good retrieval outperforms a bigger model guessing without context.",
		"Messaging-platform constraints (reply windows, retry storms) shape backend architecture more than framework choice.",
		"Idempotency is a product feature, not plumbing — users experience it as 'the bot never double-charges me'.",
		"Rate-limited operator alerting is the difference between knowing about an outage and drowning in one.",
	],
	ctaTitle: "See it in action",
	ctaLineOa: "Chat on LINE OA",
	ctaProjects: "Browse all projects",
	backToProjects: "Back to projects",
};

const th: CaseStudyCopy = {
	kicker: "กรณีศึกษา",
	title: "Muanjai (ม่วนใจ๋)",
	subtitle:
		"บอทผู้ช่วยด้าน compliance ด้วย AI ช่วยโรงแรม โฮมสเตย์ และบุคคลทั่วไปติดตามใบอนุญาต ใบรับรอง และวันหมดอายุเอกสาร — ผ่าน LINE Official Account และเว็บแอป",
	role: "ผู้ร่วมก่อตั้งและประธานเจ้าหน้าที่ฝ่ายเทคโนโลยี",
	period: "มิถุนายน 2568 — ปัจจุบัน",
	stackLabel: "เทคโนโลยี",
	stack: [
		"TypeScript",
		"Next.js",
		"LINE Messaging API",
		"Python · FastAPI",
		"PostgreSQL · pgvector",
		"RAG",
		"Pathumma LLM",
		"ThaiSC Supercomputer",
		"PromptPay",
		"CI/CD",
	],
	metrics: [
		{ value: "240+", label: "เทสต์อัตโนมัติใน CI" },
		{ value: "30 วิ", label: "การันตีตอบกลับในหน้าต่าง reply ของ LINE" },
		{ value: "0", label: "ผลข้างเคียงซ้ำซ้อน (idempotency ledger)" },
		{ value: "24/7", label: "แจ้งเตือนวันหมดอายุและสรุปสถานะเอกสาร" },
	],
	sections: [
		{
			id: "problem",
			title: "ปัญหาที่แก้",
			body: [
				"วันหมดอายุของใบอนุญาตและใบรับรองของโรงแรมเล็กและโฮมสเตย์กระจัดกระจายอยู่ในแฟ้มกระดาษและสเปรดชีต ปล่อยเลยกำหนดเมื่อไรก็เสี่ยงค่าปรับ — หรือแย่กว่านั้นคือเปิดกิจการโดยไม่มีใบอนุญาตที่ถูกต้อง",
				"เจ้าของกิจการต้องการเครื่องมือที่เจอพวกเขาตรงจุดที่ใช้อยู่แล้ว นั่นคือแชต LINE เป็นภาษาไทย และตอบจากเอกสารของตัวเองจริง ๆ ไม่ใช่แชตบอททั่วไปที่เดาจากข้อมูลฝึกโมเดล",
			],
		},
		{
			id: "architecture",
			title: "สถาปัตยกรรม Thai RAG",
			body: [
				"หัวใจหลักคือระบบถาม-ตอบเอกสารภาษาไทยแบบ RAG สร้างบน Pathumma LLM ของ NECTEC บนโครงสร้างพื้นฐาน ThaiSC เอกสารที่อัปโหลดจะถูกตัดเป็นชิ้น ฝังเวกเตอร์ และดึงมาตอบตอนมีคำถาม ทุกคำตอบจึงอ้างอิงจากเอกสารของเจ้าของกิจการเอง",
				"การแยกส่วน retrieval กับ generation ทำให้ฐานความรู้โตได้ — ประเภทใบอนุญาตใหม่ ระเบียบใหม่ — โดยไม่ต้องฝึกโมเดลใหม่ โมเดลตอบเป็นภาษาไทยโดยมีบริบทที่ดึงมาหนุนหลัง",
			],
		},
		{
			id: "payments",
			title: "ตรวจ PromptPay แบบเรียลไทม์",
			body: [
				"ค่าสมาชิกจ่ายผ่าน PromptPay ระบบตรวจสอบสลิปและรายการสแกนจ่ายอัตโนมัติ ไม่ต้องผ่านแอดมินที่เป็นคน",
				"ผลการตรวจสอบไหลกลับเข้าแชตทันที ผู้ใช้จึงไปจากคำเตือนวันหมดอายุถึงจ่ายเงินยืนยันสำเร็จได้โดยไม่ต้องออกจาก LINE",
			],
		},
		{
			id: "reliability",
			title: "เสริมความแกร่งให้ webhook",
			body: [
				"LINE บังคับหน้าต่าง reply token ประมาณ 30 วินาทีแบบเด็ดขาด ตอบไม่ทันผู้ใช้จะเจอความเงียบ webhook pipeline จึงตอบในหน้าต่างนั้นเสมอด้วยการจำกัดงานพร้อมกัน การ์ดเวลาตอบกลับ และ idempotency ledger กันข้อความซ้ำ ทำให้การส่งซ้ำไม่ก่อให้เกิดการชาร์จ แจ้งเตือน หรือตอบซ้ำ",
				"ข้อผิดพลาดรุนแรง เช่น อัตรา error ของ webhook พุ่ง จะดันแจ้งเตือนแบบจำกัดความถี่ไปยัง LINE ของผู้ดูแล ทีมจึงรู้ปัญหาก่อนผู้ใช้",
			],
		},
		{
			id: "devops",
			title: "DevOps และประตูดคุณภาพ",
			body: [
				"ทุกการเปลี่ยนแปลงผ่าน cloud deployment โดยมี CI บังคับ lint, type check และเทสต์ 240+ รายการ หลักปฏิบัติด้านความปลอดภัยเป็นโครงสร้าง ไม่ใช่คำแนะนำ SESSION_SECRET ขาดแล้วล้มทันที CORS ตรึง origin และซอร์สโค้ดกับข้อมูลลูกค้าได้รับการปกป้องด้วยนโยบาย pipeline",
			],
		},
	],
	learningsLabel: "สิ่งที่ได้เรียนรู้",
	learnings: [
		"Grounding ชนะขนาดโมเดล LLM ไทยขนาดพอเหมาะที่มี retrieval ดี ตอบได้ดีกว่าโมเดลใหญ่ที่เดาโดยไม่มีบริบท",
		"ข้อจำกัดของแพลตฟอร์มแชต (หน้าต่างตอบกลับ พายุ retry) กำหนดสถาปัตยกรรม backend มากกว่าตัว framework",
		"Idempotency คือฟีเจอร์ของโปรดักต์ ไม่ใช่แค่งานท่อ — ผู้ใช้สัมผัสได้ว่า “บอทไม่เคยชาร์จซ้ำ”",
		"การแจ้งเตือนผู้ดูแลแบบจำกัดความถี่ คือเส้นแบ่งระหว่างรู้ว่าเกิด outage กับจมอยู่ในแจ้งเตือน",
	],
	ctaTitle: "ลองใช้งานจริง",
	ctaLineOa: "แชตผ่าน LINE OA",
	ctaProjects: "ดูโปรเจกต์ทั้งหมด",
	backToProjects: "กลับไปหน้าโปรเจกต์",
};

export const muanjaiCaseStudy: PartialCopy = { en, th };

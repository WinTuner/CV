import type { ActivityItem } from "./github";
import type { SupportedLanguageCode } from "@/constants/languages";
import { CONTACT_EMAIL } from "./site";

export const roles: Record<SupportedLanguageCode, readonly string[]> = {
	en: [
		"building interfaces",
		"exploring systems",
		"breaking barriers",
		"forging ideas",
		"crafting code",
	],
	th: [
		"สร้างอินเทอร์เฟซ",
		"สำรวจระบบ",
		"ทลายข้อจำกัด",
		"หลอมรวมไอเดีย",
		"เขียนโค้ดอย่างประณีต",
	],
	ja: [
		"インターフェースを構築",
		"システムを探求",
		"壁を打ち破る",
		"アイデアを鍛造",
		"コードを磨く",
	],
	zh: [
		"构建界面",
		"探索系统",
		"打破壁垒",
		"锻造创意",
		"精雕代码",
	],
} as const;

export const heroCopy: Record<
	SupportedLanguageCode,
	{ kicker: string; intro: string; explore: string; resume: string; scroll: string; location: string; email: string }
> = {
	en: {
		kicker: "Thanatphong Tarin",
		intro:
			"Software engineering student at Chiang Mai University and Co-Founder & CTO of Muanjai. Building Agentic AI systems, full-stack web applications, and DevOps infrastructure.",
		explore: "Explore projects",
		resume: "Resume",
		scroll: "scroll",
		location: "Chiang Mai, Thailand",
		email: CONTACT_EMAIL,
	},
	th: {
		kicker: "ธณัฐพงค์ ทะรินทร์",
		intro:
			"นักศึกษาชั้นปีที่ 2 วิทยาลัยศิลปะ สื่อ และเทคโนโลยี มหาวิทยาลัยเชียงใหม่ (CAMT • DII) และ Co-Founder & CTO ของ Muanjai — พัฒนาระบบ Agentic AI / RAG ภาษาไทย, เว็บ Full-Stack และ DevOps บน ThaiSC",
		explore: "ดูโปรเจกต์",
		resume: "เรซูเม่",
		scroll: "เลื่อนลง",
		location: "เชียงใหม่ ประเทศไทย",
		email: CONTACT_EMAIL,
	},
	ja: {
		kicker: "Thanatphong Tarin",
		intro:
			"チェンマイ大学のソフトウェア工学学生、Muanjai 共同創業者兼CTO。Agentic AI、フルスタックWeb、DevOps基盤を構築。",
		explore: "プロジェクトを見る",
		resume: "履歴書",
		scroll: "スクロール",
		location: "タイ・チェンマイ",
		email: CONTACT_EMAIL,
	},
	zh: {
		kicker: "Thanatphong Tarin",
		intro:
			"清迈大学软件工程学生，Muanjai 联合创始人兼CTO。构建 Agentic AI、全栈Web与DevOps基础设施。",
		explore: "查看项目",
		resume: "简历",
		scroll: "滚动",
		location: "泰国·清迈",
		email: CONTACT_EMAIL,
	},
} as const;

type RelativeInterval = { label: string; secs: number };

const RELATIVE_TIME_INTERVALS: Record<SupportedLanguageCode, RelativeInterval[]> = {
	en: [
		{ label: "year", secs: 31536000 },
		{ label: "month", secs: 2592000 },
		{ label: "day", secs: 86400 },
		{ label: "hour", secs: 3600 },
		{ label: "minute", secs: 60 },
		{ label: "second", secs: 1 },
	],
	th: [
		{ label: "ปี", secs: 31536000 },
		{ label: "เดือน", secs: 2592000 },
		{ label: "วัน", secs: 86400 },
		{ label: "ชั่วโมง", secs: 3600 },
		{ label: "นาที", secs: 60 },
		{ label: "วินาที", secs: 1 },
	],
	ja: [
		{ label: "年", secs: 31536000 },
		{ label: "か月", secs: 2592000 },
		{ label: "日", secs: 86400 },
		{ label: "時間", secs: 3600 },
		{ label: "分", secs: 60 },
		{ label: "秒", secs: 1 },
	],
	zh: [
		{ label: "年", secs: 31536000 },
		{ label: "月", secs: 2592000 },
		{ label: "天", secs: 86400 },
		{ label: "小时", secs: 3600 },
		{ label: "分钟", secs: 60 },
		{ label: "秒", secs: 1 },
	],
};

const JUST_NOW_BY_LANG: Record<SupportedLanguageCode, string> = {
	en: "just now",
	th: "เมื่อสักครู่",
	ja: "たった今",
	zh: "刚刚",
};

function formatCount(count: number, label: string, language: SupportedLanguageCode): string {
	switch (language) {
		case "en":
			return `${count} ${label}${count > 1 ? "s" : ""} ago`;
		case "th":
			return `${count} ${label}ที่แล้ว`;
		case "ja":
		case "zh":
			return `${count}${label}前`;
		default:
			return `${count} ${label} ago`;
	}
}

export function formatRelativeTime(dateString: string, language: SupportedLanguageCode) {
	const date = new Date(dateString);
	const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

	if (isNaN(seconds)) return dateString;

	const currentIntervals = RELATIVE_TIME_INTERVALS[language] ?? RELATIVE_TIME_INTERVALS.en;
	for (const interval of currentIntervals) {
		const count = Math.floor(seconds / interval.secs);
		if (count >= 1) {
			return formatCount(count, interval.label, language);
		}
	}
	return JUST_NOW_BY_LANG[language] ?? JUST_NOW_BY_LANG.en;
}

export function getMessageText(
	msg: ActivityItem["message"] | null | undefined,
	lang: SupportedLanguageCode,
) {
	if (!msg) return "";
	if (typeof msg === "string") return msg;
	return (msg as Record<string, string>)[lang] || (msg as Record<string, string>).en || "";
}

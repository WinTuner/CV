import type { ActivityItem } from "./github";

export const roles = {
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
} as const;

export const heroCopy = {
	en: {
		kicker: "Thanatphong Tarin",
		intro:
			"Software engineering student at Chiang Mai University and Co-Founder & CTO of Muanjai. Building Agentic AI systems, full-stack web applications, and DevOps infrastructure.",
		explore: "Explore projects",
		resume: "Resume",
		scroll: "scroll",
		location: "Chiang Mai, Thailand",
		email: "Thanatphong2719@gmail.com",
	},
	th: {
		kicker: "ธนัทพงษ์ ตาเรือน",
		intro:
			"นักศึกษาสายวิศวกรรมซอฟต์แวร์ มหาวิทยาลัยเชียงใหม่ ผู้ร่วมก่อตั้งและ CTO ของ Muanjai มุ่งมั่นพัฒนาระบบ Agentic AI, เว็บแอปพลิเคชันแบบ Full-Stack และโครงสร้างพื้นฐาน DevOps",
		explore: "ดูโปรเจกต์",
		resume: "เรซูเม่",
		scroll: "เลื่อนลง",
		location: "เชียงใหม่ ประเทศไทย",
		email: "Thanatphong2719@gmail.com",
	},
} as const;

export function formatRelativeTime(dateString: string, language: "en" | "th") {
	const date = new Date(dateString);
	const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

	if (isNaN(seconds)) return dateString;

	const intervals = {
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
	};

	const currentIntervals = intervals[language];
	for (const interval of currentIntervals) {
		const count = Math.floor(seconds / interval.secs);
		if (count >= 1) {
			if (language === "en") {
				return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
			} else {
				return `${count} ${interval.label}ที่แล้ว`;
			}
		}
	}
	return language === "en" ? "just now" : "เมื่อสักครู่";
}

export function getMessageText(
	msg: ActivityItem["message"] | null | undefined,
	lang: "en" | "th",
) {
	if (!msg) return "";
	if (typeof msg === "string") return msg;
	return msg[lang] || msg.en || "";
}

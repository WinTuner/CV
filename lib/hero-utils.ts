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
		kicker: "WinTuner - Where Code Meets Curiosity",
		intro:
			"Software engineering student at Chiang Mai University and Co-Founder & CTO of Muanjai. Building Agentic AI systems, full-stack web applications, and DevOps infrastructure.",
		explore: "explore artifacts",
		resume: "resume",
		scroll: "scroll",
		status: "status: forging",
		loaded: "experiments loaded: 18",
		spark: "last spark: today",
},
	th: {
		kicker: "WinTuner - ที่ที่โค้ดเจอกับความอยากรู้อยากเห็น",
		intro:
			"นักศึกษาสายวิศวกรรมซอฟต์แวร์ มหาวิทยาลัยเชียงใหม่ ผู้ร่วมก่อตั้งและ CTO ของ Muanjai มุ่งมั่นพัฒนาระบบ Agentic AI, เว็บแอปพลิเคชันแบบ Full-Stack และโครงสร้างพื้นฐาน DevOps",
		explore: "สำรวจผลงาน",
		resume: "เรซูเม่",
		scroll: "เลื่อนลง",
		status: "สถานะ: กำลังพัฒนา",
		loaded: "โหลดการทดลองแล้ว: 12",
		spark: "อัปเดตล่าสุด: วันนี้",
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

export function formatJournalDate(dateString: string) {
	const date = new Date(dateString);
	if (isNaN(date.getTime())) return "Jun 26 22:09:54";
	const months = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];
	const month = months[date.getMonth()];
	const day = String(date.getDate()).padStart(2, " ");
	const time = date.toTimeString().split(" ")[0]; // e.g. "22:09:54"
	return `${month} ${day} ${time}`;
}

export function getMessageText(
	msg: ActivityItem["message"] | null | undefined,
	lang: "en" | "th",
) {
	if (!msg) return "";
	if (typeof msg === "string") return msg;
	return msg[lang] || msg.en || "";
}

export function truncate(str: string, len: number) {
	return str.length > len ? str.slice(0, len) + "..." : str;
}

export function getLogType(type: string) {
	switch (type) {
		case "commit":
			return "COMMIT";
		case "pr":
			return "PULL_REQ";
		case "create":
			return "CREATE";
		default:
			return "ACTIVITY";
	}
}

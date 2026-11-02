"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "./language-provider";
import { DISCORD_PROFILE_URL, DISCORD_USER_ID } from "@/lib/site";

const STATUS_LABEL = {
	online: { en: "Online", th: "ออนไลน์", ja: "オンライン", zh: "在线" },
	idle: { en: "Idle", th: "ไม่อยู่", ja: "離席中", zh: "离开" },
	dnd: { en: "Do not disturb", th: "ห้ามรบกวน", ja: "取り込み中", zh: "请勿打扰" },
	offline: { en: "Offline", th: "ออฟไลน์", ja: "オフライン", zh: "离线" },
} as const;

const STATUS_COLOR: Record<string, string> = {
	online: "bg-emerald-400",
	idle: "bg-amber-400",
	dnd: "bg-rose-500",
	offline: "bg-muted-foreground",
};

// Lanyard activity types; custom status (4) is skipped because it has no name.
const ACTIVITY_VERB = {
	0: { en: "Playing", th: "กำลังเล่น", ja: "プレイ中", zh: "正在玩" },
	1: { en: "Streaming", th: "กำลังสตรีม", ja: "配信中", zh: "直播中" },
	2: { en: "Listening to", th: "กำลังฟัง", ja: "再生中", zh: "正在听" },
	3: { en: "Watching", th: "กำลังดู", ja: "視聴中", zh: "正在看" },
	5: { en: "Competing in", th: "กำลังแข่ง", ja: "参加中", zh: "参赛" },
} as const;

interface LanyardUser {
	discord_user: {
		id: string;
		username: string;
		global_name?: string | null;
		avatar?: string | null;
	};
	discord_status: "online" | "idle" | "dnd" | "offline";
	activities: Array<{ type: number; name: string; state?: string }>;
}

function avatarUrl(user: LanyardUser["discord_user"]) {
	if (user.avatar) {
		const ext = user.avatar.startsWith("a_") ? "gif" : "png";
		return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${ext}?size=96`;
	}
	// Default avatars are indexed by (id >> 22) % 6.
	const index = Number(BigInt(user.id) >> 22n) % 6;
	return `https://cdn.discordapp.com/embed/avatars/${index}.png`;
}

function Icon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
			<path d="M20.32 4.37a19.8 19.8 0 0 0-4.93-1.51 13.8 13.8 0 0 0-.64 1.28 18.3 18.3 0 0 0-5.5 0 13.8 13.8 0 0 0-.64-1.28 19.7 19.7 0 0 0-4.93 1.51C.53 9.05-.32 13.6.1 18.09a19.9 19.9 0 0 0 6.06 3.05c.49-.66.92-1.36 1.29-2.1a12.9 12.9 0 0 1-2.03-.97c.17-.12.34-.25.5-.38a14.2 14.2 0 0 0 12.16 0c.16.13.33.26.5.38-.65.38-1.33.7-2.03.97.37.74.8 1.44 1.29 2.1a19.8 19.8 0 0 0 6.06-3.05c.5-5.2-.86-9.7-3.58-13.72ZM8.02 15.6c-1.18 0-2.15-1.08-2.15-2.4 0-1.32.95-2.4 2.15-2.4 1.2 0 2.17 1.09 2.15 2.4 0 1.32-.95 2.4-2.15 2.4Zm7.96 0c-1.18 0-2.15-1.08-2.15-2.4 0-1.32.95-2.4 2.15-2.4 1.2 0 2.17 1.09 2.15 2.4 0 1.32-.95 2.4-2.15 2.4Z" />
		</svg>
	);
}

/**
 * Live Discord presence card (Lanyard). Renders nothing until
 * `NEXT_PUBLIC_DISCORD_USER_ID` is configured, and degrades to a plain profile
 * link when Lanyard is unreachable. Polls once a minute while the tab is
 * visible.
 */
export function DiscordCard() {
	const { language } = useLanguage();
	const [user, setUser] = useState<LanyardUser | null>(null);
	const [failed, setFailed] = useState(false);

	useEffect(() => {
		if (!DISCORD_USER_ID) return;
		let cancelled = false;

		const load = async () => {
			try {
				const res = await fetch(
					`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`,
					{ cache: "no-store" },
				);
				if (!res.ok) throw new Error(String(res.status));
				const json = (await res.json()) as { data?: LanyardUser };
				if (!cancelled && json.data) {
					setUser(json.data);
					setFailed(false);
				}
			} catch {
				if (!cancelled) setFailed(true);
			}
		};

		load();
		const timer = window.setInterval(() => {
			if (document.visibilityState === "visible") load();
		}, 60_000);
		return () => {
			cancelled = true;
			window.clearInterval(timer);
		};
	}, []);

	if (!DISCORD_USER_ID) return null;

	const status = user?.discord_status ?? "offline";
	const label = STATUS_LABEL[status][language] ?? STATUS_LABEL[status].en;
	const activity = user?.activities.find((a) => a.type !== 4);
	const verb =
		activity && ACTIVITY_VERB[activity.type as keyof typeof ACTIVITY_VERB]
			? ACTIVITY_VERB[activity.type as keyof typeof ACTIVITY_VERB][language]
			: null;
	const name = user?.discord_user.global_name || user?.discord_user.username;

	return (
		<aside className="hud-card mt-5 max-w-sm p-4 text-left lg:ml-auto">
			<div className="flex items-center gap-3">
				<span className="relative shrink-0">
					{user ? (
						// eslint-disable-next-line @next/next/no-img-element -- 44px avatar; Discord's CDN already serves WebP/animated GIF at this size
						<img
							src={avatarUrl(user.discord_user)}
							alt=""
							width={44}
							height={44}
							loading="lazy"
							className="h-11 w-11 rounded-full border border-border object-cover"
						/>
					) : (
						<span className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-secondary text-muted-foreground">
							<Icon className="h-5 w-5" />
						</span>
					)}
					{user && (
						<span
							className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card ${STATUS_COLOR[status]}`}
							aria-hidden="true"
						/>
					)}
				</span>

				<div className="min-w-0 flex-1">
					<p className="truncate text-sm font-semibold">{name ?? "Discord"}</p>
					<p className="truncate font-mono text-[11px] text-muted-foreground">
						{failed && !user ? "discord" : label}
						{verb && activity ? ` · ${verb} ${activity.name}` : ""}
					</p>
				</div>

				<a
					href={DISCORD_PROFILE_URL}
					target="_blank"
					rel="noopener noreferrer"
					aria-label="Discord profile"
					className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border/70 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
				>
					<Icon className="h-4 w-4" />
				</a>
			</div>
		</aside>
	);
}

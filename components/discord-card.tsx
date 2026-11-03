"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
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

const OPEN_LABEL = {
	en: "Say hi",
	th: "ทักมาได้",
	ja: "話しかける",
	zh: "打个招呼",
} as const;

const LISTENING_LABEL = {
	en: "Listening to Spotify",
	th: "กำลังฟัง Spotify",
	ja: "Spotify を再生中",
	zh: "正在听 Spotify",
} as const;

interface Presence {
	id: string;
	name: string;
	username: string;
	avatar: string | null;
	decoration: string | null;
	status: "online" | "idle" | "dnd" | "offline";
	spotify: {
		song: string;
		artist: string;
		albumArt: string | null;
		start: number | null;
		end: number | null;
	} | null;
	activities: Array<{ type: number; name: string; details: string | null }>;
}

function avatarUrl(presence: Presence) {
	if (presence.avatar) {
		// Same-origin proxy: Discord's CDN sets a Cloudflare cookie.
		return `/api/discord/avatar?kind=avatar&id=${presence.avatar}`;
	}
	// Default avatars are indexed by (id >> 22) % 6.
	const index = Number(BigInt(presence.id) >> 22n) % 6;
	return `https://cdn.discordapp.com/embed/avatars/${index}.png`;
}

function formatTime(ms: number) {
	const total = Math.max(0, Math.floor(ms / 1000));
	return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

function DiscordIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
			<path d="M20.32 4.37a19.8 19.8 0 0 0-4.93-1.51 13.8 13.8 0 0 0-.64 1.28 18.3 18.3 0 0 0-5.5 0 13.8 13.8 0 0 0-.64-1.28 19.7 19.7 0 0 0-4.93 1.51C.53 9.05-.32 13.6.1 18.09a19.9 19.9 0 0 0 6.06 3.05c.49-.66.92-1.36 1.29-2.1a12.9 12.9 0 0 1-2.03-.97c.17-.12.34-.25.5-.38a14.2 14.2 0 0 0 12.16 0c.16.13.33.26.5.38-.65.38-1.33.7-2.03.97.37.74.8 1.44 1.29 2.1a19.8 19.8 0 0 0 6.06-3.05c.5-5.2-.86-9.7-3.58-13.72ZM8.02 15.6c-1.18 0-2.15-1.08-2.15-2.4 0-1.32.95-2.4 2.15-2.4 1.2 0 2.17 1.09 2.15 2.4 0 1.32-.95 2.4-2.15 2.4Zm7.96 0c-1.18 0-2.15-1.08-2.15-2.4 0-1.32.95-2.4 2.15-2.4 1.2 0 2.17 1.09 2.15 2.4 0 1.32-.95 2.4-2.15 2.4Z" />
		</svg>
	);
}

function SpotifyIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
			<path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.6 14.4a.8.8 0 0 1-1.1.3c-3-1.8-6.7-2.2-11.1-1.2a.8.8 0 0 1-.4-1.5c4.8-1.1 9-.6 12.3 1.4.4.2.5.6.3 1Zm1.2-2.7a1 1 0 0 1-1.4.3c-3.4-2.1-8.6-2.7-12.6-1.5a1 1 0 1 1-.6-1.9c4.6-1.4 10.3-.7 14.2 1.7.5.3.6.9.4 1.4Zm.1-2.8C14 8.5 7.7 8.3 3.8 9.5a1.2 1.2 0 1 1-.7-2.3C7.5 5.8 14.5 6 18.6 8.4a1.2 1.2 0 0 1-1.2 2.1Z" />
		</svg>
	);
}

/**
 * Discord presence card for the hero: banner, avatar (with decoration), name,
 * live status, Spotify mini-player and current game activity.
 *
 * Reads `/api/discord` (same-origin proxy, no third-party cookie) once a minute
 * while the tab is visible; falls back to a plain profile card.
 */
export function DiscordCard() {
	const { language } = useLanguage();
	const [presence, setPresence] = useState<Presence | null>(null);
	const [failed, setFailed] = useState(false);
	const [now, setNow] = useState(() => Date.now());

	useEffect(() => {
		if (!DISCORD_USER_ID) return;
		let cancelled = false;
		let retry = 0;

		const load = async () => {
			try {
				const res = await fetch("/api/discord", { cache: "no-store" });
				if (!res.ok) throw new Error(String(res.status));
				const json = (await res.json()) as Presence;
				if (!cancelled && json?.id) {
					setPresence(json);
					setFailed(false);
				}
			} catch {
				if (cancelled) return;
				setFailed(true);
				// One quick retry: the first call can lose a race with a cold
				// server render, and waiting a full minute would show a dead card.
				retry = window.setTimeout(load, 4_000);
			}
		};

		load();
		const timer = window.setInterval(() => {
			if (document.visibilityState === "visible") load();
		}, 60_000);
		return () => {
			cancelled = true;
			window.clearTimeout(retry);
			window.clearInterval(timer);
		};
	}, []);

	// Track progress only while a Spotify track is playing.
	const hasSpotify = Boolean(presence?.spotify?.start && presence.spotify.end);
	useEffect(() => {
		if (!hasSpotify) return;
		const timer = window.setInterval(() => setNow(Date.now()), 1_000);
		return () => window.clearInterval(timer);
	}, [hasSpotify]);

	if (!DISCORD_USER_ID) return null;

	const status = presence?.status ?? "offline";
	const label = presence
		? (STATUS_LABEL[status][language] ?? STATUS_LABEL[status].en)
		: failed
			? "discord"
			: "…";
	const statusDot = presence ? STATUS_COLOR[status] : "bg-muted-foreground";
	const spotify = presence?.spotify;
	const game = presence?.activities.find((a) => a.type !== 4);

	const progress =
		spotify?.start && spotify.end
			? Math.min(1, Math.max(0, (now - spotify.start) / (spotify.end - spotify.start)))
			: 0;
	const elapsed = spotify?.start ? formatTime(Math.min(now, spotify.end ?? now) - spotify.start) : "0:00";
	const total = spotify?.start && spotify.end ? formatTime(spotify.end - spotify.start) : "0:00";

	return (
		<aside className="hud-card group animate-fade-in-up stagger-3 relative w-full max-w-md overflow-hidden p-0 text-left">
			{/* Banner: layered brand glow instead of a Discord banner image */}
			<div className="relative h-20 w-full overflow-hidden bg-secondary/60">
				<div
					aria-hidden="true"
					className="absolute -left-10 -top-16 h-40 w-40 rounded-full bg-primary/35 blur-2xl"
				/>
				<div
					aria-hidden="true"
					className="absolute -right-8 -top-10 h-36 w-36 rounded-full bg-accent/35 blur-2xl"
				/>
				<div
					aria-hidden="true"
					className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle,color-mix(in_srgb,var(--foreground)_18%,transparent)_1px,transparent_1.4px)] [background-size:14px_14px]"
				/>
			</div>

			<div className="px-4 pb-4">
				<div className="-mt-7 flex items-end justify-between gap-2">
					<span className="relative block h-16 w-16 shrink-0">
						{presence ? (
							<Image
								src={avatarUrl(presence)}
								alt=""
								width={64}
								height={64}
								sizes="64px"
								loading="lazy"
								unoptimized={Boolean(presence.avatar)}
								className="h-16 w-16 rounded-full border-2 border-card object-cover"
							/>
						) : (
							<span className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-card bg-secondary text-muted-foreground">
								<DiscordIcon className="h-6 w-6" />
							</span>
						)}
						{presence?.decoration && (
							<Image
								src={`/api/discord/avatar?kind=decoration&id=${presence.decoration}`}
								alt=""
								width={88}
								height={88}
								sizes="88px"
								loading="lazy"
								unoptimized
								className="pointer-events-none absolute left-1/2 top-1/2 h-[88px] w-[88px] max-w-none -translate-x-1/2 -translate-y-1/2"
							/>
						)}
						<span
							className={`absolute -bottom-0.5 right-1 h-4 w-4 rounded-full border-2 border-card ${statusDot}`}
							aria-hidden="true"
						/>
					</span>

					<a
						href={DISCORD_PROFILE_URL}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={`${OPEN_LABEL[language]} — Discord`}
						className="mb-1 inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border/70 bg-card/70 px-3 py-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
					>
						<DiscordIcon className="h-3.5 w-3.5" />
						<span className="hidden sm:inline">{OPEN_LABEL[language]}</span>
						<ArrowUpRight className="h-3 w-3" />
					</a>
				</div>

				<div className="mt-2.5">
					<p className="truncate font-display text-base font-semibold text-foreground">
						{presence?.name ?? "Discord"}
					</p>
					<p className="mt-0.5 truncate font-mono text-[11px] text-muted-foreground">
						{presence?.username ? `@${presence.username}` : "discord"}
						<span className="mx-1.5 text-border">·</span>
						<span className="inline-flex items-center gap-1.5 align-middle">
							<span
								className={`h-1.5 w-1.5 rounded-full ${STATUS_COLOR[status]}`}
								aria-hidden="true"
							/>
							{label}
						</span>
					</p>
				</div>

				{spotify && (
					<div className="mt-3 rounded-xl border border-border/60 bg-secondary/40 p-3">
						<div className="flex items-center gap-3">
							{spotify.albumArt ? (
								<Image
									src={spotify.albumArt}
									alt=""
									width={44}
									height={44}
									sizes="44px"
									loading="lazy"
									className="h-11 w-11 shrink-0 rounded-md object-cover"
								/>
							) : (
								<span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-secondary">
									<SpotifyIcon className="h-5 w-5 text-primary" />
								</span>
							)}
							<div className="min-w-0 flex-1">
								<p className="truncate text-xs font-semibold text-foreground">
									{spotify.song}
								</p>
								<p className="truncate text-[11px] text-muted-foreground">
									{spotify.artist}
								</p>
							</div>
							<SpotifyIcon className="h-4 w-4 shrink-0 text-primary" />
						</div>

						<div className="mt-2.5 h-1 w-full overflow-hidden rounded-full bg-border/70">
							<div
								className="h-full rounded-full bg-primary transition-[width] duration-1000 ease-linear"
								style={{ width: `${Math.round(progress * 100)}%` }}
							/>
						</div>
						<div className="mt-1 flex items-center justify-between font-mono text-[10px] text-muted-foreground">
							<span>{elapsed}</span>
							<span className="sr-only">{LISTENING_LABEL[language]}</span>
							<span>{total}</span>
						</div>
					</div>
				)}

				{!spotify && game && (
					<p className="mt-3 truncate font-mono text-[11px] text-muted-foreground">
						{game.details ? `${game.details} · ` : ""}
						{game.name}
					</p>
				)}
			</div>
		</aside>
	);
}

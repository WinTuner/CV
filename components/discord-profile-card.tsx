"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useIsMounted } from "@/lib/use-is-mounted";
import { cn } from "@/lib/utils";
import { Music, Code, Gamepad2, Info } from "lucide-react";
import { DISCORD_ID } from "./discord-status";
import {
	fetchDiscordPresence,
	type DiscordPresenceResult,
	type LanyardPresence,
} from "@/lib/lanyard";

const POLL_INTERVAL_MS = 45_000;

const statusColors = {
	online: "bg-emerald-500",
	idle: "bg-amber-500",
	dnd: "bg-rose-500",
	offline: "bg-zinc-500",
} as const;

const statusLabels = {
	online: "Online",
	idle: "Idle",
	dnd: "Do Not Disturb",
	offline: "Offline",
} as const;

function fallbackPresence(): LanyardPresence {
	return {
		discord_status: "offline",
		discord_user: {
			username: "wintuner",
			global_name: "Thanatphong Tarin",
			avatar: "",
			id: DISCORD_ID,
		},
		activities: [],
		listening_to_spotify: false,
	};
}

export function DiscordProfileCard() {
	const [result, setResult] = useState<DiscordPresenceResult | null>(null);
	const [loading, setLoading] = useState(true);
	const mounted = useIsMounted();
	const abortRef = useRef<AbortController | null>(null);

	useEffect(() => {
		let active = true;

		const poll = async () => {
			abortRef.current?.abort();
			const controller = new AbortController();
			abortRef.current = controller;
			try {
				const next = await fetchDiscordPresence(DISCORD_ID, controller.signal);
				if (active) {
					setResult(next);
					setLoading(false);
				}
			} catch (error) {
				// AbortError on unmount or between polls — ignore
				if (error instanceof DOMException && error.name === "AbortError") {
					return;
				}
				if (active) {
					setResult({ status: "error", message: "Presence fetch failed" });
					setLoading(false);
				}
			}
		};

		poll();
		const interval = setInterval(poll, POLL_INTERVAL_MS);

		return () => {
			active = false;
			clearInterval(interval);
			abortRef.current?.abort();
		};
	}, []);

	if (!mounted || loading) {
		return (
			<div className="w-full max-w-lg rounded-xl border border-border/50 bg-zinc-950/20 glass p-5 flex items-center justify-center h-48 font-mono text-xs text-muted-foreground animate-pulse">
				<span>loading Discord profile presence...</span>
			</div>
		);
	}

	const presence =
		result?.status === "ok" ? result.presence : fallbackPresence();
	const data = presence;
	const status = data.discord_status;
	const colorClass = statusColors[status] || "bg-zinc-500";

	// Find current active game/coding activity (excluding Spotify, type 2)
	const activeActivity = data.activities?.find((act) => act.type !== 2);

	return (
		<div className="w-full max-w-lg overflow-hidden rounded-xl border border-border bg-zinc-950/40 backdrop-blur-md shadow-xl hover:border-primary/20 transition-all duration-300 animate-fade-in-up stagger-5">
			{/* Discord Card Banner */}
			<div className="h-16 w-full bg-gradient-to-r from-primary/30 to-purple-600/30 relative border-b border-border/10">
				<span className="absolute top-3 right-4 font-mono text-[8px] uppercase tracking-widest text-primary/80 font-bold px-2 py-0.5 rounded border border-primary/20 bg-primary/5">
					Discord Live Presence
				</span>
			</div>

			<div className="px-5 pb-5 relative">
				{/* Avatar Profile */}
				<div className="absolute -top-9 left-5 h-16 w-16 rounded-full border-4 border-zinc-950 bg-zinc-900 overflow-hidden shadow-lg select-none">
					{data.discord_user.avatar ? (
						<Image
							src={`https://cdn.discordapp.com/avatars/${data.discord_user.id}/${data.discord_user.avatar}.png?size=128`}
							alt={data.discord_user.username}
							fill
							sizes="64px"
							className="h-full w-full object-cover"
						/>
					) : (
						<div className="h-full w-full bg-primary/20 text-primary flex items-center justify-center font-bold text-lg uppercase">
							{data.discord_user.username.slice(0, 2)}
						</div>
					)}
					{/* Status Indicator */}
					<span
						className={cn(
							"absolute bottom-0 right-0 h-4 w-4 rounded-full border-4 border-zinc-950",
							colorClass,
						)}
					/>
				</div>

				{/* User identification */}
				<div className="pt-9 flex items-start justify-between">
					<div>
						<h4 className="text-sm font-bold text-foreground leading-tight flex items-center gap-1.5">
							{data.discord_user.global_name || data.discord_user.username}
						</h4>
						<p className="text-[10px] text-muted-foreground">
							@{data.discord_user.username}
						</p>
					</div>
					<div className="text-right">
						<span className="inline-flex items-center gap-1 font-mono text-[9px] text-muted-foreground bg-secondary/20 px-2 py-0.5 rounded border border-border/30">
							<span
								className={cn(
									"h-1.5 w-1.5 rounded-full",
									result?.status === "ok"
										? colorClass
										: "bg-zinc-600 animate-pulse",
								)}
							/>
							{result?.status === "ok" ? statusLabels[status] : "—"}
						</span>
					</div>
				</div>

				{/* Live Spotify section */}
				{data.listening_to_spotify && data.spotify && (
					<div className="mt-4 pt-3.5 border-t border-border/20 flex gap-3 animate-fade-in select-text">
						<div className="relative h-12 w-12 shrink-0 rounded overflow-hidden border border-border bg-secondary shadow-sm">
							<Image
								src={data.spotify.album_art_url}
								alt={data.spotify.album}
								fill
								sizes="48px"
								className="h-full w-full object-cover"
							/>
							<div className="absolute inset-0 bg-black/20 flex items-center justify-center">
								<Music className="h-4 w-4 text-white/80 animate-pulse" />
							</div>
						</div>
						<div className="min-w-0 flex-1 space-y-0.5 text-xs">
							<div className="flex items-center gap-1">
								<span className="text-[9px] uppercase tracking-wider text-[#1DB954] font-bold">
									Listening to Spotify
								</span>
							</div>
							<a
								href={`https://open.spotify.com/track/${data.spotify.track_id}`}
								target="_blank"
								rel="noopener noreferrer"
								className="block font-bold text-foreground hover:underline truncate"
							>
								{data.spotify.song}
							</a>
							<p className="text-[10px] text-muted-foreground truncate">
								by {data.spotify.artist}
							</p>
						</div>
					</div>
				)}

				{/* Live VS Code or Games activity section */}
				{!data.listening_to_spotify && activeActivity && (
					<div className="mt-4 pt-3.5 border-t border-border/20 flex gap-3 animate-fade-in select-text">
						<div className="relative h-12 w-12 shrink-0 rounded bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-sm">
							{activeActivity.name === "Visual Studio Code" ? (
								<Code className="h-5 w-5" />
							) : (
								<Gamepad2 className="h-5 w-5" />
							)}
						</div>
						<div className="min-w-0 flex-1 space-y-0.5 text-xs">
							<span className="text-[9px] uppercase tracking-wider text-primary font-bold">
								{activeActivity.name === "Visual Studio Code"
									? "💻 Code Workspace"
									: "🎮 Playing Game"}
							</span>
							<p className="font-bold text-foreground truncate">
								{activeActivity.name}
							</p>
							{activeActivity.details && (
								<p className="text-[10px] text-muted-foreground truncate">
									{activeActivity.details}
								</p>
							)}
							{activeActivity.state && (
								<p className="text-[10px] text-muted-foreground/75 truncate italic">
									&quot;{activeActivity.state}&quot;
								</p>
							)}
						</div>
					</div>
				)}

				{/* Not monitored by Lanyard */}
				{result?.status === "not-monitored" && (
					<div className="mt-4 pt-3 border-t border-border/20 flex items-start gap-2 text-[10px] text-muted-foreground">
						<Info className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
						<p>
							Live presence needs Lanyard monitoring. Join the{" "}
							<a
								href="https://discord.gg/WwBvqKjSne"
								target="_blank"
								rel="noopener noreferrer"
								className="text-primary underline underline-offset-2 hover:text-primary/80"
							>
								Lanyard Discord server
							</a>{" "}
							with this account to enable it.
						</p>
					</div>
				)}

				{/* Presence API error */}
				{result?.status === "error" && (
					<div className="mt-4 pt-3 border-t border-border/20 flex items-start gap-2 text-[10px] text-muted-foreground">
						<Info className="h-3.5 w-3.5 text-rose-400 shrink-0 mt-0.5" />
						<p>
							Presence service unreachable ({result.message}). Showing offline
							profile.
						</p>
					</div>
				)}

				{/* Genuinely offline and idle */}
				{result?.status === "ok" &&
					status === "offline" &&
					!activeActivity &&
					!data.listening_to_spotify && (
						<div className="mt-4 pt-3 border-t border-border/20 flex items-center gap-2 text-[10px] text-muted-foreground">
							<Info className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
							<p>User is currently offline. Reach out via email or LinkedIn.</p>
						</div>
					)}
			</div>
		</div>
	);
}

"use client";

import Link from "next/link";
import { Suspense, memo } from "react";
import { useLanguage } from "./language-provider";
import { heroCopy } from "@/lib/hero-utils";
import type { ActivityItem } from "@/lib/github";
import dynamic from "next/dynamic";
import { HeroTypewriter } from "./hero/hero-typewriter";
import { TerminalWidget } from "./hero/terminal-widget";
import { HeroPortrait } from "./hero/hero-portrait";

const DiscordProfileCard = dynamic(
	() => import("./discord-profile-card").then((m) => m.DiscordProfileCard),
	{
		ssr: false,
	},
);

export interface HeroSectionProps {
	recentActivities?: ActivityItem[];
}

const MemoizedTerminal = memo(TerminalWidget);
const MemoizedDiscord = memo(DiscordProfileCard);

export function HeroSection({ recentActivities = [] }: HeroSectionProps) {
	const { language } = useLanguage();

	const t = heroCopy[language];

	return (
		<section className="relative px-4 sm:px-6 pt-28 sm:pt-36 pb-16 sm:pb-24">
			<div className="mx-auto max-w-7xl">
				<div className="grid gap-12 lg:grid-cols-2 lg:gap-20 lg:items-center lg:min-h-[70vh]">
					{/* Left column - Text */}
					<div className="space-y-8 sm:space-y-10">
						<div className="space-y-3 animate-fade-in-up">
							<p className="font-mono text-xs uppercase tracking-[0.25em] sm:tracking-[0.35em] text-primary">
								{t.kicker}
							</p>
							<h1 className="text-4xl font-bold tracking-tight sm:text-4xl lg:text-5xl xl:text-6xl text-balance">
								Forging digital
								<br />
								<HeroTypewriter />
							</h1>
						</div>

						<p className="max-w-lg text-base sm:text-lg leading-relaxed text-muted-foreground animate-fade-in-up stagger-2">
							{t.intro}
						</p>

						<div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up stagger-3">
							<a
								href="#projects"
								className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-lg border border-primary bg-primary/10 px-7 py-4 sm:py-3.5 font-mono text-sm text-primary transition-all duration-500 hover:bg-primary hover:text-primary-foreground active:scale-[0.98]"
							>
								<span className="relative z-10">{t.explore}</span>
								<span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
									→
								</span>
								{/* Animated background */}
								<span className="absolute inset-0 -translate-x-full bg-primary transition-transform duration-500 group-hover:translate-x-0" />
							</a>
							<Link
								href="/introduction"
								className="group inline-flex items-center justify-center gap-3 rounded-lg border border-border px-7 py-4 sm:py-3.5 font-mono text-sm text-muted-foreground transition-all duration-300 hover:border-foreground hover:text-foreground hover:bg-secondary/50 active:scale-[0.98]"
							>
								<span>{t.resume}</span>
								<span className="opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
									→
								</span>
							</Link>
						</div>

						{/* Minimal Custom Linux Terminal Widget */}
						<MemoizedTerminal recentActivities={recentActivities} />

						{/* Discord Profile Card */}
						<div className="w-full max-w-lg">
							<Suspense
								fallback={
									<div className="w-full max-w-lg rounded-xl border border-border/50 bg-zinc-950/20 glass p-5 flex items-center justify-center h-48 font-mono text-xs text-muted-foreground animate-pulse">
										<span>
											{language === "th"
												? "กำลังโหลดสถานะ Discord..."
												: "loading Discord profile presence..."}
										</span>
									</div>
								}
							>
								<MemoizedDiscord />
							</Suspense>
						</div>
					</div>

					{/* Right column - Visual / Portrait */}
					<HeroPortrait />
				</div>
			</div>

			<div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 animate-fade-in stagger-6">
				<span className="font-mono text-xs text-muted-foreground animate-bounce-soft">
					{t.scroll}
				</span>
				<div className="w-px h-12 bg-gradient-to-b from-primary/50 to-transparent animate-pulse" />
			</div>
		</section>
	);
}

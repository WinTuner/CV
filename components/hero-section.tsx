"use client";

import Link from "next/link";
import { ArrowRight, MapPin, Mail } from "lucide-react";
import { useLanguage } from "./language-provider";
import { heroCopy } from "@/lib/hero-utils";
import { HeroTypewriter } from "./hero/hero-typewriter";
import { HeroPortrait } from "./hero/hero-portrait";
import { CopyEmailButton } from "./copy-email-button";

export function HeroSection() {
	const { language } = useLanguage();

	const t = heroCopy[language];

	return (
		<section id="hero" className="relative">
			<div className="relative flex min-h-[calc(100svh-3rem)] flex-col">
				<div className="pointer-events-none relative z-0 mx-auto flex w-full max-w-[1280px] flex-1 flex-col items-center justify-center px-4 sm:px-6 py-16 sm:py-20">
					{/* Giant watermark backdrop (ArtCraft-style), masked + blurred */}
					<div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-start justify-center overflow-hidden pt-10">
						<div className="relative w-full max-w-5xl" style={{ containerType: "inline-size" }}>
							<div
								aria-hidden="true"
								className="absolute -inset-x-[6%] -inset-y-[34%]"
								style={{
									backdropFilter: "blur(12px)",
									WebkitBackdropFilter: "blur(12px)",
									maskImage: "radial-gradient(closest-side, black 45%, transparent 100%)",
									WebkitMaskImage: "radial-gradient(closest-side, black 45%, transparent 100%)",
								}}
							/>
							<p className="watermark-display relative text-center text-foreground/[0.07] dark:text-foreground/[0.09] select-none whitespace-nowrap text-[13.5cqw]">
								WINTUNER
							</p>
						</div>
					</div>
					<div className="relative z-10 grid gap-14 lg:grid-cols-12 lg:gap-12 lg:items-center w-full">
					{/* Left column — display text */}
					<div className="lg:col-span-7 space-y-7 sm:space-y-8 text-center lg:text-left flex flex-col items-center lg:items-start">
						<div className="space-y-4 animate-fade-in-up">
							<p className="hud-label text-muted-foreground">
								{t.kicker}
							</p>
							<h1 className="font-display text-[2.7rem] font-medium leading-[1.05] tracking-[-0.03em] sm:text-6xl lg:text-7xl text-ink-strong">
								Forging digital
								<br />
								<span className="serif-accent">
									<HeroTypewriter />
								</span>
							</h1>
						</div>

						<p className="max-w-xl text-base sm:text-lg leading-relaxed text-muted-foreground animate-fade-in-up stagger-2">
							{t.intro}
						</p>

						<div className="flex flex-col sm:flex-row items-center gap-3 animate-fade-in-up stagger-3 w-full sm:w-auto">
						<a
							href="#projects"
							className="btn-hud group w-full sm:w-auto"
						>
								{t.explore}
								<ArrowRight className="arrow-spring h-4 w-4" />
							</a>
							<Link
								href="/introduction"
								className="btn-hud-outline group w-full sm:w-auto"
							>
								{t.resume}
								<ArrowRight className="arrow-spring h-4 w-4" />
							</Link>
						</div>

						<div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 pt-2 animate-fade-in-up stagger-4">
							<span className="hud-label inline-flex items-center gap-1.5 text-faint">
								<MapPin className="h-3.5 w-3.5" />
								{t.location}
							</span>
						<a
							href={`mailto:${t.email}`}
							className="hud-label inline-flex items-center gap-1.5 text-faint hover:text-foreground"
						>
							<Mail className="h-3.5 w-3.5" />
							{t.email}
						</a>
						<CopyEmailButton
							email={t.email}
							copyLabel={t.copyEmail}
							copiedLabel={t.emailCopied}
							iconClassName="h-3.5 w-3.5"
							className="h-6 w-6"
						/>
						</div>
					</div>

					{/* Right column — portrait */}
					<div className="lg:col-span-5">
						<HeroPortrait />
					</div>
					</div>
				</div>
			</div>
		</section>
	);
}

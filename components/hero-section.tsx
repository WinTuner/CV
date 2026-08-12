"use client";

import Link from "next/link";
import { ArrowRight, MapPin, Mail } from "lucide-react";
import { useLanguage } from "./language-provider";
import { heroCopy } from "@/lib/hero-utils";
import { HeroTypewriter } from "./hero/hero-typewriter";
import { HeroPortrait } from "./hero/hero-portrait";

export function HeroSection() {
	const { language } = useLanguage();

	const t = heroCopy[language];

	return (
		<section className="relative px-4 sm:px-6 pt-32 sm:pt-40 pb-16 sm:pb-24">
			{/* Soft ice-blue glow accents (decorative) */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute -top-40 right-[-10%] h-[28rem] w-[28rem] rounded-full bg-primary/10 blur-[120px]"
			/>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute -bottom-32 left-[-8%] h-[24rem] w-[24rem] rounded-full bg-chart-2/10 blur-[110px]"
			/>
			<div className="mx-auto max-w-7xl">
				<div className="grid gap-14 lg:grid-cols-12 lg:gap-12 lg:items-center">
					{/* Left column — editorial text */}
					<div className="lg:col-span-7 space-y-7 sm:space-y-8">
						<div className="space-y-4 animate-fade-in-up">
							<p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
								{t.kicker}
							</p>
							<h1 className="font-serif text-5xl font-medium leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl text-balance">
								Forging digital
								<br />
								<HeroTypewriter />
							</h1>
						</div>

						<p className="max-w-xl text-base sm:text-lg leading-relaxed text-muted-foreground animate-fade-in-up stagger-2">
							{t.intro}
						</p>

						<div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 animate-fade-in-up stagger-3">
							<a
								href="#projects"
								className="group inline-flex items-center gap-2.5 border border-chart-2/60 bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-[4px_4px_0_var(--chart-2)] ring-1 ring-inset ring-primary-foreground/20 transition-all duration-300 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-[6px_6px_0_var(--chart-2)]"
							>
								{t.explore}
								<ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
							</a>
							<Link
								href="/introduction"
								className="group inline-flex items-center gap-2 border border-primary/60 px-7 py-3.5 text-sm font-medium text-primary transition-all duration-300 hover:border-primary hover:bg-primary/10"
							>
								{t.resume}
								<ArrowRight className="h-4 w-4 transition-all duration-300 group-hover:translate-x-1" />
							</Link>
						</div>

						<div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 font-mono text-xs text-muted-foreground animate-fade-in-up stagger-4">
							<span className="inline-flex items-center gap-1.5">
								<MapPin className="h-3.5 w-3.5 text-primary" />
								{t.location}
							</span>
						<a
							href={`mailto:${t.email}`}
							className="underline-animate inline-flex items-center gap-1.5 transition-colors hover:text-primary"
						>
							<Mail className="h-3.5 w-3.5 text-primary" />
							{t.email}
						</a>
						</div>
					</div>

					{/* Right column — portrait */}
					<div className="lg:col-span-5">
						<HeroPortrait />
					</div>
				</div>
			</div>
		</section>
	);
}

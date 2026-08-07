"use client";

import Image from "next/image";
import { useState } from "react";
import { useLanguage } from "../language-provider";
import { heroCopy } from "@/lib/hero-utils";

export function HeroPortrait() {
	const { language } = useLanguage();
	const [portraitSrc, setPortraitSrc] = useState("/developer-portrait-v3.webp");
	const t = heroCopy[language];

	return (
		<div className="relative animate-scale-in stagger-4">
			{/* Rotating decorative rings */}
			<div
				aria-hidden="true"
				className="absolute -inset-5 rounded-[2rem] border border-dashed border-primary/20 animate-spin-slower"
			/>
			<div
				aria-hidden="true"
				className="absolute -inset-10 rounded-[3rem] border border-primary/5 animate-spin-slow"
			/>
			{/* Orbiting accent dot */}
			<div
				aria-hidden="true"
				className="absolute -inset-10 animate-spin-slow pointer-events-none"
			>
				<div className="absolute -top-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-accent shadow-lg shadow-accent/40" />
			</div>

			<div className="relative overflow-hidden rounded-2xl border border-border bg-card/60 glass p-1 hover-lift shadow-2xl shadow-primary/10">
				{/* Terminal header */}
				<div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-background/40 backdrop-blur-md">
					<div className="flex items-center gap-2">
						<div className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
						<div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
						<div className="h-2.5 w-2.5 rounded-full bg-primary/60" />
					</div>
					<div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/70">
						identity_protocol.v0
					</div>
					<div className="w-10" /> {/* Spacer */}
				</div>

				{/* Image Container */}
				<div className="relative aspect-[3/4] overflow-hidden group">
					<Image
						src={portraitSrc}
						alt="Developer Portrait"
						fill
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[0.2] contrast-[1.1]"
						onError={() => {
							setPortraitSrc(
								"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
							);
						}}
						priority
					/>

					{/* Scanline overlay */}
					<div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%]" />

					{/* Periodic sheen sweep */}
					<span className="pointer-events-none absolute inset-y-0 left-0 w-2/5 animate-shine bg-gradient-to-r from-transparent via-primary/15 to-transparent" />

					{/* Vignette */}
					<div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle,transparent_40%,rgba(0,0,0,0.4)_100%)]" />

					{/* Status Overlay */}
					<div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-lg border border-white/10 bg-black/40 backdrop-blur-md p-3">
						<div className="flex items-center gap-3">
							<div className="relative h-2 w-2">
								<div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-75" />
								<div className="relative h-2 w-2 rounded-full bg-primary" />
							</div>
							<div className="flex flex-col">
								<span className="font-mono text-[10px] uppercase text-white/90 leading-none mb-1">
									Status
								</span>
								<span className="font-mono text-[12px] text-primary font-bold leading-none">
									{t.status.split(": ")[1]}
								</span>
							</div>
						</div>
						<div className="h-8 w-px bg-white/10" />
						<div className="flex flex-col items-end">
							<span className="font-mono text-[10px] uppercase text-white/90 leading-none mb-1">
								Uptime
							</span>
							<span className="font-mono text-[12px] text-white/70 font-bold leading-none">
								99.9%
							</span>
						</div>
					</div>
				</div>

				{/* Data footer */}
				<div className="px-4 py-4 grid grid-cols-2 gap-4 border-t border-border/50 bg-background/20">
					<div className="space-y-1">
						<p className="font-mono text-[9px] uppercase text-muted-foreground">
							Coordinates
						</p>
						<a
							href="https://www.google.com/maps/place/Chiang+Mai+University"
							target="_blank"
							rel="noopener noreferrer"
							className="block font-mono text-xs text-foreground hover:text-primary hover:underline transition-colors"
						>
							18.8004° N, 98.9507° E
						</a>
					</div>
					<div className="space-y-1 text-right">
						<p className="font-mono text-[9px] uppercase text-muted-foreground">
							Kernel
						</p>
						<p className="font-mono text-xs text-primary">v16.2.4-stable</p>
					</div>
				</div>
			</div>

			{/* Floating badges */}
			<div className="absolute -right-4 -top-4 rounded-xl border border-primary/30 bg-primary/10 backdrop-blur-xl px-4 py-2 font-mono text-[11px] text-primary animate-float shadow-xl shadow-primary/20">
				<div className="flex items-center gap-2">
					<div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
					<span>AUTHORIZED_USER</span>
				</div>
			</div>

			<div
				className="absolute -bottom-4 -left-4 rounded-xl border border-border bg-card/80 backdrop-blur-xl px-4 py-2 font-mono text-[11px] text-muted-foreground animate-float shadow-xl"
				style={{ animationDelay: "1.5s" }}
			>
				LOC: BANGKOK_TH
			</div>

			{/* Glow background */}
			<div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] rounded-full bg-primary/10 blur-3xl animate-pulse" />
		</div>
	);
}

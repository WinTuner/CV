"use client";

import Image from "next/image";
import { useState } from "react";
import { useLanguage } from "../language-provider";
import { heroCopy } from "@/lib/hero-utils";

export function HeroPortrait() {
	const { language } = useLanguage();
	const [portraitSrc, setPortraitSrc] = useState("/developer-portrait-v3.png");
	const t = heroCopy[language];

	return (
		<figure className="animate-fade-in-up stagger-4">
			<div className="relative overflow-hidden border border-border bg-card">
				<div className="relative aspect-[3/4] overflow-hidden group">
					<Image
						src={portraitSrc}
						alt="Portrait of Thanatphong Tarin"
						fill
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
						className="h-full w-full object-cover grayscale-[0.15] contrast-[1.02] transition-all duration-700 group-hover:scale-[1.03] group-hover:grayscale-0"
						onError={() => {
							setPortraitSrc(
								"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
							);
						}}
						priority
					/>
					{/* Editorial frame accent */}
					<div className="absolute inset-0 border border-white/20 pointer-events-none" />
				</div>
			</div>
			<figcaption className="mt-3 flex items-center justify-between gap-4 font-mono text-xs text-muted-foreground">
				<span className="truncate">{t.kicker}</span>
				<span className="shrink-0 text-primary">{t.location}</span>
			</figcaption>
		</figure>
	);
}

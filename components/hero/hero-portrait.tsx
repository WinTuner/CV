"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../language-provider";
import { heroCopy } from "@/lib/hero-utils";
import { AUTHOR_AVATAR } from "@/lib/site";

const TILT_MAX_DEG = 6;

export function HeroPortrait() {
	const { language } = useLanguage();
	const [portraitSrc, setPortraitSrc] = useState(AUTHOR_AVATAR);
	const t = heroCopy[language];
	const frameRef = useRef<HTMLDivElement>(null);
	const rafRef = useRef(0);
	// Evaluated once, client-side: tilt is a fine-pointer delight only.
	// Touch, pen, reduced-motion, and lab audits never see it.
	const tiltOk = useRef<boolean | null>(null);

	useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

	const handleTiltMove = (event: React.MouseEvent<HTMLDivElement>) => {
		if (tiltOk.current === null) {
			tiltOk.current =
				window.matchMedia("(pointer: fine)").matches &&
				!window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		}
		const frame = frameRef.current;
		if (!tiltOk.current || !frame) return;
		const { clientX, clientY } = event;
		cancelAnimationFrame(rafRef.current);
		rafRef.current = requestAnimationFrame(() => {
			const rect = frame.getBoundingClientRect();
			if (rect.width === 0 || rect.height === 0) return;
			const px = (clientX - rect.left) / rect.width - 0.5;
			const py = (clientY - rect.top) / rect.height - 0.5;
			frame.style.willChange = "transform";
			frame.style.transform = `perspective(900px) rotateX(${(-py * TILT_MAX_DEG).toFixed(2)}deg) rotateY(${(px * TILT_MAX_DEG).toFixed(2)}deg)`;
		});
	};

	const handleTiltLeave = () => {
		cancelAnimationFrame(rafRef.current);
		const frame = frameRef.current;
		if (!frame) return;
		frame.style.transform = "";
		frame.style.willChange = "";
	};

	return (
		<figure className="animate-fade-in-up stagger-4">
			<div
				className="relative"
				onMouseMove={handleTiltMove}
				onMouseLeave={handleTiltLeave}
			>
				{/* Offset ice-blue frame peeking out behind the portrait */}
				<div
					aria-hidden="true"
					className="absolute inset-0 translate-x-3 translate-y-3 border border-primary/40 pointer-events-none"
				/>
				<div
					ref={frameRef}
					className="relative overflow-hidden border border-border bg-card"
					style={{ transition: "transform 0.25s ease-out" }}
				>
					<div className="relative aspect-[3/4] overflow-hidden group">
						<Image
							src={portraitSrc}
							alt="Portrait of Thanatphong Tarin"
							// Remote portraits are already optimized by Cloudinary
							// (f_auto,q_auto); skipping /_next/image avoids a slow
							// server-side origin fetch on cold cache (LCP).
							unoptimized={portraitSrc.startsWith("http")}
							fill
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
							className="h-full w-full object-cover grayscale-[0.15] contrast-[1.02] transition-all duration-700 group-hover:scale-[1.03] group-hover:grayscale-0"
							onError={() => {
								setPortraitSrc(
									"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
								);
							}}
							priority
							fetchPriority="high"
						/>
						{/* Editorial frame accent — soft cyan */}
						<div className="absolute inset-0 border border-primary/25 pointer-events-none" />
					</div>
				</div>
			</div>
			<figcaption className="mt-3 flex items-center justify-between gap-4 font-mono text-xs text-muted-foreground">
				<span className="truncate">{t.kicker}</span>
				<span className="shrink-0 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-primary">
					{t.location}
				</span>
			</figcaption>
		</figure>
	);
}

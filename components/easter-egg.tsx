"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "./language-provider";
import { cn } from "@/lib/utils";

const KONAMI = [
	"ArrowUp",
	"ArrowUp",
	"ArrowDown",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight",
	"ArrowLeft",
	"ArrowRight",
	"b",
	"a",
];

const PARTY_EVENT = "wintuner:party";

/**
 * Easter eggs:
 *  - Konami code (↑↑↓↓←→←→BA) triggers a matrix-rain "party mode".
 *  - Any code can dispatch `window.dispatchEvent(new Event("wintuner:party"))`
 *    (used by the command palette, terminal `matrix` command and the header logo).
 *
 * The rain renders directly on a canvas via rAF and never touches React state
 * per-frame, so it stays cheap. Respects `prefers-reduced-motion`.
 */
export function EasterEgg() {
	const { language } = useLanguage();
	const [party, setParty] = useState(false);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const sequenceRef = useRef<string[]>([]);
	const timeoutRef = useRef<number | null>(null);

	const trigger = useCallback(() => {
		if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
		setParty(true);
		timeoutRef.current = window.setTimeout(() => setParty(false), 9000);
	}, []);

	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			const key = event.key;
			sequenceRef.current.push(key.length === 1 ? key.toLowerCase() : key);
			if (sequenceRef.current.length > KONAMI.length) {
				sequenceRef.current.shift();
			}
			if (
				sequenceRef.current.length === KONAMI.length &&
				sequenceRef.current.every((value, index) => value === KONAMI[index])
			) {
				sequenceRef.current = [];
				trigger();
			}
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [trigger]);

	useEffect(() => {
		const onParty = () => trigger();
		window.addEventListener(PARTY_EVENT, onParty);
		return () => window.removeEventListener(PARTY_EVENT, onParty);
	}, [trigger]);

	// Matrix rain loop
	useEffect(() => {
		if (!party) return;
		const canvas = canvasRef.current;
		if (!canvas) return;

		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			return;
		}

		const context = canvas.getContext("2d");
		if (!context) return;

		const resize = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};
		resize();

		const columns = Math.floor(window.innerWidth / 18);
		const drops = Array.from({ length: columns }, () =>
			Math.floor(Math.random() * -40),
		);
		const characters =
			"アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789<>/;:*+=[]{}";
		let frame = 0;

		const draw = () => {
			if (!party) return;
			frame = requestAnimationFrame(draw);
			context.fillStyle = "rgba(0, 0, 0, 0.08)";
			context.fillRect(0, 0, canvas.width, canvas.height);
			context.font = "14px monospace";
			for (let i = 0; i < drops.length; i++) {
				const char = characters[Math.floor(Math.random() * characters.length)];
				context.fillStyle = Math.random() > 0.975 ? "#7fc8e0" : "#c8f4ff";
				context.fillText(char, i * 18, drops[i] * 18);
				if (drops[i] * 18 > canvas.height && Math.random() > 0.975) {
					drops[i] = 0;
				}
				drops[i]++;
			}
		};

		draw();
		window.addEventListener("resize", resize);
		return () => {
			cancelAnimationFrame(frame);
			window.removeEventListener("resize", resize);
		};
	}, [party]);

	useEffect(
		() => () => {
			if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
		},
		[],
	);

	return (
		<div
			aria-hidden="true"
			className={cn(
				"pointer-events-none fixed inset-0 z-[95] overflow-hidden transition-opacity duration-700",
				party ? "opacity-100" : "opacity-0",
			)}
		>
			<canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
			{party && (
				<div className="absolute inset-0 flex items-center justify-center">
					<div className="animate-scale-in border border-primary/50 bg-card px-10 py-8 text-center shadow-xl">
						<p className="font-mono text-xs uppercase tracking-[0.35em] text-primary">
							{language === "th" ? "ปลดล็อกความลับ" : "secret unlocked"}
						</p>
						<p className="mt-3 font-serif text-3xl font-medium tracking-tight text-primary">
							{language === "th" ? "โหมดปาร์ตี้!" : "PARTY MODE!"}
						</p>
						<p className="mt-2 font-mono text-xs text-muted-foreground">
							{language === "th"
								? "รับไปเลย 30 ชีวิต 🌟"
								: "30 lives added. Have fun 🕹️"}
						</p>
					</div>
				</div>
			)}
		</div>
	);
}

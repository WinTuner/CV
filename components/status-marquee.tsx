"use client";

import { useLanguage } from "./language-provider";

const commands = {
	en: [
		"npm run dev -- --port 3000",
		"git push origin main",
		"systemctl start muanjai.service",
		"docker compose up -d",
		"neofetch --off",
		"cargo run --release",
		"pnpm test --watch",
		"ssh wintuner@archlinux",
		"curl -I https://wintuner.dev",
		"yay -Syu",
	],
	th: [
		"npm run dev -- --port 3000",
		"git push origin main",
		"systemctl start muanjai.service",
		"docker compose up -d",
		"neofetch --off",
		"cargo run --release",
		"pnpm test --watch",
		"ssh wintuner@archlinux",
		"curl -I https://wintuner.dev",
		"yay -Syu",
	],
} as const;

const SEPARATOR = "✦";

export function StatusMarquee() {
	const { language } = useLanguage();
	const items = commands[language];

	return (
		<div
			aria-hidden="true"
			className="relative select-none overflow-hidden border-y border-border/40 bg-card/30 py-3 backdrop-blur-sm"
		>
			<div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 sm:w-28 bg-gradient-to-r from-background to-transparent" />
			<div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 sm:w-28 bg-gradient-to-l from-background to-transparent" />

			<div className="flex w-max animate-marquee">
				{[0, 1].map((duplicate) => (
					<div
						key={duplicate}
						className="flex shrink-0 items-center gap-8 pr-8 sm:gap-10 sm:pr-10"
					>
						{items.map((cmd) => (
							<span
								key={cmd}
								className="flex items-center gap-3 font-mono text-[11px] sm:text-xs text-muted-foreground whitespace-nowrap"
							>
								<span className="text-primary">❯</span>
								{cmd}
								<span className="text-primary/40">{SEPARATOR}</span>
							</span>
						))}
					</div>
				))}
			</div>
		</div>
	);
}

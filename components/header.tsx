"use client";

import { useRef, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { GithubIcon, LinkedinIcon } from "./social-icons";
import { Gamepad2 } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { LanguageToggle } from "./language-toggle";
import { useLanguage } from "./language-provider";
import Link from "next/link";
import { SOCIAL_LINKS } from "@/lib/site";

const CommandPalette = dynamic(
	() => import("./command-palette").then((m) => m.CommandPalette),
	{ ssr: false },
);

const navItems = [
	{ label: { en: "Home", th: "หน้าแรก", ja: "ホーム", zh: "首页" }, href: "/" },
	{ label: { en: "Resume", th: "เรซูเม่", ja: "履歴書", zh: "简历" }, href: "/introduction" },
	{ label: { en: "Projects", th: "โปรเจกต์", ja: "プロジェクト", zh: "项目" }, href: "/projects" },
	{ label: { en: "Workbench", th: "เวิร์กเบนช์", ja: "ワークベンチ", zh: "工作台" }, href: "/workbench" },
	{ label: { en: "Blog", th: "บล็อก", ja: "ブログ", zh: "博客" }, href: "/blog" },
];

const socialLinks = [
	{ label: "GitHub", href: SOCIAL_LINKS.github, icon: GithubIcon },
	{
		label: "LinkedIn",
		href: SOCIAL_LINKS.linkedin,
		icon: LinkedinIcon,
	},
	{ label: "Gearz", href: SOCIAL_LINKS.gearz, icon: Gamepad2 },
];

export function Header() {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const menuToggleRef = useRef<HTMLButtonElement>(null);
	const firstMenuLinkRef = useRef<HTMLAnchorElement>(null);
	const mobileMenuRef = useRef<HTMLDivElement>(null);
	const logoClicksRef = useRef<{ count: number; last: number }>({ count: 0, last: 0 });
	const pathname = usePathname();
	const { language } = useLanguage();

	const isActive = (href: string) => {
		if (href === "/") return pathname === "/";
		return pathname.startsWith(href);
	};

	useEffect(() => {
		let frame = 0;
		const update = () => {
			frame = 0;
			setIsScrolled(window.scrollY > 20);
		};
		const onScroll = () => {
			if (!frame) frame = requestAnimationFrame(update);
		};
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => {
			if (frame) cancelAnimationFrame(frame);
			window.removeEventListener("scroll", onScroll);
		};
	}, []);

	// Close mobile menu with Escape key + manage focus + trap Tab (a11y)
	useEffect(() => {
		if (!isMobileMenuOpen) {
			// Return focus to the toggle when the menu closes
			if (
				document.activeElement instanceof HTMLElement &&
				(mobileMenuRef.current?.contains(document.activeElement) ||
					document.activeElement.dataset.menuInside === "true")
			) {
				menuToggleRef.current?.focus();
			}
			return;
		}
		// Move focus into the menu when it opens
		firstMenuLinkRef.current?.focus();
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				setIsMobileMenuOpen(false);
				return;
			}
			if (e.key !== "Tab" || !mobileMenuRef.current) return;
			const focusable = mobileMenuRef.current.querySelectorAll<HTMLElement>(
				'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
			);
			if (focusable.length === 0) return;
			const first = focusable[0];
			const last = focusable[focusable.length - 1];
			if (e.shiftKey) {
				if (document.activeElement === first) {
					e.preventDefault();
					last.focus();
				}
			} else {
				if (document.activeElement === last) {
					e.preventDefault();
					first.focus();
				}
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isMobileMenuOpen]);

	const ctaLabel =
		{ en: "Hire me", th: "จ้างงาน", ja: "採用", zh: "聘用" }[language] ?? "Hire me";

	return (
		<header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 print:hidden">
			<div
				className={cn(
					"mx-auto max-w-[1280px] overflow-hidden border border-border/70 bg-card/85 backdrop-blur-lg transition-[border-radius,box-shadow] duration-300 ease-out",
					isMobileMenuOpen ? "rounded-[1.6rem]" : "rounded-full",
					isScrolled
						? "shadow-[0_4px_0_rgba(0,0,0,0.35),0_18px_40px_-20px_rgba(0,0,0,0.65)]"
						: "shadow-[0_4px_0_rgba(0,0,0,0.22)]",
				)}
			>
				<div className="flex h-14 items-center justify-between gap-2 px-2 sm:px-3">
					<Link
						href="/"
						className="flex shrink-0 items-center rounded-full px-2 py-1.5 transition-colors hover:bg-secondary/70 sm:px-3"
						onClick={() => {
							const now = Date.now();
							const clicks = logoClicksRef.current;
							if (now - clicks.last > 1200) clicks.count = 0;
							clicks.count += 1;
							clicks.last = now;
							if (clicks.count >= 7) {
								clicks.count = 0;
								window.dispatchEvent(new Event("wintuner:party"));
							}
						}}
						aria-label="WinTuner — home"
					>
						<span className="font-display text-[15px] font-bold tracking-tight whitespace-nowrap">
							WIN
							<span className="ml-1 rounded-full bg-invert-bg px-2 py-0.5 text-invert-fg">
								TUNER
							</span>
						</span>
					</Link>

					{/* Desktop Navigation */}
					<nav aria-label="Main" className="hidden min-w-0 items-center gap-1 lg:flex">
						{navItems.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								aria-current={isActive(item.href) ? "page" : undefined}
								className={cn(
									"hud-label rounded-full px-3.5 py-2 transition-colors duration-200",
									isActive(item.href)
										? "bg-secondary text-foreground"
										: "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
								)}
							>
								{item.label[language]}
							</Link>
						))}
					</nav>

					<div className="flex shrink-0 items-center gap-1">
						<div className="hidden items-center gap-0.5 md:flex">
							{socialLinks.map((link) => (
								<a
									key={link.label}
									href={link.href}
									target="_blank"
									rel="noopener noreferrer"
									aria-label={link.label}
									title={link.label}
									className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
								>
									<link.icon className="h-4 w-4" />
								</a>
							))}
							<div className="flex items-center px-0.5">
								<CommandPalette />
							</div>
							<div className="flex items-center">
								<LanguageToggle />
								<ThemeToggle />
							</div>
							<Link
								href="/#connect"
								className="ml-1 hidden h-9 items-center justify-center gap-2 rounded-full bg-invert-bg px-4 font-display text-[13px] font-semibold text-invert-fg transition-transform hover:-translate-y-0.5 sm:inline-flex"
							>
								{ctaLabel}
							</Link>
						</div>
						<div className="flex items-center md:hidden">
							<LanguageToggle />
							<ThemeToggle />
						</div>
						<button
							ref={menuToggleRef}
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
							className="flex h-10 w-10 items-center justify-center rounded-full border border-border/70 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground lg:hidden"
							aria-label="Toggle menu"
							aria-expanded={isMobileMenuOpen}
							aria-controls="mobile-menu"
						>
							<div className="flex w-5 flex-col gap-1.5">
								<span
									className={cn(
										"h-0.5 rounded-full bg-current transition-all duration-300 origin-center",
										isMobileMenuOpen ? "w-5 translate-y-1 rotate-45" : "w-5",
									)}
								/>
								<span
									className={cn(
										"h-0.5 rounded-full bg-current transition-all duration-300",
										isMobileMenuOpen && "opacity-0 translate-x-2",
									)}
								/>
								<span
									className={cn(
										"h-0.5 rounded-full bg-current transition-all duration-300 origin-center",
										isMobileMenuOpen ? "w-5 -translate-y-1 -rotate-45" : "w-5",
									)}
								/>
							</div>
						</button>
					</div>
				</div>

				{/* Mobile Menu */}
				<div
					id="mobile-menu"
					className={cn(
						"grid overflow-hidden transition-all duration-300 ease-in-out lg:hidden",
						isMobileMenuOpen
							? "grid-rows-[1fr] opacity-100 border-t border-border/60"
							: "grid-rows-[0fr] opacity-0",
					)}
				>
					<div className="overflow-hidden">
						{/* Safe-area padding lives on the collapsible content (clipped when closed),
							so phones with gesture bars / home indicators never hide the last row. */}
						<div ref={mobileMenuRef} className="flex flex-col gap-1 px-3 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
							{navItems.map((item, index) => (
								<Link
									key={item.href}
									href={item.href}
									onClick={() => setIsMobileMenuOpen(false)}
									ref={index === 0 ? firstMenuLinkRef : undefined}
									data-menu-inside="true"
									className={cn(
										"hud-label flex items-center gap-3 rounded-full px-4 py-3 transition-colors duration-200",
										isActive(item.href)
											? "bg-secondary text-foreground"
											: "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
									)}
								>
									{item.label[language]}
								</Link>
							))}

							<div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border/60 pt-4 px-1">
								<CommandPalette />
								{socialLinks.map((link) => (
									<a
										key={link.label}
										href={link.href}
										target="_blank"
										rel="noopener noreferrer"
										aria-label={link.label}
										className="flex h-10 w-10 items-center justify-center rounded-full border border-border/70 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
									>
										<link.icon className="h-4 w-4" />
									</a>
								))}
								<Link
									href="/#connect"
									onClick={() => setIsMobileMenuOpen(false)}
									className="ml-auto inline-flex h-10 items-center rounded-full bg-invert-bg px-5 font-display text-[13px] font-semibold text-invert-fg"
								>
									{ctaLabel}
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}

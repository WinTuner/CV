"use client";

import { useRef, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { GithubIcon, LinkedinIcon } from "./social-icons";
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
		<header
			className={cn(
				"fixed top-0 left-0 right-0 z-50 w-full border-b border-line transition-[background-color,border-color] duration-300 ease-out",
				isScrolled ? "bg-background/95 backdrop-blur-sm" : "bg-background/95 backdrop-blur-sm",
			)}
		>
			<div className="flex h-12 items-stretch justify-between">
				<div className="flex min-w-0 items-stretch">
					<Link
						href="/"
						className="flex items-center border-r border-line px-4 sm:px-5 hover:opacity-70"
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
						<span className="font-display text-sm font-extrabold tracking-tight whitespace-nowrap">
							WIN<span className="bg-invert-bg text-invert-fg px-1 ml-0.5">TUNER</span>
						</span>
					</Link>

					{/* Desktop Navigation */}
					<nav aria-label="Main" className="hidden min-w-0 items-stretch lg:flex">
						<ul className="flex h-full items-stretch">
							{navItems.map((item) => (
								<li key={item.href} className="flex items-stretch">
									<Link
										href={item.href}
										aria-current={isActive(item.href) ? "page" : undefined}
										className={cn(
											"group flex h-full items-center px-2.5 hud-label",
											isActive(item.href) ? "text-foreground" : "text-muted-foreground hover:text-foreground",
										)}
									>
										<span
											className={cn(
												"flex items-center gap-1.5 px-1.5 py-0.5 group-hover:bg-invert-bg group-hover:text-invert-fg",
												isActive(item.href) && "bg-invert-bg text-invert-fg",
											)}
										>
											{item.label[language]}
										</span>
									</Link>
								</li>
							))}
						</ul>
					</nav>
				</div>

				<div className="flex shrink-0 items-stretch">
					<div className="hidden items-stretch md:flex">
						{socialLinks.map((link) => (
							<a
								key={link.label}
								href={link.href}
								target="_blank"
								rel="noopener noreferrer"
								aria-label={link.label}
								title={link.label}
								className="flex w-12 items-center justify-center border-l border-line text-muted-foreground hover:bg-invert-bg hover:text-invert-fg"
							>
								<link.icon className="h-4 w-4" />
							</a>
						))}
						<div className="flex items-center border-l border-line px-2">
							<CommandPalette />
						</div>
						<div className="flex items-center border-l border-line px-1">
							<LanguageToggle />
							<ThemeToggle />
						</div>
						<Link
							href="/#connect"
							className="hidden items-center justify-center gap-2 bg-invert-bg text-invert-fg hud-label border-l border-line px-5 transition-opacity hover:opacity-80 sm:inline-flex"
						>
							{ctaLabel}
						</Link>
					</div>
					<div className="flex items-stretch md:hidden">
						<div className="flex items-center border-l border-line px-1">
							<LanguageToggle />
							<ThemeToggle />
						</div>
					</div>
					<div className="flex items-stretch lg:hidden">
						<button
							ref={menuToggleRef}
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
							className="flex w-12 items-center justify-center border-l border-line text-muted-foreground hover:bg-invert-bg hover:text-invert-fg"
							aria-label="Toggle menu"
							aria-expanded={isMobileMenuOpen}
							aria-controls="mobile-menu"
						>
							<div className="flex w-5 flex-col gap-1.5">
								<span
									className={cn(
										"h-px bg-current transition-all duration-300 origin-center",
										isMobileMenuOpen ? "w-5 translate-y-1 rotate-45" : "w-5",
									)}
								/>
								<span
									className={cn(
										"h-px bg-current transition-all duration-300",
										isMobileMenuOpen && "opacity-0 translate-x-2",
									)}
								/>
								<span
									className={cn(
										"h-px bg-current transition-all duration-300 origin-center",
										isMobileMenuOpen ? "w-5 -translate-y-1 -rotate-45" : "w-5",
									)}
								/>
							</div>
						</button>
					</div>
				</div>
			</div>

				{/* Mobile Menu */}
				<div
					id="mobile-menu"
					className={cn(
					"grid transition-all duration-300 ease-in-out lg:hidden bg-background overflow-hidden border-line",
					isMobileMenuOpen
						? "grid-rows-[1fr] opacity-100 border-t"
						: "grid-rows-[0fr] opacity-0",
					)}
				>
					<div className="overflow-hidden">
						{/* Safe-area padding lives on the collapsible content (clipped when closed),
							so phones with gesture bars / home indicators never hide the last row. */}
						<div ref={mobileMenuRef} className="flex flex-col gap-1 px-4 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
							{navItems.map((item, index) => (
								<Link
									key={item.href}
									href={item.href}
									onClick={() => setIsMobileMenuOpen(false)}
									ref={index === 0 ? firstMenuLinkRef : undefined}
									data-menu-inside="true"
									className={cn(
										"hud-label flex items-center gap-3 px-3 py-3 transition-colors duration-200",
										isActive(item.href)
											? "bg-invert-bg text-invert-fg"
											: "text-muted-foreground hover:text-foreground hover:bg-secondary/50",
									)}
								>
									{item.label[language]}
								</Link>
							))}

							<div className="mt-3 flex items-center gap-2 border-t border-line pt-4 px-3">
								<CommandPalette />
								{socialLinks.map((link) => (
									<a
										key={link.label}
										href={link.href}
										target="_blank"
										rel="noopener noreferrer"
										aria-label={link.label}
										className="flex h-11 w-11 items-center justify-center border border-line text-muted-foreground transition-colors hover:bg-invert-bg hover:text-invert-fg"
									>
										<link.icon className="h-4 w-4" />
									</a>
								))}
								<Link
									href="/#connect"
									onClick={() => setIsMobileMenuOpen(false)}
									className="ml-auto inline-flex h-11 items-center bg-invert-bg text-invert-fg hud-label px-5"
								>
									{ctaLabel}
								</Link>
							</div>
						</div>
					</div>
				</div>
		</header>
	);
}

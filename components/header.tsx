"use client";

import { useRef, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { GithubIcon, LinkedinIcon } from "./social-icons";
import { ThemeToggle } from "./theme-toggle";
import { LanguageToggle } from "./language-toggle";
import { CommandPalette } from "./command-palette";
import { useLanguage } from "./language-provider";
import Link from "next/link";

const navItems = [
	{ label: { en: "Home", th: "หน้าแรก" }, href: "/" },
	{ label: { en: "Resume", th: "เรซูเม่" }, href: "/introduction" },
	{ label: { en: "Projects", th: "โปรเจกต์" }, href: "/projects" },
	{ label: { en: "Workbench", th: "เวิร์กเบนช์" }, href: "/workbench" },
	{ label: { en: "Blog", th: "บล็อก" }, href: "/blog" },
	{ label: { en: "Guestbook", th: "สมุดเยี่ยม" }, href: "/guestbook" },
];

const socialLinks = [
	{ label: "GitHub", href: "https://github.com/WinTuner", icon: GithubIcon },
	{
		label: "LinkedIn",
		href: "https://www.linkedin.com/in/thanatphong-tarin-1b6619385/",
		icon: LinkedinIcon,
	},
];

export function Header() {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const menuToggleRef = useRef<HTMLButtonElement>(null);
	const firstMenuLinkRef = useRef<HTMLAnchorElement>(null);
	const logoClicksRef = useRef<{ count: number; last: number }>({ count: 0, last: 0 });
	const pathname = usePathname();
	const { language } = useLanguage();

	const isActive = (href: string) => {
		if (href === "/") return pathname === "/";
		return pathname.startsWith(href);
	};

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 20);
		};
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// Close mobile menu with Escape key + manage focus (a11y)
	useEffect(() => {
		if (!isMobileMenuOpen) {
			// Return focus to the toggle when the menu closes
			if (
				document.activeElement instanceof HTMLElement &&
				document.activeElement.dataset.menuInside === "true"
			) {
				menuToggleRef.current?.focus();
			}
			return;
		}
		// Move focus into the menu when it opens
		firstMenuLinkRef.current?.focus();
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") setIsMobileMenuOpen(false);
		};
		window.addEventListener("keydown", handleEscape);
		return () => window.removeEventListener("keydown", handleEscape);
	}, [isMobileMenuOpen]);

	return (
		<header
			className={cn(
				"fixed top-0 left-0 right-0 z-50 transition-all duration-500",
				isScrolled
					? "border-b border-border/60 bg-background/90 backdrop-blur-md"
					: "bg-transparent",
			)}
		>
			<div className="mx-auto max-w-7xl px-4 sm:px-6 py-4">
				<nav className="flex items-center justify-between">
					<Link
						href="/"
						className="group flex items-center gap-2.5"
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
						<span className="font-serif text-xl font-semibold tracking-tight">
							Win<span className="text-primary">Tuner</span>
						</span>
					</Link>

					{/* Desktop Navigation */}
					<div className="hidden items-center gap-7 md:flex">
						{navItems.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className={cn(
									"relative text-sm transition-colors duration-300",
									isActive(item.href)
										? "text-foreground font-medium"
										: "text-muted-foreground hover:text-foreground",
								)}
							>
								{item.label[language]}
								<span
									className={cn(
										"absolute -bottom-1 left-0 h-px bg-primary transition-all duration-300",
										isActive(item.href) ? "w-full" : "w-0",
									)}
								/>
							</Link>
						))}
						<div className="ml-2 flex items-center gap-2 border-l border-border/70 pl-4">
							<CommandPalette />
							<LanguageToggle />
							<ThemeToggle />
						</div>
					</div>

					<div className="flex items-center gap-4">
						<div className="hidden items-center gap-1 sm:flex">
							{socialLinks.map((link) => (
								<a
									key={link.label}
									href={link.href}
									target="_blank"
									rel="noopener noreferrer"
									aria-label={link.label}
									className="group flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors duration-300 hover:text-primary"
								>
									<link.icon className="icon-spring h-4 w-4" />
								</a>
							))}
						</div>

						<div className="hidden h-5 w-px bg-border sm:block" />

						<button
							ref={menuToggleRef}
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
							className="flex h-11 w-11 items-center justify-center rounded-md border border-border bg-card/50 md:hidden transition-colors hover:bg-secondary"
							aria-label="Toggle menu"
							aria-expanded={isMobileMenuOpen}
						>
							<div className="flex w-5 flex-col gap-1.5">
								<span
									className={cn(
										"h-px bg-foreground transition-all duration-300 origin-center",
										isMobileMenuOpen ? "w-5 translate-y-1 rotate-45" : "w-5",
									)}
								/>
								<span
									className={cn(
										"h-px bg-foreground transition-all duration-300",
										isMobileMenuOpen && "opacity-0 translate-x-2",
									)}
								/>
								<span
									className={cn(
										"h-px bg-foreground transition-all duration-300 origin-center",
										isMobileMenuOpen ? "w-5 -translate-y-1 -rotate-45" : "w-5",
									)}
								/>
							</div>
						</button>
					</div>
				</nav>

				{/* Mobile Menu */}
				<div
					className={cn(
					"grid transition-all duration-300 ease-in-out md:hidden bg-background overflow-hidden",
					isMobileMenuOpen
						? "grid-rows-[1fr] opacity-100 pt-4"
						: "grid-rows-[0fr] opacity-0",
					)}
				>
					<div className="overflow-hidden">
						{/* Safe-area padding lives on the collapsible content (clipped when closed),
							so phones with gesture bars / home indicators never hide the last row. */}
						<div className="flex flex-col gap-1 border-t border-border/60 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
							{navItems.map((item, index) => (
								<Link
									key={item.href}
									href={item.href}
									onClick={() => setIsMobileMenuOpen(false)}
									ref={index === 0 ? firstMenuLinkRef : undefined}
									data-menu-inside="true"
									className={cn(
										"flex items-center gap-3 rounded-md px-3 py-3 text-base transition-colors duration-200",
										isActive(item.href)
											? "text-foreground font-medium"
											: "text-muted-foreground hover:text-foreground hover:bg-secondary/50",
									)}
								>
									{item.label[language]}
								</Link>
							))}

							<div className="mt-3 flex items-center gap-2 border-t border-border/60 pt-4 px-3">
								<CommandPalette />
								<LanguageToggle />
								<ThemeToggle />
								{socialLinks.map((link) => (
									<a
										key={link.label}
										href={link.href}
										target="_blank"
										rel="noopener noreferrer"
										aria-label={link.label}
										className="flex h-11 w-11 items-center justify-center rounded-md border border-border/60 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
									>
										<link.icon className="icon-spring h-4 w-4" />
									</a>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import {
	Home,
	FileText,
	FolderGit2,
	Wrench,
	Newspaper,
	Search,
	Loader2,
	CornerDownLeft,
	X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "./language-provider";
import { fuzzySearch } from "@/lib/fuzzy";

import type { Project } from "@/lib/github";
import type { BlogPost } from "@/lib/blog-data";

type PaletteItem = {
	id: string;
	section: string;
	title: string;
	subtitle?: string;
	url: string;
	icon: typeof Home;
};

type SearchResult = {
	projects: Project[];
	posts: BlogPost[];
};

const pageItems: Array<{
	href: string;
	icon: typeof Home;
	label: { en: string; th: string };
	subtitle: { en: string; th: string };
}> = [
	{
		href: "/",
		icon: Home,
		label: { en: "Home", th: "หน้าแรก" },
		subtitle: { en: "Landing page", th: "หน้าหลัก" },
	},
	{
		href: "/introduction",
		icon: FileText,
		label: { en: "Resume", th: "เรซูเม่" },
		subtitle: { en: "CV, education & experience", th: "ประวัติ การศึกษา และประสบการณ์" },
	},
	{
		href: "/projects",
		icon: FolderGit2,
		label: { en: "Projects", th: "โปรเจกต์" },
		subtitle: { en: "Open source work", th: "งานโอเพนซอร์ส" },
	},
	{
		href: "/workbench",
		icon: Wrench,
		label: { en: "Workbench", th: "เวิร์กเบนช์" },
		subtitle: { en: "Tools in progress", th: "เครื่องมือที่กำลังพัฒนา" },
	},
	{
		href: "/blog",
		icon: Newspaper,
		label: { en: "Blog", th: "บล็อก" },
		subtitle: { en: "Writing & notes", th: "บทความและบันทึก" },
	},
];

export function CommandPalette() {
	const { language } = useLanguage();
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<SearchResult | null>(null);
	const [loading, setLoading] = useState(false);
	const [activeIndex, setActiveIndex] = useState(0);
	const inputRef = useRef<HTMLInputElement>(null);
	const listRef = useRef<HTMLDivElement>(null);
	const fetchRef = useRef<Promise<SearchResult> | null>(null);

	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
				e.preventDefault();
				setOpen((prev) => !prev);
			}
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, []);

	const loadResults = useCallback(async () => {
		if (results) return;
		if (!fetchRef.current) {
			fetchRef.current = fetch("/api/search")
				.then((res) => {
					if (!res.ok) throw new Error(`Search failed: ${res.status}`);
					return res.json();
				})
				.then((data) => {
					setResults(data as SearchResult);
					return data as SearchResult;
				})
				.catch((err) => {
					fetchRef.current = null;
					setResults(null);
					throw err;
				});
		}
		return fetchRef.current;
	}, [results]);

	const handleOpenChange = (next: boolean) => {
		setOpen(next);
		if (next) {
			setQuery("");
			setActiveIndex(0);
			if (!results && !fetchRef.current) {
				setLoading(true);
				loadResults()
					.catch(() => {})
					.finally(() => setLoading(false));
			}
		}
	};

	const flatItems = useMemo<PaletteItem[]>(() => {
		const sectionPages = language === "th" ? "หน้า" : "Pages";
		const sectionProjects = language === "th" ? "โปรเจกต์" : "Projects";
		const sectionPosts = language === "th" ? "บทความ" : "Posts";

		const pages: PaletteItem[] = pageItems.map((item) => ({
			id: `page:${item.href}`,
			section: sectionPages,
			title: item.label[language],
			subtitle: item.subtitle[language],
			url: item.href,
			icon: item.icon,
		}));

		if (!results) return pages;

		const q = query.trim().toLowerCase();

		const getProjectText = (p: Project) => `${p.title} ${p.description} ${p.tags.join(" ")}`;
		const getPostText = (p: BlogPost) => `${p.title} ${p.excerpt} ${p.tags.join(" ")}`;

		const projects: PaletteItem[] = q
			? fuzzySearch(query, results.projects, getProjectText)
					.slice(0, 6)
					.map(({ item }) => ({
						id: `project:${item.id}`,
						section: sectionProjects,
						title: item.title,
						subtitle: item.description,
						url: item.url,
						icon: FolderGit2,
					}))
			: results.projects.slice(0, 4).map((item) => ({
					id: `project:${item.id}`,
					section: sectionProjects,
					title: item.title,
					subtitle: item.description,
					url: item.url,
					icon: FolderGit2,
				}));

		const posts: PaletteItem[] = q
			? fuzzySearch(query, results.posts, getPostText)
					.slice(0, 6)
					.map(({ item }) => ({
						id: `post:${item.id}`,
						section: sectionPosts,
						title: item.title,
						subtitle: item.excerpt,
						url: `/blog/${item.slug}?lang=${language}`,
						icon: FileText,
					}))
			: results.posts
					.slice(0, 4)
					.map((item) => ({
						id: `post:${item.id}`,
						section: sectionPosts,
						title: item.title,
						subtitle: item.excerpt,
						url: `/blog/${item.slug}?lang=${language}`,
						icon: FileText,
					}));

		return [...pages, ...projects, ...posts];
	}, [language, results, query]);

	const hasQuery = query.trim().length > 0;

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "ArrowDown") {
			e.preventDefault();
			setActiveIndex((i) => Math.min(i + 1, flatItems.length - 1));
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			setActiveIndex((i) => Math.max(i - 1, 0));
		} else if (e.key === "Enter") {
			e.preventDefault();
			const item = flatItems[activeIndex];
			if (item) selectItem(item);
		} else if (e.key === "Home") {
			e.preventDefault();
			setActiveIndex(0);
		} else if (e.key === "End") {
			e.preventDefault();
			setActiveIndex(flatItems.length - 1);
		}
	};

	const selectItem = (item: PaletteItem) => {
		setOpen(false);
		if (/^https?:\/\//.test(item.url)) {
			window.open(item.url, "_blank", "noopener,noreferrer");
		} else {
			router.push(item.url);
		}
	};

	useEffect(() => {
		if (!open) return;
		const timer = setTimeout(() => inputRef.current?.focus(), 50);
		return () => clearTimeout(timer);
	}, [open]);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect -- reset navigation when the result list changes
		setActiveIndex(0);
	}, [query, results, open]);

	useEffect(() => {
		const active = listRef.current?.querySelector<HTMLElement>(
			`[data-index="${activeIndex}"]`,
		);
		active?.scrollIntoView({ block: "nearest" });
	}, [activeIndex]);

	const t = {
		en: {
			placeholder: "Search pages, projects, posts…",
			hint: "Type to search the site",
			empty: "No results found.",
			close: "Close",
		},
		th: {
			placeholder: "ค้นหาหน้า โปรเจกต์ บทความ…",
			hint: "พิมพ์เพื่อค้นหาในเว็บไซต์",
			empty: "ไม่พบผลการค้นหา",
			close: "ปิด",
		},
	}[language];

	return (
		<>
			<button
				type="button"
				onClick={() => handleOpenChange(true)}
				className="flex size-11 items-center justify-center rounded text-muted-foreground transition-colors duration-200 hover:text-primary"
				aria-label={t.placeholder}
			>
				<Search className="size-4" />
			</button>

			<Dialog.Root open={open} onOpenChange={handleOpenChange}>
				<Dialog.Portal>
					<Dialog.Overlay className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm animate-fade-in" />
					<Dialog.Content
						className="fixed left-1/2 top-[15vh] z-[80] w-[min(92vw,42rem)] -translate-x-1/2 rounded-2xl border border-border/60 bg-card shadow-2xl animate-scale-in outline-none"
						aria-describedby={undefined}
						onKeyDown={handleKeyDown}
					>
						<div className="flex items-center gap-3 border-b border-border/60 px-5">
							<Search className="size-4 shrink-0 text-muted-foreground" />
							<Dialog.Title className="sr-only">{t.placeholder}</Dialog.Title>
							<input
								ref={inputRef}
								type="text"
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								placeholder={t.placeholder}
								className="h-14 w-full bg-transparent text-base outline-none placeholder:text-muted-foreground/70"
								role="combobox"
								aria-expanded="true"
								aria-controls="command-palette-list"
								aria-autocomplete="list"
							/>
							{loading && <Loader2 className="size-4 shrink-0 animate-spin text-muted-foreground" />}
							<kbd className="hidden shrink-0 items-center gap-1 rounded border border-border/60 bg-secondary/50 px-2 py-1 font-mono text-[10px] text-muted-foreground sm:flex">
								<CornerDownLeft className="size-3" />
								{t.hint}
							</kbd>
						</div>

						<div
							ref={listRef}
							id="command-palette-list"
							className="max-h-[50vh] overflow-y-auto p-2"
						>
							{flatItems.length === 0 && (
								<p className="px-4 py-10 text-center font-mono text-sm text-muted-foreground">
									{t.empty}
								</p>
							)}

							{flatItems.map((item, index) => {
								const prev = flatItems[index - 1];
								const showSectionHeader = !prev || prev.section !== item.section;
								return (
									<div key={item.id}>
										{showSectionHeader && (
											<p className="px-4 pb-1 pt-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
												{item.section}
											</p>
										)}
										<button
											type="button"
											data-index={index}
											onClick={() => selectItem(item)}
											onMouseMove={() => setActiveIndex(index)}
											className={cn(
												"flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-left transition-colors duration-150",
												activeIndex === index
													? "bg-primary/10 text-primary"
													: "text-foreground",
											)}
										>
											<item.icon className="size-4 shrink-0" />
											<span className="min-w-0 flex-1">
												<span className="block truncate text-sm font-medium">
													{item.title}
												</span>
												{item.subtitle && (
													<span className="block truncate text-xs text-muted-foreground">
														{item.subtitle}
													</span>
												)}
											</span>
											{index === activeIndex && (
												<CornerDownLeft className="size-3.5 shrink-0 text-muted-foreground" />
											)}
										</button>
									</div>
								);
							})}

							{hasQuery && loading && flatItems.length === 0 && (
								<div className="space-y-2 px-2 py-2">
									{[0, 1, 2].map((n) => (
										<div key={n} className="h-12 animate-pulse rounded-lg bg-muted" />
									))}
								</div>
							)}
						</div>

						<div className="flex items-center justify-between border-t border-border/60 px-5 py-2.5">
							<p className="font-mono text-[10px] text-muted-foreground">
								↑↓ {language === "th" ? "เลือก" : "navigate"} · ↵{" "}
								{language === "th" ? "เปิด" : "open"}
							</p>
							<Dialog.Close asChild>
								<button
									type="button"
									className="flex size-7 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground"
									aria-label={t.close}
								>
									<X className="size-4" />
								</button>
							</Dialog.Close>
						</div>
					</Dialog.Content>
				</Dialog.Portal>
			</Dialog.Root>
		</>
	);
}

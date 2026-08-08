"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import type { LucideIcon } from "lucide-react";
import {
	Home,
	Wrench,
	Newspaper,
	FolderGit2,
	Languages,
	Moon,
	Sun,
	Mail,
	ArrowUp,
	Github,
	Linkedin,
	Search,
	Command,
	CornerDownLeft,
	Loader2,
	ExternalLink,
	ScrollText,
	Gamepad2,
} from "lucide-react";
import { useLanguage } from "./language-provider";
import { fuzzyMatch, fuzzySearch } from "@/lib/fuzzy";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/github";
import type { BlogPost } from "@/lib/blog-data";

const EMAIL = "Thanatphong2719@gmail.com";

type GroupKey = "navigate" | "actions" | "projects" | "posts";

interface PaletteItem {
	id: string;
	group: GroupKey;
	label: string;
	subtitle?: string;
	search: string;
	icon: LucideIcon;
	href?: string;
	external?: string;
	action?: () => void;
}

type Row =
	| { kind: "header"; label: string }
	| { kind: "item"; item: PaletteItem; labelIndices: number[] };

interface SearchPayload {
	projects: Project[];
	posts: BlogPost[];
}

export function CommandPalette() {
	const router = useRouter();
	const { setTheme, resolvedTheme } = useTheme();
	const { language, setLanguage } = useLanguage();

	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState("");
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [status, setStatus] = useState<"idle" | "loading" | "ready">("idle");
	const [payload, setPayload] = useState<SearchPayload>({ projects: [], posts: [] });
	const inputRef = useRef<HTMLInputElement>(null);
	const listRef = useRef<HTMLDivElement>(null);
	const lastActiveRef = useRef<HTMLElement | null>(null);

	const t = useMemo(
		() =>
			({
				en: {
					placeholder: "Type a command or search…",
			groups: {
				navigate: "Navigate",
				actions: "Actions",
				projects: "Projects",
				posts: "Blog posts",
			} as Record<GroupKey, string>,
			actions: {
				toggleTheme: "Toggle theme",
				toggleThemeDesc: "Switch between light and dark",
				language: "Switch language to",
				languageDesc: "EN ⇄ TH",
				copyEmail: "Copy email address",
				copyEmailDesc: "Thanatphong2719@gmail.com",
				top: "Back to top",
				topDesc: "Scroll to the top of the page",
				github: "Open GitHub profile",
				linkedin: "Open LinkedIn profile",
			},
			nav: {
				home: "Home",
				resume: "Resume",
				projects: "Projects",
				workbench: "Workbench",
				blog: "Blog",
			},
			empty: "No results found",
			loading: "Loading index…",
			postsNoPosts: "No posts yet",
		},
		th: {
			placeholder: "พิมพ์คำสั่งหรือค้นหา…",
			groups: {
				navigate: "นำทาง",
				actions: "การกระทำ",
				projects: "โปรเจกต์",
				posts: "บทความบล็อก",
			} as Record<GroupKey, string>,
			actions: {
				toggleTheme: "สลับธีม",
				toggleThemeDesc: "สลับระหว่างโหมดสว่างและมืด",
				language: "สลับภาษาเป็น",
				languageDesc: "ไทย ⇄ ENG",
				copyEmail: "คัดลอกอีเมล",
				copyEmailDesc: "Thanatphong2719@gmail.com",
				top: "กลับขึ้นบนสุด",
				topDesc: "เลื่อนไปยังด้านบนของหน้า",
				github: "เปิดโปรไฟล์ GitHub",
				linkedin: "เปิดโปรไฟล์ LinkedIn",
			},
			nav: {
				home: "หน้าแรก",
				resume: "เรซูเม่",
				projects: "โปรเจกต์",
				workbench: "เวิร์กเบนช์",
				blog: "บล็อก",
			},
				empty: "ไม่พบผลลัพธ์",
				loading: "กำลังโหลดดัชนี…",
				postsNoPosts: "ยังไม่มีบทความ",
			},
		} as const)[language],
		[language],
	);

	const loadIndex = useCallback(async () => {
		if (status === "loading") return;
		setStatus("loading");
		try {
			const response = await fetch("/api/search");
			const data = (await response.json()) as SearchPayload;
			setPayload({
				projects: data.projects ?? [],
				posts: data.posts ?? [],
			});
		} catch {
			// Palette still works for pages/actions when the index fails
		} finally {
			setStatus("ready");
		}
	}, [status]);

	const openPalette = useCallback(() => {
		setOpen(true);
		setQuery("");
		setSelectedIndex(0);
		lastActiveRef.current = document.activeElement as HTMLElement | null;
		if (status === "idle") void loadIndex();
	}, [status, loadIndex]);

	const closePalette = useCallback(() => {
		setOpen(false);
		lastActiveRef.current?.focus?.();
	}, []);

	// Global ⌘K / Ctrl+K shortcut
	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			const isCommand = event.metaKey || event.ctrlKey;
			if (isCommand && event.key.toLowerCase() === "k") {
				event.preventDefault();
				openPalette();
			}
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [openPalette]);

	// Scroll lock while open + keep the input focused
	useEffect(() => {
		if (!open) return;
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		const timer = window.setTimeout(() => inputRef.current?.focus(), 10);
		return () => {
			document.body.style.overflow = previousOverflow;
			window.clearTimeout(timer);
		};
	}, [open]);

	const staticItems = useMemo<PaletteItem[]>(() => {
		const nextLanguage: "en" | "th" = language === "th" ? "en" : "th";
		const nextTheme = resolvedTheme === "dark" ? "light" : "dark";

		const navigate: PaletteItem[] = [
			{
				id: "nav-home",
				group: "navigate",
				label: t.nav.home,
				search: "home หน้าแรก index root",
				icon: Home,
				href: "/",
			},
			{
				id: "nav-resume",
				group: "navigate",
				label: t.nav.resume,
				search: "resume introduction cv เรา ume ประวัติ",
				icon: ScrollText,
				href: "/introduction",
			},
			{
				id: "nav-projects",
				group: "navigate",
				label: t.nav.projects,
				search: "projects github artifacts โปรเจกต์ ผลงาน repositories",
				icon: FolderGit2,
				href: "/projects",
			},
			{
				id: "nav-workbench",
				group: "navigate",
				label: t.nav.workbench,
				search: "workbench tools stack เวิร์กเบนช์ เครื่องมือ",
				icon: Wrench,
				href: "/workbench",
			},
			{
				id: "nav-blog",
				group: "navigate",
				label: t.nav.blog,
				search: "blog posts articles medium บล็อก บทความ ตัวอักษร",
				icon: Newspaper,
				href: "/blog",
			},
		];

		const actions: PaletteItem[] = [
			{
				id: "action-theme",
				group: "actions",
				label: t.actions.toggleTheme,
				subtitle: t.actions.toggleThemeDesc,
				search: "theme light dark ธีม โหมด สลับ",
				icon: resolvedTheme === "dark" ? Sun : Moon,
				action: () => setTheme(nextTheme),
			},
			{
				id: "action-language",
				group: "actions",
				label: `${t.actions.language} ${nextLanguage === "th" ? "ไทย" : "English"}`,
				subtitle: t.actions.languageDesc,
				search: "language ภาษา en th english ไทย",
				icon: Languages,
				action: () => setLanguage(nextLanguage),
			},
			{
				id: "action-email",
				group: "actions",
				label: t.actions.copyEmail,
				subtitle: t.actions.copyEmailDesc,
				search: "email mail contact อีเมล ติดต่อ",
				icon: Mail,
				action: () => void navigator.clipboard.writeText(EMAIL),
			},
			{
				id: "action-top",
				group: "actions",
				label: t.actions.top,
				subtitle: t.actions.topDesc,
				search: "scroll top up กลับขึ้นบน เลื่อน",
				icon: ArrowUp,
				action: () => window.scrollTo({ top: 0, behavior: "smooth" }),
			},
			{
				id: "action-github",
				group: "actions",
				label: t.actions.github,
				search: "github wintuner เกิทฮับ",
				icon: Github,
				external: "https://github.com/WinTuner",
			},
			{
				id: "action-linkedin",
				group: "actions",
				label: t.actions.linkedin,
				search: "linkedin ฟอ ลิงก์",
				icon: Linkedin,
				external:
					"https://www.linkedin.com/in/thanatphong-tarin-1b6619385/",
			},
			{
				id: "action-easter",
				group: "actions",
				label: "👾 Konami mode",
				subtitle: "↑↑↓↓←→←→ B A",
				search: "konami easter egg game secret party เกม ความลับ",
				icon: Gamepad2,
				action: () => {
					window.dispatchEvent(new Event("wintuner:party"));
				},
			},
		];

		return [...navigate, ...actions];
	}, [language, t, resolvedTheme, setTheme, setLanguage]);

	const items = useMemo<PaletteItem[]>(() => {
		const projectItems: PaletteItem[] = payload.projects.map((project) => ({
			id: `project-${project.id}`,
			group: "projects",
			label: project.title,
			subtitle: project.description,
			search: `${project.title} ${project.description} ${project.tags.join(" ")} ${project.category}`,
			icon: FolderGit2,
			external: project.url,
		}));

		const postItems: PaletteItem[] = payload.posts.map((post) => ({
			id: `post-${post.id}-${post.slug}`,
			group: "posts",
			label: post.title,
			subtitle: post.excerpt,
			search: `${post.title} ${post.excerpt} ${post.tags.join(" ")} ${post.category}`,
			icon: Newspaper,
			href: `/blog/${post.slug}`,
		}));

		return [...staticItems, ...projectItems, ...postItems];
	}, [staticItems, payload]);

	const results = useMemo(() => {
		const ranked = query.trim()
			? fuzzySearch(query, items, (item) => item.search).slice(0, 50)
			: items.slice(0, 30).map((item) => ({ item }));

		const rows: Row[] = [];
		const selectable: PaletteItem[] = [];
		let lastGroup: GroupKey | null = null;

		for (const { item } of ranked) {
			if (item.group !== lastGroup) {
				rows.push({ kind: "header", label: t.groups[item.group] });
				lastGroup = item.group;
			}
			const labelIndices = fuzzyMatch(query, item.label)?.indices ?? [];
			rows.push({ kind: "item", item, labelIndices });
			selectable.push(item);
		}

		return { rows, selectable };
	}, [query, items, t]);

	const selectItem = useCallback(
		(item: PaletteItem) => {
			closePalette();
			if (item.action) {
				item.action();
				return;
			}
			if (item.href) {
				router.push(item.href);
				return;
			}
			if (item.external) {
				window.open(item.external, "_blank", "noopener,noreferrer");
			}
		},
		[closePalette, router],
	);

	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === "ArrowDown") {
			event.preventDefault();
			setSelectedIndex((prev) =>
				prev < results.selectable.length - 1 ? prev + 1 : prev,
			);
		} else if (event.key === "ArrowUp") {
			event.preventDefault();
			setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
		} else if (event.key === "Enter") {
			event.preventDefault();
			const item = results.selectable[selectedIndex];
			if (item) selectItem(item);
		} else if (event.key === "Escape") {
			event.preventDefault();
			closePalette();
		}
	};

	useEffect(() => {
		const selected = listRef.current?.querySelector<HTMLElement>("[data-active='true']");
		selected?.scrollIntoView({ block: "nearest" });
	}, [selectedIndex]);

	if (!open) return null;

	return (
		<div
			className="fixed inset-0 z-[100] flex items-start justify-center bg-background/60 backdrop-blur-sm px-4 pt-[12vh]"
			onMouseDown={closePalette}
		>
			<div
				role="dialog"
				aria-modal="true"
				aria-label="Command palette"
				onMouseDown={(event) => event.stopPropagation()}
				onKeyDown={handleKeyDown}
				className="w-full max-w-xl overflow-hidden rounded-2xl border border-border/60 bg-card/95 shadow-2xl shadow-black/20 backdrop-blur-xl animate-scale-in"
			>
				{/* Input */}
				<div className="flex items-center gap-3 border-b border-border/60 px-4 sm:px-5">
					<Search className="h-4 w-4 shrink-0 text-muted-foreground" />
					<input
						ref={inputRef}
						type="text"
						value={query}
						onChange={(event) => {
							setQuery(event.target.value);
							setSelectedIndex(0);
						}}
						placeholder={t.placeholder}
						className="h-14 flex-1 bg-transparent font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground"
						aria-label={t.placeholder}
					/>
					{status === "loading" ? (
						<Loader2 className="h-4 w-4 shrink-0 animate-spin text-muted-foreground" />
					) : (
						<kbd className="hidden shrink-0 items-center gap-1 rounded-md border border-border bg-secondary/60 px-2 py-1 font-mono text-[10px] text-muted-foreground sm:flex">
							<Command className="h-3 w-3" />
							K
						</kbd>
					)}
				</div>

				{/* Results */}
				<div
					ref={listRef}
					className="max-h-[50vh] overflow-y-auto p-2 scrollbar-hide"
				>
					{status === "loading" && results.selectable.length === 0 && (
						<p className="px-4 py-8 text-center font-mono text-xs text-muted-foreground">
							{t.loading}
						</p>
					)}

					{results.selectable.length === 0 && status !== "loading" && (
						<div className="px-4 py-8 text-center">
							<p className="font-mono text-xs text-muted-foreground">
								{t.empty}
							</p>
						</div>
					)}

					{results.rows.map((row) => {
						if (row.kind === "header") {
							return (
								<p
									key={`header-${row.label}`}
									className="px-3 pb-1.5 pt-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
								>
									{row.label}
								</p>
							);
						}
						const rowIndex = results.selectable.indexOf(row.item);
						const active = rowIndex === selectedIndex;
						return (
							<button
								key={row.item.id}
								type="button"
								data-active={active ? "true" : undefined}
								onMouseEnter={() => setSelectedIndex(rowIndex)}
								onClick={() => selectItem(row.item)}
								className={cn(
									"flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors duration-150",
									active
										? "bg-primary/10 text-foreground"
										: "text-muted-foreground",
								)}
							>
								<span
									className={cn(
										"flex h-8 w-8 shrink-0 items-center justify-center rounded-md border transition-colors",
										active
											? "border-primary/40 bg-primary/15 text-primary"
											: "border-border/60 bg-secondary/40",
									)}
								>
									<row.item.icon className="h-4 w-4" />
								</span>
								<span className="min-w-0 flex-1">
									<span className="block truncate font-mono text-xs">
										<Highlight text={row.item.label} indices={row.labelIndices} />
									</span>
									{row.item.subtitle && (
										<span className="block truncate text-[11px] text-muted-foreground/70">
											{row.item.subtitle}
										</span>
									)}
								</span>
								<span
									className={cn(
										"flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-muted-foreground/60",
										active
											? "border-primary/40 bg-primary/15 text-primary"
											: "border-border/50 bg-secondary/30 opacity-0",
									)}
								>
									{row.item.external ? (
										<ExternalLink className="h-3 w-3" />
									) : (
										<CornerDownLeft className="h-3 w-3" />
									)}
								</span>
							</button>
						);
					})}
				</div>
			</div>
		</div>
	);
}

function Highlight({ text, indices }: { text: string; indices: number[] }) {
	if (indices.length === 0) return <>{text}</>;
	const matched = new Set(indices);
	return (
		<>
			{text.split("").map((char, index) =>
				matched.has(index) ? (
					<mark key={index} className="rounded-sm bg-primary/30 text-foreground">
						{char}
					</mark>
				) : (
					<span key={index}>{char}</span>
				),
			)}
		</>
	);
}

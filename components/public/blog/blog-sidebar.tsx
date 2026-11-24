"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Mail, Rss, Search, Tag, TrendingUp, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";
import { localePath } from "@/constants/languages";
import type { BlogPost } from "@/lib/blog-data";

interface BlogSidebarProps {
	posts: Array<
		Omit<BlogPost, "content"> & {
			content?: string;
			externalUrl?: string;
			image?: string;
		}
	>;
}

export function BlogSidebar({ posts = [] }: BlogSidebarProps) {
	const { language } = useLanguage();
	const router = useRouter();
	const searchParams = useSearchParams();

	const [email, setEmail] = useState("");
	const [subscribeState, setSubscribeState] = useState<
		"idle" | "sending" | "success" | "error"
	>("idle");
	const [subscribeError, setSubscribeError] = useState("");

	const activeCategory = searchParams.get("category") || "all";
	const activeTag = searchParams.get("tag") || "";
	const searchQuery = searchParams.get("q") || "";

	const [searchValue, setSearchValue] = useState(searchQuery);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect -- intentional sync from URL search params
		setSearchValue(searchQuery);
	}, [searchQuery]);

	// Get dynamic counts for categories
	const categories = [
		{ name: "All Posts", count: posts.length, slug: "all" },
		{
			name: "AI & Machine Learning",
			count: posts.filter((p) => p.category === "ai").length,
			slug: "ai",
		},
		{
			name: "Frontend",
			count: posts.filter((p) => p.category === "frontend").length,
			slug: "frontend",
		},
		{
			name: "Systems & DevOps",
			count: posts.filter((p) => p.category === "systems").length,
			slug: "systems",
		},
	];

	// Add other dynamic categories (like medium, etc.) if any exist and aren't in the list
	const standardSlugs = ["all", "ai", "frontend", "systems"];
	posts.forEach((post) => {
		if (post.category && !standardSlugs.includes(post.category)) {
			const existing = categories.find((c) => c.slug === post.category);
			if (existing) {
				existing.count++;
			} else {
				categories.push({
					name: post.category.charAt(0).toUpperCase() + post.category.slice(1),
					count: 1,
					slug: post.category,
				});
			}
		}
	});

	// Compute popular tags dynamically from the actual posts
	const tagCounts: Record<string, number> = {};
	posts.forEach((post) => {
		post.tags?.forEach((tag) => {
			const normalized = tag.toLowerCase();
			tagCounts[normalized] = (tagCounts[normalized] || 0) + 1;
		});
	});

	const popularTags = Object.keys(tagCounts)
		.sort((a, b) => tagCounts[b] - tagCounts[a])
		.slice(0, 15);

	const t = {
		en: {
			search: "Search articles...",
			categories: "Categories",
			tags: "Popular Tags",
			newsletter: "Newsletter",
			newsletterDesc:
				"Get notified about new articles and experiments. No spam, unsubscribe anytime.",
			email: "your@email.com",
			subscribe: "Subscribe",
			sending: "Subscribing...",
			subscribed: "Subscribed! You're on the list.",
			rss: "Subscribe via RSS",
		},
		th: {
			search: "ค้นหาบทความ...",
			categories: "หมวดหมู่",
			tags: "แท็กยอดนิยม",
			newsletter: "จดหมายข่าว",
			newsletterDesc:
				"รับการแจ้งเตือนเมื่อมีบทความและงานทดลองใหม่ ไม่มีสแปม ยกเลิกเมื่อไรก็ได้",
			email: "you@email.com",
			subscribe: "ติดตาม",
			sending: "กำลังติดตาม...",
			subscribed: "ติดตามสำเร็จ! คุณอยู่ในรายการแล้ว",
			rss: "ติดตามผ่าน RSS",
		},
	ja: {
			search: "Search articles...",
			categories: "Categories",
			tags: "Popular Tags",
			newsletter: "Newsletter",
			newsletterDesc:
				"Get notified about new articles and experiments. No spam, unsubscribe anytime.",
			email: "your@email.com",
			subscribe: "Subscribe",
			sending: "Subscribing...",
			subscribed: "Subscribed! You're on the list.",
			rss: "Subscribe via RSS",
		},
	zh: {
			search: "Search articles...",
			categories: "Categories",
			tags: "Popular Tags",
			newsletter: "Newsletter",
			newsletterDesc:
				"Get notified about new articles and experiments. No spam, unsubscribe anytime.",
			email: "your@email.com",
			subscribe: "Subscribe",
			sending: "Subscribing...",
			subscribed: "Subscribed! You're on the list.",
			rss: "Subscribe via RSS",
		},
	}[language];

	const handleCategoryClick = (categorySlug: string) => {
		const params = new URLSearchParams(searchParams.toString());
		if (categorySlug === "all") {
			params.delete("category");
		} else {
			params.set("category", categorySlug);
		}
		// Reset tag when category changes to avoid empty intersection results
		params.delete("tag");
		router.push(`${localePath("/blog", language)}?${params.toString()}`, { scroll: false });
	};

	const handleTagClick = (tag: string) => {
		const params = new URLSearchParams(searchParams.toString());
		if (activeTag.toLowerCase() === tag.toLowerCase()) {
			params.delete("tag");
		} else {
			params.set("tag", tag);
		}
		router.push(`${localePath("/blog", language)}?${params.toString()}`, { scroll: false });
	};

	const handleSearchSubmit = (e: React.SyntheticEvent) => {
		e.preventDefault();
		const params = new URLSearchParams(searchParams.toString());
		if (searchValue.trim()) {
			params.set("q", searchValue.trim());
		} else {
			params.delete("q");
		}
		router.push(`${localePath("/blog", language)}?${params.toString()}`, { scroll: false });
	};

	const clearSearch = () => {
		setSearchValue("");
		const params = new URLSearchParams(searchParams.toString());
		params.delete("q");
		router.push(`${localePath("/blog", language)}?${params.toString()}`, { scroll: false });
	};

	const handleSubscribe = async (e: React.SyntheticEvent) => {
		e.preventDefault();
		const trimmed = email.trim();
		if (!trimmed || subscribeState === "sending") return;

		setSubscribeState("sending");
		setSubscribeError("");
		try {
			const response = await fetch("/api/subscribe", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email: trimmed }),
			});
			const data = (await response.json().catch(() => ({}))) as {
				error?: string;
			};
			if (!response.ok) {
				setSubscribeError(
					data.error ?? "Something went wrong. Please try again.",
				);
				setSubscribeState("error");
				return;
			}
			setEmail("");
			setSubscribeState("success");
		} catch {
			setSubscribeError("Network error. Please try again.");
			setSubscribeState("error");
		}
	};

	return (
		<aside className="space-y-8 lg:sticky lg:top-28 lg:self-start">
			{/* Search */}
			<div>
				<form onSubmit={handleSearchSubmit} className="relative">
					<Search className="absolute left-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
					<Input
						type="search"
						placeholder={t.search}
						value={searchValue}
						onChange={(e) => setSearchValue(e.target.value)}
						className="h-9 rounded-none border-0 border-b border-border bg-transparent pl-6 pr-10 font-mono text-xs shadow-none focus-visible:border-primary focus-visible:ring-0 dark:bg-transparent"
					/>
					{searchValue && (
						<button
							type="button"
							onClick={clearSearch}
							className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground"
							aria-label="Clear search"
						>
							<X className="h-4 w-4" />
						</button>
					)}
				</form>
			</div>

			{/* Categories */}
			<div>
				<div className="mb-3 flex items-center gap-2">
					<TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
					<h3 className="font-mono text-[11px] text-muted-foreground">
						{t.categories}
					</h3>
				</div>
				<div>
					{categories.map((category) => (
						<button
							key={category.slug}
							onClick={() => handleCategoryClick(category.slug)}
							className={cn(
								"flex min-h-10 w-full items-center justify-between border-b border-border/50 py-2 font-mono text-[13px] transition-colors duration-200",
								activeCategory === category.slug
									? "text-primary"
									: "text-muted-foreground hover:text-foreground",
							)}
						>
							<span>
								{language === "th"
									? category.slug === "all"
										? "ทั้งหมด"
										: category.slug === "ai"
											? "AI และแมชชีนเลิร์นนิง"
											: category.slug === "frontend"
												? "ฟรอนต์เอนด์"
												: category.slug === "systems"
													? "ระบบและ DevOps"
													: category.name
									: category.name}
							</span>
							<span className="text-xs text-muted-foreground/70">
								{category.count}
							</span>
						</button>
					))}
				</div>
			</div>

			{/* Popular Tags */}
			<div>
				<div className="mb-3 flex items-center gap-2">
					<Tag className="h-3.5 w-3.5 text-muted-foreground" />
					<h3 className="font-mono text-[11px] text-muted-foreground">
						{t.tags}
					</h3>
				</div>
				<div className="flex flex-wrap gap-x-3 gap-y-1.5">
					{popularTags.map((tag) => {
						const isActive = activeTag.toLowerCase() === tag.toLowerCase();
						return (
							<button
								key={tag}
								onClick={() => handleTagClick(tag)}
								className={cn(
									"font-mono text-xs transition-colors duration-200",
									isActive
										? "text-primary"
										: "text-muted-foreground hover:text-primary",
								)}
							>
								#{tag}
							</button>
						);
					})}
				</div>
			</div>

			{/* Newsletter */}
			<div className="border-t border-border/70 pt-6">
				<div className="mb-3 flex items-center gap-2">
					<Mail className="h-3.5 w-3.5 text-muted-foreground" />
					<h3 className="font-mono text-[11px] text-muted-foreground">
						{t.newsletter}
					</h3>
				</div>
				<p className="mb-4 text-sm leading-relaxed text-muted-foreground">{t.newsletterDesc}</p>
				{subscribeState === "success" ? (
					<div className="space-y-2">
						<div role="status" aria-live="polite" className="border-l-2 border-primary/40 pl-3 text-xs text-primary">
							{t.subscribed}
						</div>
						<a
							href="/feed.xml"
							className="inline-flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground transition-colors hover:text-primary"
						>
							<Rss className="h-3 w-3" />
							{t.rss}
						</a>
					</div>
				) : (
					<form onSubmit={handleSubscribe} className="space-y-2">
						<Input
							type="email"
							placeholder={t.email}
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							disabled={subscribeState === "sending"}
							className="h-9 rounded-none border-0 border-b border-border bg-transparent font-mono text-xs shadow-none focus-visible:border-primary focus-visible:ring-0 dark:bg-transparent"
						/>
						<Button
							type="submit"
							disabled={subscribeState === "sending"}
							className="w-full rounded-none font-mono text-[11px]"
						>
							{subscribeState === "sending" ? t.sending : t.subscribe}
						</Button>
						{subscribeState === "error" && (
							<p role="alert" className="text-[10px] leading-snug text-rose-400">
								{subscribeError}
							</p>
						)}
					</form>
				)}
			</div>

			{/* RSS Feed */}
			<div>
				<a
					href="/feed.xml"
					className="inline-flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground transition-colors duration-200 hover:text-primary"
				>
					<Rss className="h-3.5 w-3.5" />
					<span>{t.rss}</span>
				</a>
			</div>
		</aside>
	);
}

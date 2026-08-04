"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useInView } from "@/lib/use-in-view";
import { cn } from "@/lib/utils";
import { Mail, Rss, Search, Tag, TrendingUp, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";
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
	const { ref: sidebarRef, isInView: isVisible } = useInView<HTMLElement>({
		threshold: 0.1,
	});

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
		router.push(`/blog?${params.toString()}`, { scroll: false });
	};

	const handleTagClick = (tag: string) => {
		const params = new URLSearchParams(searchParams.toString());
		if (activeTag.toLowerCase() === tag.toLowerCase()) {
			params.delete("tag");
		} else {
			params.set("tag", tag);
		}
		router.push(`/blog?${params.toString()}`, { scroll: false });
	};

	const handleSearchSubmit = (e: React.SyntheticEvent) => {
		e.preventDefault();
		const params = new URLSearchParams(searchParams.toString());
		if (searchValue.trim()) {
			params.set("q", searchValue.trim());
		} else {
			params.delete("q");
		}
		router.push(`/blog?${params.toString()}`, { scroll: false });
	};

	const clearSearch = () => {
		setSearchValue("");
		const params = new URLSearchParams(searchParams.toString());
		params.delete("q");
		router.push(`/blog?${params.toString()}`, { scroll: false });
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
		<aside
			ref={sidebarRef}
			className="space-y-8 lg:sticky lg:top-28 lg:self-start"
		>
			{/* Search */}
			<div className={cn("opacity-0", isVisible && "animate-fade-in-up")}>
				<form onSubmit={handleSearchSubmit} className="relative">
					<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						type="search"
						placeholder={t.search}
						value={searchValue}
						onChange={(e) => setSearchValue(e.target.value)}
						className="pl-10 pr-10 bg-card/40 border-border/50 focus:border-primary/50"
					/>
					{searchValue && (
						<button
							type="button"
							onClick={clearSearch}
							className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
							aria-label="Clear search"
						>
							<X className="h-4 w-4" />
						</button>
					)}
				</form>
			</div>

			{/* Categories */}
			<div
				className={cn("opacity-0", isVisible && "animate-fade-in-up stagger-1")}
			>
				<div className="flex items-center gap-2 mb-4">
					<TrendingUp className="h-4 w-4 text-primary" />
					<h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
						{t.categories}
					</h3>
				</div>
				<div className="space-y-1">
					{categories.map((category) => (
						<button
							key={category.slug}
							onClick={() => handleCategoryClick(category.slug)}
							className={cn(
								"flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-all duration-300",
								activeCategory === category.slug
									? "bg-primary/10 text-primary border border-primary/30"
									: "text-muted-foreground hover:bg-secondary/50 hover:text-foreground border border-transparent",
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
							<span className="rounded-md bg-secondary/60 px-2 py-0.5 font-mono text-xs">
								{category.count}
							</span>
						</button>
					))}
				</div>
			</div>

			{/* Popular Tags */}
			<div
				className={cn("opacity-0", isVisible && "animate-fade-in-up stagger-2")}
			>
				<div className="flex items-center gap-2 mb-4">
					<Tag className="h-4 w-4 text-primary" />
					<h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
						{t.tags}
					</h3>
				</div>
				<div className="flex flex-wrap gap-2">
					{popularTags.map((tag) => {
						const isActive = activeTag.toLowerCase() === tag.toLowerCase();
						return (
							<button
								key={tag}
								onClick={() => handleTagClick(tag)}
								className={cn(
									"rounded-lg border px-3 py-1.5 font-mono text-xs transition-all duration-300",
									isActive
										? "border-primary bg-primary/10 text-primary"
										: "border-border/50 bg-card/40 text-muted-foreground hover:border-primary/50 hover:bg-primary/10 hover:text-primary",
								)}
							>
								#{tag}
							</button>
						);
					})}
				</div>
			</div>

			{/* Newsletter */}
			<div
				className={cn(
					"rounded-xl border border-border/50 bg-card/40 glass p-6 opacity-0",
					isVisible && "animate-fade-in-up stagger-3",
				)}
			>
				<div className="flex items-center gap-2 mb-3">
					<Mail className="h-4 w-4 text-primary" />
					<h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
						{t.newsletter}
					</h3>
				</div>
				<p className="text-sm text-muted-foreground mb-4">{t.newsletterDesc}</p>
				{subscribeState === "success" ? (
					<div className="space-y-2">
						<div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2.5 text-xs text-emerald-400 font-mono">
							{t.subscribed}
						</div>
						<a
							href="/feed.xml"
							className="inline-flex items-center gap-1.5 text-[10px] text-muted-foreground hover:text-primary transition-colors"
						>
							<Rss className="h-3 w-3" />
							{t.rss}
						</a>
					</div>
				) : (
					<form onSubmit={handleSubscribe} className="space-y-3">
						<Input
							type="email"
							placeholder={t.email}
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							disabled={subscribeState === "sending"}
							className="bg-background/50 border-border/50 focus:border-primary/50"
						/>
						<Button
							type="submit"
							disabled={subscribeState === "sending"}
							className="w-full font-mono text-xs uppercase tracking-wider"
						>
							{subscribeState === "sending" ? t.sending : t.subscribe}
						</Button>
						{subscribeState === "error" && (
							<p className="text-[10px] text-rose-400 leading-snug">
								{subscribeError}
							</p>
						)}
					</form>
				)}
			</div>

			{/* RSS Feed */}
			<div
				className={cn("opacity-0", isVisible && "animate-fade-in-up stagger-4")}
			>
				<a
					href="/rss.xml"
					className="flex items-center justify-center gap-2 rounded-lg border border-border/50 bg-card/40 px-4 py-3 font-mono text-xs text-muted-foreground transition-all duration-300 hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
				>
					<Rss className="h-4 w-4" />
					<span>{t.rss}</span>
				</a>
			</div>
		</aside>
	);
}

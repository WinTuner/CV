"use client";

import { ArrowRight, Clock, Calendar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import Image from "next/image";
import type { BlogLanguage, BlogPost } from "@/lib/blog-data";
import { localePath } from "@/constants/languages";

interface BlogListProps {
	posts: Array<
		Omit<BlogPost, "content"> & {
			content?: string;
			externalUrl?: string;
			image?: string;
		}
	>;
	language: BlogLanguage;
}

export function BlogList({ posts, language }: BlogListProps) {
	const t = {
		en: {
			featured: "featured",
			readArticle: "read article",
			srRead: "Read",
		},
		th: {
			featured: "แนะนำ",
			readArticle: "อ่านบทความ",
			srRead: "อ่าน",
		},
	ja: {
			featured: "featured",
			readArticle: "read article",
			srRead: "Read",
		},
	zh: {
			featured: "featured",
			readArticle: "read article",
			srRead: "Read",
		},
	}[language];

	return (
		<div>
			{posts.map((post) => (
				<article
					key={post.slug}
					className="group relative -mx-3 cursor-pointer border-t border-border/70 px-3 py-8 transition-colors duration-200 hover:bg-warm/70"
				>
					{post.externalUrl ? (
						<a
							href={post.externalUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="absolute inset-0 z-10"
						>
							<span className="sr-only">
								{t.srRead} {post.title}
							</span>
						</a>
					) : (
						<Link
							href={localePath(`/blog/${post.slug}`, language)}
							className="absolute inset-0 z-10"
						>
							<span className="sr-only">
								{t.srRead} {post.title}
							</span>
						</Link>
					)}

					<div className="relative z-0 flex flex-col gap-6 md:flex-row">
						{post.image && post.image !== "" && (
							<div className="relative h-[180px] w-full shrink-0 overflow-hidden rounded-md border border-border/40 md:h-[150px] md:w-[220px]">
								<Image
									src={post.image}
									alt={post.title}
									fill
									sizes="(max-width: 768px) 100vw, 220px"
									className="h-full w-full object-cover"
								/>
							</div>
						)}
						<div className="flex min-w-0 flex-1 flex-col justify-between">
							<div>
								<div className="mb-3 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-muted-foreground">
									<span>{post.category}</span>
									{post.featured && (
										<>
											<span aria-hidden>·</span>
											<span className="text-primary">{t.featured}</span>
										</>
									)}
									<span className="ml-auto flex items-center gap-x-3">
										<span className="flex items-center gap-1">
											<Calendar className="h-3 w-3" />
											{post.date}
										</span>
										<span className="flex items-center gap-1">
											<Clock className="h-3 w-3" />
											{post.readTime}
										</span>
									</span>
								</div>

								<h2 className="mb-2 font-serif text-xl font-medium tracking-tight transition-colors duration-200 group-hover:text-primary sm:text-2xl">
									{post.title}
								</h2>

								<p className="mb-5 line-clamp-2 max-w-[62ch] text-sm leading-relaxed text-muted-foreground">
									{post.excerpt}
								</p>
							</div>

							<div>
								<div className="flex items-center justify-between gap-4">
									<div className="flex items-center gap-2.5">
										<Avatar className="h-7 w-7">
											<AvatarImage
												src={post.author.avatar || "/placeholder.svg"}
												alt={post.author.name}
											/>
											<AvatarFallback className="bg-secondary font-mono text-[10px]">
												{post.author.name
													.split(" ")
													.map((n) => n[0])
													.join("")}
											</AvatarFallback>
										</Avatar>
										<span className="text-[13px] text-muted-foreground">
											{post.author.name}
											<span className="text-muted-foreground">
												{" · "}
												{post.author.role}
											</span>
										</span>
									</div>

									<div className="flex items-center gap-2 font-mono text-xs text-muted-foreground transition-colors duration-200 group-hover:text-primary">
										<span className="sr-only">{t.readArticle}</span>
										<ArrowRight className="arrow-spring h-3.5 w-3.5" />
									</div>
								</div>

								{post.tags.length > 0 && (
									<p className="mt-3 font-mono text-xs text-muted-foreground">
										{post.tags.map((tag) => `#${tag}`).join(" · ")}
									</p>
								)}
							</div>
						</div>
					</div>
				</article>
			))}
		</div>
	);
}

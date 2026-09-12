"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, MessageSquare } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { useInView } from "@/lib/use-in-view";
import { SOCIAL_LINKS } from "@/lib/site";
import { pickTranslation } from "@/constants/languages";
import { muanjaiCaseStudy } from "@/constants/case-study-muanjai";
import { cn } from "@/lib/utils";

export function MuanjaiContent() {
	const { language } = useLanguage();
	const t = pickTranslation(muanjaiCaseStudy, language);
	const { ref: heroRef, isInView: heroInView } = useInView<HTMLDivElement>({ threshold: 0.1 });

	return (
		<article className="px-4 sm:px-6 py-12 sm:py-20">
			<div className="mx-auto max-w-4xl">
				{/* Hero */}
				<div ref={heroRef} className={cn("opacity-0", heroInView && "animate-fade-in-up")}>
					<Link
						href="/projects"
						className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground transition-colors hover:text-primary"
					>
						<ArrowLeft className="h-3.5 w-3.5" />
						{t.backToProjects}
					</Link>
					<p className="mt-8 font-mono text-xs uppercase tracking-[0.3em] text-primary">
						{t.kicker}
					</p>
					<h1 className="mt-3 font-serif text-4xl sm:text-5xl font-medium tracking-tight text-balance">
						{t.title}
					</h1>
					<p className="mt-4 max-w-3xl text-base sm:text-lg leading-relaxed text-muted-foreground">
						{t.subtitle}
					</p>
					<div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs text-muted-foreground">
						<span className="text-foreground font-medium">{t.role}</span>
						<span>{t.period}</span>
					</div>
					{/* Stack */}
					<div className="mt-8">
						<p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
							{t.stackLabel}
						</p>
						<div className="mt-3 flex flex-wrap gap-2">
							{t.stack.map((tech) => (
								<span
									key={tech}
									className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-xs text-primary"
								>
									{tech}
								</span>
							))}
						</div>
					</div>
					{/* Metrics */}
					<div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
						{t.metrics.map((metric) => (
							<div
								key={metric.label}
								className="rounded-xl border border-border/50 bg-card/50 px-4 py-5"
							>
								<p className="font-serif text-3xl font-medium text-primary">
									{metric.value}
								</p>
								<p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
									{metric.label}
								</p>
							</div>
						))}
					</div>
				</div>

				{/* Sections */}
				<div className="mt-14 space-y-12">
					{t.sections.map((section, index) => (
						<section key={section.id} id={section.id} className="scroll-mt-28">
							<div className="flex items-baseline gap-4">
								<span className="font-mono text-xs text-primary">
									{String(index + 1).padStart(2, "0")}
								</span>
								<h2 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight">
									{section.title}
								</h2>
							</div>
							<div className="mt-4 space-y-4 border-l border-border/60 pl-6 sm:pl-8">
								{section.body.map((paragraph, i) => (
									<p key={i} className="leading-relaxed text-muted-foreground">
										{paragraph}
									</p>
								))}
							</div>
						</section>
					))}

					{/* Learnings */}
					<section className="rounded-xl border border-primary/25 bg-primary/5 px-6 py-8 sm:px-8">
						<h2 className="font-serif text-2xl font-medium tracking-tight">
							{t.learningsLabel}
						</h2>
						<ul className="mt-5 space-y-3">
							{t.learnings.map((lesson) => (
								<li key={lesson} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
									<span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
									{lesson}
								</li>
							))}
						</ul>
					</section>

					{/* CTA */}
					<section>
						<h2 className="font-serif text-2xl font-medium tracking-tight">
							{t.ctaTitle}
						</h2>
						<div className="mt-5 flex flex-col gap-3 sm:flex-row">
							<a
								href={SOCIAL_LINKS.lineOa}
								target="_blank"
								rel="noopener noreferrer"
								className="btn-cyan-shadow group inline-flex items-center justify-center gap-2.5 px-8 py-4 text-sm font-medium text-primary-foreground"
							>
								<MessageSquare className="h-4 w-4" />
								{t.ctaLineOa}
								<ArrowRight className="arrow-spring h-4 w-4" />
							</a>
							<Link
								href="/projects"
								className="inline-flex items-center justify-center gap-2 rounded-lg border border-border/70 bg-card px-8 py-4 text-sm font-medium transition-colors hover:border-primary/50 hover:text-primary"
							>
								{t.ctaProjects}
							</Link>
						</div>
					</section>
				</div>
			</div>
		</article>
	);
}

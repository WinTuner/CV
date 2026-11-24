"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
	Briefcase,
	ExternalLink,
	GraduationCap,
	Mail,
	Trophy,
	BookOpen,
	Award,
	Users,
	Code2,
	Rocket,
	Lightbulb,
} from "lucide-react";
import {
	awards,
	copy,
	education,
	experiences,
	leadership,
	professionalExperience,
	selfDevelopment,
} from "@/constants/cv-data";
import { useLanguage } from "@/components/language-provider";
import { GithubIcon } from "../../social-icons";
import { UpstreamContributors } from "@/components/contributors-row";
import { renderTextWithLinks } from "@/lib/render-text-with-links";
import { CONTACT_EMAIL, CONTACT_MAILTO } from "@/lib/site";
import { DownloadResumeButton } from "./download-resume-button";

export function IntroductionContent() {
	const { language } = useLanguage();
	const t = copy[language];
	const [activeImage, setActiveImage] = useState<string | null>(null);
	const resumeRef = useRef<HTMLDivElement>(null);

	// Close the lightbox with Escape
	useEffect(() => {
		if (!activeImage) return;
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") setActiveImage(null);
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [activeImage]);

	return (
		<div ref={resumeRef} className="pb-20">
			{/* Header Section */}
			<section className="relative min-h-[50vh] px-4 sm:px-6 pt-28 sm:pt-32 pb-16">
				<div className="mx-auto max-w-4xl">
					<div className="space-y-6">
						<div className="space-y-3">
							<p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
								{t.pageLabel}
							</p>
							<h1 className="font-serif text-4xl font-medium tracking-tight sm:text-5xl lg:text-6xl text-balance">
								{t.name}
							</h1>
							<p className="text-base sm:text-lg leading-relaxed text-muted-foreground max-w-3xl">
								{t.intro}
							</p>
						</div>

						<div className="flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-xs">
							<a
								href={CONTACT_MAILTO}
								className="group inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
							>
								<Mail className="h-3.5 w-3.5 text-primary" />
								<span className="underline-animate">{CONTACT_EMAIL}</span>
							</a>
							<div className="flex flex-wrap items-center gap-6" data-pdf-ignore>
								<button
									onClick={() => window.print()}
									className="inline-flex items-center gap-2 text-primary transition-colors hover:text-foreground print:hidden cursor-pointer"
								>
									<Briefcase className="h-3.5 w-3.5" />
									{language === "th"
										? "พิมพ์ / บันทึก PDF"
										: language === "ja"
											? "印刷 / PDF保存"
											: language === "zh"
												? "打印 / 保存 PDF"
												: "Print / Save PDF"}
								</button>
								<DownloadResumeButton
									targetRef={resumeRef}
									language={language}
								/>
							</div>
						</div>
					</div>
				</div>
			</section>

			<div className="mx-auto max-w-5xl px-4 space-y-24">
				{/* 1. Professional Experience */}
				<section id="experience" className="space-y-12 content-visibility-auto">
					<div className="space-y-3">
						<p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
							{t.sectionProf}
						</p>
						<h2 className="font-serif text-3xl font-medium tracking-tight sm:text-4xl">
							{t.headingExp}
						</h2>
					</div>

					<div className="grid gap-12">
						{(
							Object.keys(professionalExperience[language]) as Array<
								keyof typeof t.categories
							>
						).map((cat) => (
							<div key={cat} className="space-y-6 border-t border-border/70 pt-6">
								<h3 className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
									{cat === "production" && <Rocket className="h-3.5 w-3.5" />}
									{cat === "competition" && <Trophy className="h-3.5 w-3.5" />}
									{cat === "academic" && <BookOpen className="h-3.5 w-3.5" />}
									{cat === "personal" && <Code2 className="h-3.5 w-3.5" />}
									{cat === "openSource" && <Users className="h-3.5 w-3.5" />}
									{t.categories[cat]}
								</h3>

								<div className="grid gap-x-12 gap-y-8 md:grid-cols-2">
									{professionalExperience[language][cat].map((proj) => (
										<article
											key={proj.name}
											className="group relative border-t border-border/60 pt-5"
										>
											<div className="space-y-4">
												<div className="flex items-start justify-between">
													<h4 className="font-serif text-lg font-medium group-hover:text-primary transition-colors">
														{proj.name}
													</h4>
												{"url" in proj && (proj as { url?: string }).url && (
													<a
														href={(proj as { url?: string }).url}
														target="_blank"
														rel="noopener noreferrer"
														aria-label={`Open ${proj.name} in a new tab`}
														className="-m-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-primary"
													>
														{(proj as { url?: string }).url!.includes("github.com") ? (
															<GithubIcon className="h-4 w-4" />
														) : (
															<ExternalLink className="h-4 w-4" />
														)}
													</a>
												)}
												</div>

												{"image" in proj && proj.image && (
													<button
														type="button"
														onClick={() => setActiveImage((proj as { image?: string }).image!)}
														aria-label={`${t.expandImage}: ${proj.name}`}
														className="w-full h-[160px] overflow-hidden rounded-lg border border-border/50 cursor-zoom-in relative group p-0 text-left"
													>
														<Image
															src={(proj as { image?: string }).image!}
															alt={proj.name}
															width={800}
															height={450}
															sizes="(max-width: 768px) 100vw, 400px"
															className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
														/>
														<div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
															<span className="bg-background/85 text-foreground text-[10px] font-mono px-2.5 py-1.5 rounded-full border border-border/50 backdrop-blur-sm flex items-center gap-1.5 animate-scale-in">
																<span className="w-1.5 h-1.5 rounded-full bg-primary" />
																{t.expandHint}
															</span>
														</div>
													</button>
												)}

												<div className="space-y-3 text-sm">
													<div>
														<span className="block font-mono text-[10px] text-muted-foreground mb-1">
															{t.roleLabel}
														</span>
														<p className="text-foreground/90">{proj.role}</p>
													</div>
													<div>
														<span className="block font-mono text-[10px] text-muted-foreground mb-1">
															{t.targetLabel}
														</span>
														<p className="text-muted-foreground line-clamp-2">
															{proj.target}
														</p>
													</div>
													<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
														<div>
															<span className="block font-mono text-[10px] text-muted-foreground mb-1">
																{t.problemLabel}
															</span>
															<p className="text-xs text-muted-foreground leading-relaxed">
																{proj.problem}
															</p>
														</div>
														<div>
															<span className="block font-mono text-[10px] text-muted-foreground mb-1">
																{t.learnedLabel}
															</span>
															<p className="text-xs text-muted-foreground leading-relaxed">
																&quot;{proj.learned}&quot;
															</p>
														</div>
													</div>
												</div>
												<UpstreamContributors
													name={proj.name}
													url={"url" in proj ? (proj as { url?: string }).url : undefined}
												/>
											</div>
										</article>
									))}
								</div>
							</div>
						))}
					</div>
				</section>

				{/* 2. Self-Development */}
				<section className="space-y-12 content-visibility-auto">
					<div className="space-y-3">
						<p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
							{t.sectionSelf}
						</p>
						<h2 className="font-serif text-3xl font-medium tracking-tight sm:text-4xl">
							{t.headingSelf}
						</h2>
					</div>

					<div className="grid gap-12 md:grid-cols-2">
						<div className="space-y-6 border-t border-border/70 pt-6">
							<h3 className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
								<Award className="h-3.5 w-3.5" />
								{t.certLabel}
							</h3>
							<ul className="space-y-4">
								{selfDevelopment[language].certifications.map((cert) => (
									<li
										key={cert.name}
										className="group flex flex-col gap-1 border-l-2 border-primary/20 pl-4 transition-colors hover:border-primary"
									>
										<span className="text-sm font-semibold">{cert.name}</span>
										<span className="text-xs text-muted-foreground">
											{cert.institution}
										</span>
										{cert.image && (
											<button
												type="button"
												onClick={() => setActiveImage(cert.image)}
												aria-label={`Expand certificate: ${cert.name}`}
												className="mt-2 w-full h-[120px] overflow-hidden rounded-lg border border-border/50 max-w-[200px] cursor-zoom-in relative group p-0 text-left"
											>
												<Image
													src={cert.image}
													alt={cert.name}
													width={400}
													height={240}
													sizes="200px"
													className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
												/>
												<div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
													<span className="bg-background/85 text-[8px] font-mono px-2 py-1 rounded-full border border-border/50 backdrop-blur-sm flex items-center gap-1 animate-scale-in">
														<span className="w-1.5 h-1.5 rounded-full bg-primary" />
														{t.expandLabel}
													</span>
												</div>
											</button>
										)}
									</li>
								))}
							</ul>
						</div>
						<div className="space-y-6 border-t border-border/70 pt-6">
							<h3 className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
								<Lightbulb className="h-3.5 w-3.5" />
								{t.workshopLabel}
							</h3>
							<ul className="space-y-4">
								{selfDevelopment[language].workshops.map((ws) => (
									<li
										key={ws.name}
										className="group flex flex-col gap-1 border-l-2 border-border pl-4 transition-colors hover:border-primary"
									>
										<span className="text-sm font-semibold">{ws.name}</span>
										<span className="text-xs text-muted-foreground">
											{ws.institution}
										</span>
									</li>
								))}
							</ul>
						</div>
					</div>
				</section>

				{/* 3. Awards */}
				<section className="space-y-12 content-visibility-auto">
					<div className="space-y-3">
						<p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
							{t.sectionAwards}
						</p>
						<h2 className="font-serif text-3xl font-medium tracking-tight sm:text-4xl text-balance">
							{t.headingAwards}
						</h2>
					</div>
					<div className="grid gap-x-12 gap-y-8 md:grid-cols-2">
						{awards[language].competitions.map((comp) => (
							<div
								key={comp.name}
								className="flex flex-col gap-4 border-t border-border/70 pt-5"
							>
								<div className="flex items-start gap-3">
									<Trophy className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
									<div>
										<h4 className="font-serif text-lg font-medium">{comp.name}</h4>
										<p className="text-xs text-primary font-mono">
											{comp.rank}
										</p>
										<p className="text-xs text-muted-foreground">
											{comp.theme}
										</p>
									</div>
								</div>
								{comp.image && (
									<button
										type="button"
										onClick={() => setActiveImage(comp.image)}
										aria-label={`${t.expandImage}: ${comp.name}`}
										className="overflow-hidden rounded-lg border border-primary/20 cursor-zoom-in relative group w-full h-[180px] p-0 text-left"
									>
										<Image
											src={comp.image}
											alt={comp.name}
											width={800}
											height={450}
											sizes="(max-width: 768px) 100vw, 500px"
											className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
										/>
										<div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
											<span className="bg-background/85 text-foreground text-[10px] font-mono px-2.5 py-1.5 rounded-full border border-border/50 backdrop-blur-sm flex items-center gap-1.5 animate-scale-in">
												<span className="w-1.5 h-1.5 rounded-full bg-primary" />
												{t.expandHint}
											</span>
										</div>
									</button>
								)}
							</div>
						))}
						{awards[language].honors.map((hon) => (
							<div
								key={hon.name}
								className="flex items-start gap-3 border-t border-border/70 pt-5"
							>
								<Award className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
								<div>
									<h4 className="font-serif text-lg font-medium">{hon.name}</h4>
									<p className="text-sm text-muted-foreground">
										{hon.institution}
									</p>
									<p className="text-xs italic text-muted-foreground">
										{hon.detail}
									</p>
								</div>
							</div>
						))}
					</div>
				</section>

				{/* 4. Leadership & Volunteer */}
				<section className="space-y-12 content-visibility-auto">
					<div className="space-y-3">
						<p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
							{t.sectionLead}
						</p>
						<h2 className="font-serif text-3xl font-medium tracking-tight sm:text-4xl">
							{t.headingLead}
						</h2>
					</div>
					<div className="grid gap-8">
						{leadership[language].map((item) => (
							<article
								key={item.title}
								className="border-t border-border/70 pt-6"
							>
								<div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
									<div className="space-y-4 max-w-2xl">
										<div className="space-y-1">
											<span className="font-mono text-[11px] text-muted-foreground">
												{item.period}
											</span>
											<h3 className="font-serif text-xl font-medium">{item.title}</h3>
											<p className="text-sm text-primary">{item.role}</p>
										</div>
										<p className="text-muted-foreground leading-relaxed">
											{item.description}
										</p>
										{item.image && (
											<button
												type="button"
												onClick={() => setActiveImage(item.image)}
												aria-label={`${t.expandImage}: ${item.title}`}
												className="mt-4 w-full h-[300px] overflow-hidden rounded-md border border-border/50 max-w-md cursor-zoom-in relative group p-0 text-left"
											>
												<Image
													src={item.image}
													alt={item.title}
													width={896}
													height={600}
													sizes="(max-width: 768px) 100vw, 448px"
													className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
												/>
												<div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
													<span className="bg-background/85 text-foreground text-[10px] font-mono px-2.5 py-1.5 rounded-full border border-border/50 backdrop-blur-sm flex items-center gap-1.5 animate-scale-in">
														<span className="w-1.5 h-1.5 rounded-full bg-primary" />
														{t.expandHint}
													</span>
												</div>
											</button>
										)}
									</div>
									<div className="space-y-3">
										<span className="block font-mono text-[10px] text-muted-foreground">
											{t.skillLabel}
										</span>
										<div className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11px] text-muted-foreground">
											{item.softSkills.map((skill) => (
												<span key={skill}>{skill}</span>
											))}
										</div>
									</div>
								</div>
							</article>
						))}
					</div>
				</section>

				{/* Education & Other */}
				<section className="pt-12 grid gap-12 md:grid-cols-2 border-t border-border/30 content-visibility-auto">
					<div className="space-y-8">
						<h3 className="font-serif text-2xl font-medium flex items-center gap-3">
							<GraduationCap className="h-5 w-5 text-muted-foreground" />
							{t.sectionEd}
						</h3>
						<div className="space-y-6">
							{education[language].map((item) => (
								<div
									key={item.school}
									className="space-y-2 relative pl-6 before:absolute before:left-0 before:top-2 before:h-2 before:w-2 before:rounded-full before:bg-primary"
								>
									<div className="flex justify-between items-start gap-4">
										<h4 className="font-bold text-sm">{item.school}</h4>
										<span className="font-mono text-[10px] text-primary shrink-0">
											{item.period}
										</span>
									</div>
									<p className="text-xs text-muted-foreground">{item.detail}</p>
									<p className="text-xs font-mono">
										{t.gpaLabel}: {item.gpa}
									</p>
									{item.image && (
										<button
											type="button"
											onClick={() => setActiveImage(item.image)}
											aria-label={`${t.expandImage}: ${item.school}`}
											className="mt-3 w-full h-[200px] overflow-hidden rounded-md border border-border/50 max-w-sm cursor-zoom-in relative group p-0 text-left"
										>
											<Image
												src={item.image}
												alt={item.school}
												width={768}
												height={432}
												sizes="(max-width: 768px) 100vw, 384px"
												className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
											/>
											<div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
												<span className="bg-background/85 text-foreground text-[10px] font-mono px-2.5 py-1.5 rounded-full border border-border/50 backdrop-blur-sm flex items-center gap-1.5 animate-scale-in">
													<span className="w-1.5 h-1.5 rounded-full bg-primary" />
													{t.expandHint}
												</span>
											</div>
										</button>
									)}
								</div>
							))}
						</div>
					</div>

					<div className="space-y-8">
						<h3 className="font-serif text-2xl font-medium flex items-center gap-3">
							<Briefcase className="h-5 w-5 text-muted-foreground" />
							{language === "th"
								? "ประสบการณ์ทำงาน"
								: language === "ja"
									? "職務経験"
									: language === "zh"
										? "工作经历"
										: "Work"}
						</h3>
						<div className="space-y-6">
							{experiences[language].map((exp) => (
								<div key={exp.title} className="space-y-3">
									<div className="flex justify-between items-start gap-4">
										<h4 className="font-bold text-sm">{exp.title}</h4>
										<span className="font-mono text-[10px] text-primary shrink-0">
											{exp.period}
										</span>
									</div>
									<ul className="space-y-1.5 pl-4">
										{exp.points.map((pt) => (
											<li
												key={pt}
												className="text-xs text-muted-foreground list-disc marker:text-primary"
											>
												{renderTextWithLinks(pt)}
											</li>
										))}
									</ul>
								</div>
							))}
						</div>
					</div>
				</section>
			</div>

			{/* Lightbox Modal */}
			{activeImage && (
				<div
					onClick={() => setActiveImage(null)}
					role="dialog"
					aria-modal="true"
					aria-label="Image preview"
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md cursor-zoom-out animate-fade-in"
				>
					<div
						onClick={(e) => e.stopPropagation()}
						className="relative max-w-[95vw] max-h-[95vh] rounded-lg overflow-hidden border border-border/50 bg-card/20 animate-scale-in"
					>
						<Image
							src={activeImage}
							alt="Expanded view"
							width={1600}
							height={1067}
							sizes="95vw"
							className="w-auto h-auto max-w-[95vw] max-h-[90vh] object-contain shadow-2xl"
						/>
						{/* Close Button */}
						<button
							autoFocus
							onClick={() => setActiveImage(null)}
							className="absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-full border border-border/50 bg-background/80 text-foreground backdrop-blur-sm transition-colors duration-200 hover:border-primary/50 hover:text-primary"
							aria-label="Close modal"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>
				</div>
			)}
		</div>
	);
}

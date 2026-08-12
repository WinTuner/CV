"use client";

import { Mail, ArrowRight } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./social-icons";
import { useLanguage } from "./language-provider";
import { useInView } from "@/lib/use-in-view";
import { cn } from "@/lib/utils";

const socialLinks = [
	{
		label: "GitHub",
		href: "https://github.com/WinTuner",
		handle: "@WinTuner",
		icon: GithubIcon,
	},
	{
		label: "LinkedIn",
		href: "https://www.linkedin.com/in/thanatphong-tarin-1b6619385/",
		handle: "/in/thanatphong-tarin-1b6619385",
		icon: LinkedinIcon,
	},
	{
		label: "Email",
		href: "mailto:Thanatphong2719@gmail.com",
		handle: "Thanatphong2719@gmail.com",
		icon: Mail,
	},
];

export function Footer() {
	const { language } = useLanguage();
	const { ref: sectionRef, isInView } = useInView<HTMLDivElement>({
		threshold: 0.15,
	});
	const t = {
		en: {
			connect: "Contact",
			togetherA: "Let's build something",
			togetherB: "together",
			desc: "Always interested in collaborations, interesting problems, and conversations about code, design, and everything in between.",
			sendSignal: "say hello",
			findElsewhere: "Find me elsewhere",							forged: "Built with",
							code: "& code",
							rights: "All rights reserved",
							template: "Based on the EinCode template by",
							templateAuthor: "Ehsan Ghaffar",
		},
		th: {
			connect: "ติดต่อ",
			togetherA: "มาสร้างอะไร",
			togetherB: "ด้วยกัน",
			desc: "สนใจงานร่วมมือ โจทย์ที่น่าสนใจ และบทสนทนาเกี่ยวกับโค้ด ดีไซน์ และทุกอย่างที่อยู่ระหว่างกลางเสมอ",
			sendSignal: "ทักทายกัน",
			findElsewhere: "ตามหาผมได้ที่อื่น",							forged: "สร้างด้วย",
							code: "และโค้ด",
							rights: "สงวนลิขสิทธิ์",
							template: "สร้างจากเทมเพลต EinCode โดย",
							templateAuthor: "Ehsan Ghaffar",
		},
	}[language];

	return (
		<footer
			id="connect"
			className="border-t border-border/60 px-4 sm:px-6 py-20 sm:py-28 content-visibility-auto"
		>
			<div ref={sectionRef} className="mx-auto max-w-7xl">
				<div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
					{/* Left column */}
					<div className={cn("space-y-6 sm:space-y-7 opacity-0", isInView && "animate-fade-in-up")}>
						<div className="space-y-4">
							<p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
								{t.connect}
							</p>
							<h2 className="font-serif text-4xl sm:text-5xl font-medium tracking-tight text-balance">
								{t.togetherA}{" "}
								<span className="italic text-primary">{t.togetherB}</span>
							</h2>
						</div>
						<p className="max-w-md text-base sm:text-lg text-muted-foreground leading-relaxed">
							{t.desc}
						</p>

						<a
							href="mailto:Thanatphong2719@gmail.com"
							className="btn-cyan-shadow group inline-flex items-center gap-2.5 px-8 py-4 text-sm font-medium text-primary-foreground"
						>
							{t.sendSignal}
							<ArrowRight className="arrow-spring h-4 w-4" />
						</a>
					</div>

					{/* Right column — links */}
					<div className={cn("space-y-5 lg:text-right opacity-0", isInView && "animate-fade-in-up stagger-2")}>
						<p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
							{t.findElsewhere}
						</p>
						<div className="space-y-1">
							{socialLinks.map((link) => (
								<a
									key={link.label}
									href={link.href}
									target={link.label !== "Email" ? "_blank" : undefined}
									rel={
										link.label !== "Email" ? "noopener noreferrer" : undefined
									}
									className="group flex items-center justify-between gap-4 border-b border-border/50 py-3 transition-colors duration-300 lg:flex-row-reverse hover:border-primary/40"
								>
									<span className="flex items-center gap-3 lg:flex-row-reverse">
										<link.icon className="h-4 w-4 text-muted-foreground transition-colors duration-300 group-hover:text-primary" />
										<span className="text-sm font-medium transition-colors group-hover:text-primary">
											{link.label}
										</span>
									</span>
									<span className="font-mono text-xs text-muted-foreground truncate">
										{link.handle}
									</span>
								</a>
							))}
						</div>
					</div>
				</div>

				<div className={cn("mt-16 sm:mt-20 space-y-4 border-t border-border/60 pt-8 opacity-0", isInView && "animate-fade-in stagger-4")}>
					<div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
						<p className="font-mono text-xs text-muted-foreground">
							{t.forged} <span className="text-primary">♥</span> {t.code}
						</p>
						<p className="font-mono text-xs text-muted-foreground">
							© {new Date().getFullYear()} WinTuner — {t.rights}
						</p>
					</div>
					<p className="text-center font-mono text-[11px] text-muted-foreground/70">
						{t.template}{" "}
						<a
							href="https://eindev.ir"
							target="_blank"
							rel="noopener noreferrer"
							className="underline underline-offset-4 transition-colors hover:text-primary"
						>
							{t.templateAuthor}
						</a>
					</p>
				</div>
			</div>
		</footer>
	);
}

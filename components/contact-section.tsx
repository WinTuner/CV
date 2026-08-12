"use client";

import { useState } from "react";
import { useLanguage } from "./language-provider";
import { useInView } from "@/lib/use-in-view";
import { cn } from "@/lib/utils";
import { Mail, MessageSquare, CheckCircle2, ArrowRight } from "lucide-react";

export function ContactSection() {
	const { language } = useLanguage();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSent, setIsSent] = useState(false);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");
	const { ref: sectionRef, isInView } = useInView<HTMLDivElement>({
		threshold: 0.1,
	});

	const t = {
		en: {
			kicker: "Contact",
			title: "Get in Touch",
			desc: "Available for new opportunities and collaborations. Drop a message or just say hi.",
			name: "Your Name",
			email: "your@email.com",
			message: "How can I help you?",
			send: "Send Message",
			sending: "Sending...",
			sent: "Message Sent",
			footer: "Direct: Thanatphong2719@gmail.com",
			directEmail: "Direct Email",
			socialHub: "Social Hub",
			sendAnother: "Send another message",
			errorGeneric: "Something went wrong. Please try again.",
			errorNetwork: "Network error. Please try again.",
			sentThanks:
				"Thank you for reaching out — I'll get back to you as soon as possible.",
		},
		th: {
			kicker: "ติดต่อ",
			title: "ติดต่อสอบถาม",
			desc: "เปิดรับโอกาสใหม่และร่วมงานกับทุกคนเสมอ ส่งข้อความหาผมได้เลยครับ",
			name: "ชื่อของคุณ",
			email: "อีเมลของคุณ",
			message: "พิมพ์ข้อความที่นี่...",
			send: "ส่งข้อความ",
			sending: "กำลังส่ง...",
			sent: "ส่งข้อความสำเร็จ",
			footer: "ติดต่อโดยตรง: Thanatphong2719@gmail.com",
			directEmail: "อีเมลโดยตรง",
			socialHub: "โซเชียลมีเดีย",
			sendAnother: "ส่งข้อความอีกครั้ง",
			errorGeneric: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
			errorNetwork: "เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่",
			sentThanks: "ขอบคุณสำหรับการติดต่อ ผมจะรีบตอบกลับโดยเร็วที่สุดครับ",
		},
	}[language];

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (isSubmitting) return;

		setIsSubmitting(true);
		setError("");
		try {
			const response = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name, email, message }),
			});
			const data = (await response.json().catch(() => ({}))) as {
				error?: string;
			};
			if (!response.ok) {
				setError(data.error ?? t.errorGeneric);
				setIsSubmitting(false);
				return;
			}
			setName("");
			setEmail("");
			setMessage("");
			setIsSubmitting(false);
			setIsSent(true);
		} catch {
			setError(t.errorNetwork);
			setIsSubmitting(false);
		}
	};

	return (
		<section
			id="contact"
			className="px-4 sm:px-6 py-20 sm:py-32 border-t border-border/60 content-visibility-auto"
		>
			<div ref={sectionRef} className="mx-auto max-w-7xl">
				<div className="grid gap-14 lg:grid-cols-2 lg:gap-20 lg:items-start">
					<div className="space-y-8">
						<div className="space-y-4">
							<p className={cn("font-mono text-xs uppercase tracking-[0.3em] text-primary opacity-0", isInView && "animate-fade-in")}>
								{t.kicker}
							</p>
							<h2 className={cn("font-serif text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-balance opacity-0", isInView && "animate-fade-in-up")}>
								{t.title}
							</h2>
							<p className={cn("max-w-lg text-base sm:text-lg text-muted-foreground leading-relaxed opacity-0", isInView && "animate-fade-in-up stagger-1")}>
								{t.desc}
							</p>
						</div>

						<div className={cn("space-y-5 opacity-0", isInView && "animate-fade-in-up stagger-2")}>
							<a
								href="mailto:Thanatphong2719@gmail.com"
								className="group flex items-center gap-4"
							>
								<div className="flex h-11 w-11 items-center justify-center border border-border/70 bg-card transition-colors duration-300 group-hover:border-primary/50">
									<Mail className="icon-spring h-4 w-4 text-primary" />
								</div>
								<div>
									<p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
										{t.directEmail}
									</p>
									<p className="text-sm font-medium transition-colors group-hover:text-primary">
										Thanatphong2719@gmail.com
									</p>
								</div>
							</a>
							<a
								href="https://github.com/WinTuner"
								target="_blank"
								rel="noopener noreferrer"
								className="group flex items-center gap-4"
							>
								<div className="flex h-11 w-11 items-center justify-center border border-border/70 bg-card transition-colors duration-300 group-hover:border-primary/50">
									<MessageSquare className="icon-spring h-4 w-4 text-primary" />
								</div>
								<div>
									<p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
										{t.socialHub}
									</p>
									<p className="text-sm font-medium transition-colors group-hover:text-primary">
										github.com/WinTuner
									</p>
								</div>
							</a>
						</div>
					</div>

					<div className={cn("border border-border/70 bg-card p-6 sm:p-10 opacity-0", isInView && "animate-fade-in-up stagger-3")}>
						{isSent ? (
							<div className="flex flex-col items-center justify-center py-14 text-center animate-fade-in">
								<div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-primary/40 bg-primary/10">
									<CheckCircle2 className="h-7 w-7 text-primary" />
								</div>
								<h3 className="mb-2 font-serif text-2xl font-medium">{t.sent}</h3>
								<p className="max-w-sm text-sm text-muted-foreground">{t.sentThanks}</p>
								<button
									onClick={() => setIsSent(false)}
									className="mt-8 text-xs font-mono text-primary underline underline-offset-4 hover:text-foreground"
								>
									{t.sendAnother}
								</button>
							</div>
						) : (
							<form onSubmit={handleSubmit} className="space-y-6">
								<div className="grid gap-6 sm:grid-cols-2">
									<div className="space-y-2">
										<label
											htmlFor="contact-name"
											className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
										>
											{t.name}
										</label>
										<input
											id="contact-name"
											required
											type="text"
											value={name}
											onChange={(e) => setName(e.target.value)}
											className="w-full border-b border-border bg-transparent px-1 py-2.5 text-base md:text-sm transition-colors focus:border-primary outline-none"
										/>
									</div>
									<div className="space-y-2">
										<label
											htmlFor="contact-email"
											className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
										>
											{t.email}
										</label>
										<input
											id="contact-email"
											required
											type="email"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											className="w-full border-b border-border bg-transparent px-1 py-2.5 text-base md:text-sm transition-colors focus:border-primary outline-none"
										/>
									</div>
								</div>
								<div className="space-y-2">
									<label
										htmlFor="contact-message"
										className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
									>
										{t.message}
									</label>
									<textarea
										id="contact-message"
										required
										rows={5}
										value={message}
										onChange={(e) => setMessage(e.target.value)}
										className="w-full resize-none border-b border-border bg-transparent px-1 py-2.5 text-base md:text-sm transition-colors focus:border-primary outline-none"
									/>
								</div>

								{error && (
									<p className="text-xs text-destructive leading-snug">{error}</p>
								)}

								<button
									disabled={isSubmitting}
									type="submit"
								className={cn(
									"btn-cyan-shadow group inline-flex w-full items-center justify-center gap-2.5 py-4 text-sm font-medium text-primary-foreground",
									isSubmitting && "opacity-80",
								)}
								>
									{isSubmitting ? t.sending : t.send}
									{!isSubmitting && (
										<ArrowRight className="arrow-spring h-4 w-4" />
									)}
								</button>
							</form>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}

"use client";

import { useState } from "react";
import { useLanguage } from "./language-provider";
import { useInView } from "@/lib/use-in-view";
import { cn } from "@/lib/utils";
import { Mail, CheckCircle2, MessageSquare, ArrowRight } from "lucide-react";

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
			kicker: "Interlink",
			title: "Get in Touch",
			desc: "Available for new opportunities and collaborations. Drop a message or just say hi.",
			name: "Your Name",
			email: "your@email.com",
			message: "How can I help you?",
			send: "Transmit Message",
			sending: "Transmitting...",
			sent: "Transmission Complete",
			footer: "Direct frequency: Thanatphong2719@gmail.com",
			directEmail: "Direct Email",
			socialHub: "Social Hub",
			sendAnother: "Send another message",
			errorGeneric: "Something went wrong. Please try again.",
			errorNetwork: "Network error. Please try again.",
			sentThanks:
				"Thank you for reaching out — I'll get back to you as soon as possible.",
		},
		th: {
			kicker: "การเชื่อมต่อ",
			title: "ติดต่อสอบถาม",
			desc: "เปิดรับโอกาสใหม่และร่วมงานกับทุกคนเสมอ ส่งข้อความหาผมได้เลยครับ",
			name: "ชื่อของคุณ",
			email: "อีเมลของคุณ",
			message: "พิมพ์ข้อความที่นี่...",
			send: "ส่งข้อความ",
			sending: "กำลังส่ง...",
			sent: "ส่งข้อความสำเร็จ",
			footer: "ติดต่อโดยตรงที่: Thanatphong2719@gmail.com",
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
			className="relative px-4 sm:px-6 py-20 sm:py-32 overflow-hidden content-visibility-auto"
		>
			{/* Aurora background blobs */}
			<div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[40rem] rounded-full bg-primary/10 blur-[120px] -z-10 animate-aurora" />
			<div className="absolute bottom-0 right-1/4 w-full max-w-xl h-96 rounded-full bg-accent/10 blur-[120px] -z-10 animate-aurora-delayed" />

			<div ref={sectionRef} className="mx-auto max-w-7xl">
				<div className="grid gap-16 lg:grid-cols-2 lg:items-center">
					<div className="space-y-8">
						<div className="space-y-4">
							<p className={cn("font-mono text-xs uppercase tracking-[0.3em] text-primary opacity-0", isInView && "animate-fade-in")}>
								{t.kicker}
							</p>
							<h2 className={cn("text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl opacity-0", isInView && "animate-fade-in-up")}>
								{t.title}
							</h2>
							<p className={cn("max-w-lg text-base sm:text-lg text-muted-foreground leading-relaxed opacity-0", isInView && "animate-fade-in-up stagger-1")}>
								{t.desc}
							</p>
						</div>

						<div className={cn("space-y-6 opacity-0", isInView && "animate-fade-in-up stagger-2")}>
							<div className="flex items-center gap-4 group">
								<div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card/50 transition-colors group-hover:border-primary/50 group-hover:bg-primary/5">
									<Mail className="h-5 w-5 text-primary" />
								</div>
								<div>
									<p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
										{t.directEmail}
									</p>
									<p className="text-sm font-medium">
										Thanatphong2719@gmail.com
									</p>
								</div>
							</div>
							<div className="flex items-center gap-4 group">
								<div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card/50 transition-colors group-hover:border-primary/50 group-hover:bg-primary/5">
									<MessageSquare className="h-5 w-5 text-primary" />
								</div>
								<div>
									<p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
										{t.socialHub}
									</p>
									<p className="text-sm font-medium">github.com/WinTuner</p>
								</div>
							</div>
						</div>
					</div>

				<div className={cn("opacity-0", isInView && "animate-scale-in")}>
					<div className="relative rounded-2xl p-1 glass backdrop-blur-xl animated-border">
							{/* Form Header / Terminal bar */}
							<div className="flex items-center gap-2 px-4 py-3 border-b border-border/50">
								<div className="h-2.5 w-2.5 rounded-full bg-destructive/50" />
								<div className="h-2.5 w-2.5 rounded-full bg-yellow-500/50" />
								<div className="h-2.5 w-2.5 rounded-full bg-primary/50" />
								<span className="ml-4 font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
									message_protocol.v1
								</span>
							</div>

							<div className="p-6 sm:p-8">
								{isSent ? (
									<div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
										<div className="relative mb-6 rounded-full bg-primary/10 p-4">
											<span className="absolute inset-0 rounded-full bg-primary/30 animate-pulse-ring" />
											<span className="absolute inset-0 rounded-full bg-primary/30 animate-pulse-ring" style={{ animationDelay: "1.2s" }} />
											<CheckCircle2 className="relative h-12 w-12 text-primary animate-pulse-glow" />
										</div>
										<h3 className="mb-2 text-2xl font-bold">{t.sent}</h3>
										<p className="text-muted-foreground">{t.sentThanks}</p>
										<button
											onClick={() => setIsSent(false)}
											className="mt-8 text-xs font-mono text-primary hover:underline underline-offset-4"
										>
											{t.sendAnother}
										</button>
									</div>
								) : (
									<form onSubmit={handleSubmit} className="space-y-5">
										<div className="grid gap-4 sm:grid-cols-2">
											<div className="space-y-2">
												<label className="font-mono text-[10px] uppercase text-muted-foreground ml-1">
													{t.name}
												</label>
												<input
													required
													type="text"
													value={name}
													onChange={(e) => setName(e.target.value)}
													className="w-full rounded-lg border border-border/50 bg-background/50 px-4 py-3 text-sm transition-all focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none"
												/>
											</div>
											<div className="space-y-2">
												<label className="font-mono text-[10px] uppercase text-muted-foreground ml-1">
													{t.email}
												</label>
												<input
													required
													type="email"
													value={email}
													onChange={(e) => setEmail(e.target.value)}
													className="w-full rounded-lg border border-border/50 bg-background/50 px-4 py-3 text-sm transition-all focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none"
												/>
											</div>
										</div>
										<div className="space-y-2">
											<label className="font-mono text-[10px] uppercase text-muted-foreground ml-1">
												{t.message}
											</label>
											<textarea
												required
												rows={4}
												value={message}
												onChange={(e) => setMessage(e.target.value)}
												className="w-full rounded-lg border border-border/50 bg-background/50 px-4 py-3 text-sm transition-all focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none resize-none"
											/>
										</div>

										{error && (
											<p className="text-xs text-rose-400 leading-snug">
												{error}
											</p>
										)}

										<button
											disabled={isSubmitting}
											type="submit"
											className={cn(
												"group relative w-full overflow-hidden rounded-lg bg-primary py-4 font-mono text-sm font-bold text-primary-foreground transition-all active:scale-[0.98]",
												isSubmitting && "opacity-80",
											)}
										>
											<span className="relative z-10 flex items-center justify-center gap-2">
												{isSubmitting ? t.sending : t.send}
												{!isSubmitting && (
													<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
												)}
											</span>
											{/* Animated shimmer */}
											<div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
										</button>
									</form>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

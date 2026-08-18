"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/language-provider";
import { MessageSquareText, Send, Loader2, PenLine } from "lucide-react";
import type { GuestbookEntry } from "@/types/guestbook";

interface GuestbookContentProps {
	initialEntries: GuestbookEntry[];
	backendReady: boolean;
}

export function GuestbookContent({
	initialEntries,
	backendReady,
}: GuestbookContentProps) {
	const { language } = useLanguage();
	const [entries, setEntries] = useState<GuestbookEntry[]>(initialEntries);
	const [name, setName] = useState("");
	const [message, setMessage] = useState("");
	const [website, setWebsite] = useState("");
	const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
	const [error, setError] = useState("");
	const [isVisible, setIsVisible] = useState(false);

	const t = {
		en: {
			kicker: "Guestbook",
			title: "Sign the guestbook",
			desc: "Say hello, share feedback, or leave a note. Every message is appreciated.",
			formTitle: "Leave a message",
			nameLabel: "Name",
			namePlaceholder: "Your name",
			messageLabel: "Message",
			messagePlaceholder: "Write something nice…",
			submit: "Post message",
			submitting: "Posting…",
			success: "Thanks for signing the guestbook!",
			errorGeneric: "Something went wrong. Please try again.",
			errorNetwork: "Network error. Please try again.",
			unavailable:
				"The guestbook isn't wired up yet — the site owner needs to configure storage (Upstash Redis). Check back soon!",
			empty: "No messages yet. Be the first to sign!",
			entries: (n: number) => `${n} message${n === 1 ? "" : "s"}`,
			dateLabel: "posted",
		},
		th: {
			kicker: "สมุดเยี่ยม",
			title: "ฝากข้อความถึงฉัน",
			desc: "ทักทาย แสดงความคิดเห็น หรือฝากข้อความ ทุกข้อความล้วนมีค่า",
			formTitle: "ฝากข้อความ",
			nameLabel: "ชื่อ",
			namePlaceholder: "ชื่อของคุณ",
			messageLabel: "ข้อความ",
			messagePlaceholder: "เขียนข้อความดี ๆ ถึงฉัน…",
			submit: "โพสต์ข้อความ",
			submitting: "กำลังโพสต์…",
			success: "ขอบคุณที่ฝากข้อความ!",
			errorGeneric: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
			errorNetwork: "เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่",
			unavailable:
				"สมุดเยี่ยมยังไม่ได้เปิดใช้งาน — เจ้าของเว็บไซต์ต้องตั้งค่าพื้นที่จัดเก็บ (Upstash Redis) ก่อน กรุณากลับมาใหม่เร็ว ๆ นี้!",
			empty: "ยังไม่มีข้อความ มาฝากข้อความแรกกัน!",
			entries: (n: number) => `${n} ข้อความ`,
			dateLabel: "โพสต์เมื่อ",
		},
	}[language];

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect -- intentional mount animation trigger
		setIsVisible(true);
	}, []);

	const formatDate = (iso: string) => {
		try {
			return new Date(iso).toLocaleDateString(
				language === "th" ? "th-TH" : "en-US",
				{ year: "numeric", month: "short", day: "numeric" },
			);
		} catch {
			return iso;
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (status === "sending") return;

		setStatus("sending");
		setError("");
		try {
			const response = await fetch("/api/guestbook", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name, message, website }),
			});
			const data = (await response.json().catch(() => ({}))) as {
				error?: string;
				entry?: GuestbookEntry;
			};

			if (!response.ok) {
				setError(data.error ?? t.errorGeneric);
				setStatus("error");
				return;
			}

			if (data.entry) setEntries((prev) => [data.entry!, ...prev]);
			setName("");
			setMessage("");
			setStatus("success");
			setTimeout(() => setStatus("idle"), 4000);
		} catch {
			setError(t.errorNetwork);
			setStatus("error");
		}
	};

	return (
		<section className="px-4 sm:px-6 py-12 sm:py-20">
			<div className="mx-auto max-w-3xl">
				{/* Hero */}
				<div className={cn("mb-12 space-y-4 opacity-0", isVisible && "animate-fade-in-up")}>
					<p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
						{t.kicker}
					</p>
					<h1 className="font-serif text-5xl sm:text-6xl font-medium tracking-tight">
						{t.title}
					</h1>
					<p className="max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
						{t.desc}
					</p>
				</div>

				{/* Form */}
				<div
					className={cn(
						"mb-14 rounded-2xl border border-border/60 bg-card p-6 sm:p-8 opacity-0",
						isVisible && "animate-fade-in-up stagger-1",
					)}
				>
					<h2 className="mb-6 flex items-center gap-3 font-serif text-2xl font-medium tracking-tight">
						<PenLine className="h-5 w-5 text-primary" />
						{t.formTitle}
					</h2>

					{backendReady ? (
						<form onSubmit={handleSubmit} className="space-y-5">
							<div className="space-y-2">
								<label htmlFor="guestbook-name" className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
									{t.nameLabel}
								</label>
								<input
									id="guestbook-name"
									type="text"
									value={name}
									onChange={(e) => setName(e.target.value)}
									placeholder={t.namePlaceholder}
									maxLength={50}
									required
									className="h-11 w-full rounded-lg border border-border/60 bg-background/50 px-4 text-sm outline-none transition-colors focus:border-primary/50"
								/>
							</div>
							<div className="space-y-2">
								<label htmlFor="guestbook-message" className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
									{t.messageLabel}
								</label>
								<textarea
									id="guestbook-message"
									value={message}
									onChange={(e) => setMessage(e.target.value)}
									placeholder={t.messagePlaceholder}
									minLength={2}
									maxLength={500}
									required
									rows={4}
									className="w-full resize-none rounded-lg border border-border/60 bg-background/50 px-4 py-3 text-sm outline-none transition-colors focus:border-primary/50"
								/>
							</div>
							{/* Honeypot — hidden from humans, visible to bots */}
							<div className="absolute -left-[9999px]" aria-hidden="true">
								<label htmlFor="guestbook-website">Website</label>
								<input
									id="guestbook-website"
									type="text"
									value={website}
									onChange={(e) => setWebsite(e.target.value)}
									tabIndex={-1}
									autoComplete="off"
								/>
							</div>

							<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
								{status === "success" && (
									<p className="text-sm text-primary">{t.success}</p>
								)}
								{status === "error" && (
									<p className="text-sm text-destructive">{error || t.errorGeneric}</p>
								)}
								<button
									type="submit"
									disabled={status === "sending"}
									className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:opacity-90 disabled:cursor-wait disabled:opacity-60 cursor-pointer"
								>
									{status === "sending" ? (
										<Loader2 className="h-4 w-4 animate-spin" />
									) : (
										<Send className="h-4 w-4" />
									)}
									{status === "sending" ? t.submitting : t.submit}
								</button>
							</div>
						</form>
					) : (
						<p className="rounded-lg border border-border/60 bg-secondary/40 px-4 py-3 text-sm text-muted-foreground">
							{t.unavailable}
						</p>
					)}
				</div>

				{/* Entries */}
				<div className="space-y-6">
					<div className="flex items-center justify-between">
						<h2 className="flex items-center gap-3 font-serif text-2xl font-medium tracking-tight">
							<MessageSquareText className="h-5 w-5 text-primary" />
							{t.entries(entries.length)}
						</h2>
					</div>

					{entries.length === 0 ? (
						<p className="rounded-xl border border-dashed border-border/70 px-6 py-10 text-center font-mono text-sm text-muted-foreground">
							{t.empty}
						</p>
					) : (
						<div className="space-y-4">
							{entries.map((entry, index) => (
								<article
									key={entry.id}
									className={cn(
										"rounded-xl border border-border/60 bg-card p-5 opacity-0 transition-all duration-300 hover:border-primary/40",
										isVisible && "animate-fade-in-up",
									)}
									style={{ animationDelay: `${(index % 6) * 80 + 300}ms` }}
								>
									<div className="mb-2 flex items-center justify-between gap-4">
										<p className="text-sm font-semibold">{entry.name}</p>
										<p className="font-mono text-[10px] text-muted-foreground">
											{t.dateLabel} {formatDate(entry.createdAt)}
										</p>
									</div>
									<p className="text-sm leading-relaxed text-muted-foreground">
										{entry.message}
									</p>
								</article>
							))}
						</div>
					)}
				</div>
			</div>
		</section>
	);
}
import Link from "next/link";
import { cookies } from "next/headers";

export default async function NotFound() {
	const cookieStore = await cookies();
	const language = cookieStore.get("site-language")?.value === "th" ? "th" : "en";
	const t = {
		en: {
			title: "Page Not Found",
			desc: "The page you're looking for doesn't exist or has been moved.",
			track: "Let's get you back on track.",
			home: "Go Home",
			blog: "Browse Blog",
			projects: "View Projects",
		},
		th: {
			title: "ไม่พบหน้าเว็บ",
			desc: "หน้าที่คุณกำลังค้นหาไม่มีอยู่ หรือถูกย้ายไปแล้ว",
			track: "พาคุณกลับไปยังเส้นทางที่ถูกต้องกันดีกว่า",
			home: "กลับหน้าหลัก",
			blog: "ดูบล็อก",
			projects: "ดูโปรเจกต์",
		},
	}[language];

	return (
		<div className="min-h-screen flex items-center justify-center px-4">
			<div className="max-w-2xl text-center">
				<div className="mb-8">
					{/* 404 Glitch Effect */}
					<h1 className="text-9xl font-bold mb-4 font-mono relative">
						<span className="glitch inline-block">404</span>
					</h1>
					<div className="h-1 w-32 bg-primary mx-auto mb-8" />
					<h2 className="text-3xl font-bold mb-4">{t.title}</h2>
					<p className="text-muted-foreground text-lg mb-2">{t.desc}</p>
					<p className="text-muted-foreground">{t.track}</p>
				</div>

				<div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
					<Link
						href="/"
						className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
					>
						{t.home}
					</Link>
					<Link
						href="/blog"
						className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors"
					>
						{t.blog}
					</Link>
					<Link
						href="/projects"
						className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors"
					>
						{t.projects}
					</Link>
				</div>

				<div className="text-sm text-muted-foreground font-mono">
					<span className="text-primary">&gt;</span> Error code: 404_NOT_FOUND
				</div>
			</div>
		</div>
	);
}

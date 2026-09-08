import Link from "next/link";
import { cookies } from "next/headers";
import { isSupportedLanguage, DEFAULT_LANGUAGE } from "@/constants/languages";
import type { SupportedLanguageCode } from "@/constants/languages";

export default async function NotFound() {
	const cookieStore = await cookies();
	const rawLang = cookieStore.get("site-language")?.value;
	const language: SupportedLanguageCode = isSupportedLanguage(rawLang) ? (rawLang as SupportedLanguageCode) : DEFAULT_LANGUAGE;
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
		ja: {
			title: "ページが見つかりません",
			desc: "お探しのページは存在しないか、移動されました。",
			track: "正しい軌道に戻りましょう。",
			home: "ホームへ",
			blog: "ブログを見る",
			projects: "プロジェクトを見る",
		},
		zh: {
			title: "页面未找到",
			desc: "您寻找的页面不存在或已被移动。",
			track: "让我们带您回到正轨。",
			home: "返回首页",
			blog: "查看博客",
			projects: "查看项目",
		},
	}[language] ?? {
			title: "Page Not Found",
			desc: "The page you're looking for doesn't exist or has been moved.",
			track: "Let's get you back on track.",
			home: "Go Home",
			blog: "Browse Blog",
			projects: "View Projects",
		};

	return (
		<div className="min-h-screen flex items-center justify-center px-4">
			<div className="max-w-2xl text-center">
				<div className="mb-8">
					<h1 className="font-serif text-9xl font-medium mb-6">404</h1>
					<h2 className="text-3xl font-serif font-medium mb-4">{t.title}</h2>
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
					Error: 404 — page not found
				</div>
			</div>
		</div>
	);
}

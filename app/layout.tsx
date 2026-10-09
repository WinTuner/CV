import type React from "react";
import { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { cookies } from "next/headers";
import { Geist, Geist_Mono, Fraunces, Archivo, Instrument_Serif } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/components/language-provider";
import { isSupportedLanguage, DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from "@/constants/languages";
import type { SupportedLanguageCode } from "@/constants/languages";
import { AnimatedBackground } from "@/components/animated-background";
import { RouteProgress } from "@/components/route-progress";
import { SmoothScroll } from "@/components/smooth-scroll";
import { SpotlightTracker } from "@/components/spotlight-tracker";
import { ScrollProgress } from "@/components/scroll-progress";
import { BackToTop } from "@/components/back-to-top";
import { EasterEgg } from "@/components/easter-egg";
import "./globals.css";
import { SITE_URL } from "@/lib/site";
import { absoluteImg, CLOUDINARY_CLOUD_NAME } from "@/lib/images";

// Configure fonts with proper options
const geist = Geist({
	subsets: ["latin"],
	variable: "--font-geist",
	display: "swap",
});
const geistMono = Geist_Mono({
	subsets: ["latin"],
	variable: "--font-geist-mono",
	display: "swap",
});
const fraunces = Fraunces({
	subsets: ["latin"],
	variable: "--font-fraunces",
	display: "swap",
});
// ArtCraft DNA: ultra-wide expanded display (watermark + headings) + serif
// italic accent for the "for artists." moment.
const archivo = Archivo({
	subsets: ["latin"],
	variable: "--font-archivo",
	display: "swap",
});
const instrumentSerif = Instrument_Serif({
	subsets: ["latin"],
	variable: "--font-instrument-serif",
	weight: "400",
	display: "swap",
});

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	viewportFit: "cover",
	// Color the mobile browser chrome (address bar) to match each theme.
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#f2f1ee" },
		{ media: "(prefers-color-scheme: dark)", color: "#0b0b0c" },
	],
};

export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),
	title: {
		default: "WinTuner — Thanatphong Tarin's Digital Laboratory",
		template: "%s | WinTuner",
	},
	description:
		"A digital workshop where code meets curiosity. Experiments, prototypes, and open-source artifacts by Thanatphong Tarin.",
	alternates: {
		types: {
			"application/rss+xml": `${SITE_URL}/feed.xml`,
		},
		languages: Object.fromEntries(
			SUPPORTED_LANGUAGES.map((l) => [l.hreflang, `${SITE_URL}${l.code === "en" ? "/" : `/?lang=${l.code}`}`]),
		),
	},
	keywords: [
		"Software Engineering",
		"Web Development",
		"Next.js",
		"React",
		"TypeScript",
		"AI",
		"Machine Learning",
		"Systems Programming",
		"Code Experiments",
	],
	authors: [{ name: "Thanatphong Tarin", url: "https://github.com/WinTuner" }],
	creator: "Thanatphong Tarin",
	publisher: "Thanatphong Tarin",
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "/",
		title: "WinTuner — Thanatphong Tarin's Digital Laboratory",
		description:
			"A digital workshop where code meets curiosity. Experiments, prototypes, and open-source artifacts by Thanatphong Tarin.",
		siteName: "WinTuner",
		images: [
			{
				url: absoluteImg("/og-image.png", SITE_URL),
				width: 1200,
				height: 630,
				alt: "WinTuner — Thanatphong Tarin's Digital Laboratory",
			},
		],
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	icons: {
		icon: [
			{
				url: "/icon-light-32x32.png",
				media: "(prefers-color-scheme: light)",
			},
			{
				url: "/icon-dark-32x32.png",
				media: "(prefers-color-scheme: dark)",
			},
		],
		shortcut: "/favicon.ico",
		apple: [
			{ url: "/apple-icon.png", sizes: "180x180" },
			{ url: "/apple-touch-icon.png", sizes: "180x180" },
		],
	},
	manifest: "/site.webmanifest",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const cookieStore = await cookies();
	const cookieLanguage = cookieStore.get("site-language")?.value;
	const initialLanguage: SupportedLanguageCode = isSupportedLanguage(cookieLanguage)
		? (cookieLanguage as SupportedLanguageCode)
		: DEFAULT_LANGUAGE;

	return (
		<html
			lang={initialLanguage}
			suppressHydrationWarning
			data-scroll-behavior="smooth"
			className={`${geist.variable} ${geistMono.variable} ${fraunces.variable} ${archivo.variable} ${instrumentSerif.variable} no-js`}
		>
			<body className="font-sans antialiased">
				{/* Photos load straight from the Cloudinary CDN (see
					hero-portrait `unoptimized`), so warm up the connection
					early to protect LCP. Skipped when serving local files. */}
				{CLOUDINARY_CLOUD_NAME ? (
					<link rel="preconnect" href="https://res.cloudinary.com" />
				) : null}
				<AnimatedBackground />
				{/*
					Removes `no-js` as soon as the HTML is parsed. Until then the
					`html.no-js` CSS override keeps below-the-fold content visible
					instead of gated behind `opacity-0` entrance animations, so a slow
					mobile connection never shows blank sections before hydration.
				*/}
				<Script
					id="remove-no-js"
					strategy="beforeInteractive"
				>
					{`document.documentElement.classList.remove('no-js');`}
				</Script>
				<a
					href="#main"
					className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-primary-foreground focus:shadow-lg"
				>
					Skip to content
				</a>
				<ThemeProvider
					attribute="class"
					defaultTheme="light"
					enableSystem={true}
					storageKey="theme-mode"
				>
					<LanguageProvider initialLanguage={initialLanguage}>
						<SmoothScroll />
						<SpotlightTracker />
						<Suspense fallback={null}>
							<RouteProgress />
						</Suspense>
						{/* No route-fade wrapper here by design: an opacity-0-start
							animation on this tree delayed LCP by ~740ms in lab. */}
						{children}
						<ScrollProgress />
						<BackToTop />
						<EasterEgg />
					</LanguageProvider>
				</ThemeProvider>
				{/* These scripts are served by Vercel's edge — anywhere else
					they 404 (`/_vercel/*`), spamming console errors and
					failing best-practices audits in lab/CI. */}
				{process.env.VERCEL === "1" ? (
					<>
						<Analytics />
						<SpeedInsights />
					</>
				) : null}
			</body>
		</html>
	);
}

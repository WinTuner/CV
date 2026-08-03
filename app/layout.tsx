import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/components/language-provider";
import "./globals.css";
import { SpotifyPlayerSlot } from "@/components/spotify-player-slot";
import { SITE_URL } from "@/lib/site";

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
	generator: "v0.app",
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
				url: "/og-image.png",
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
			{
				url: "/icon.svg",
				type: "image/svg+xml",
			},
		],
		apple: "/apple-icon.png",
	},
	manifest: "/site.webmanifest",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			suppressHydrationWarning
			className={`${geist.variable} ${geistMono.variable}`}
		>
			<body className="font-sans antialiased">
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
					<LanguageProvider>
						{children}
						<SpotifyPlayerSlot />
					</LanguageProvider>
				</ThemeProvider>
				<Analytics />
			</body>
		</html>
	);
}

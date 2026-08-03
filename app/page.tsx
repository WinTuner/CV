import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { SkillsMatrix } from "@/components/skills-matrix";
import { ProjectsGrid } from "@/components/projects-grid";
import { Workbench } from "@/components/workbench";
import {
	getGithubRepos,
	getGithubWipItems,
	getGithubRecentActivity,
} from "@/lib/github";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";
import { CursorGlow } from "@/components/cursor-glow";
import {
	generateWebsiteStructuredData,
	generatePersonStructuredData,
} from "@/lib/structured-data";
import { SITE_URL } from "@/lib/site";

export const revalidate = 900

export default async function Home() {
	const baseUrl = SITE_URL;
	const websiteStructuredData = generateWebsiteStructuredData(baseUrl);
	const personStructuredData = generatePersonStructuredData();

	const [projects, wipItems, recentActivities] = await Promise.all([
		getGithubRepos(),
		getGithubWipItems(),
		getGithubRecentActivity(),
	]);

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(websiteStructuredData),
				}}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(personStructuredData),
				}}
			/>
			<main
				id="main"
				className="relative min-h-screen overflow-hidden scanlines"
			>
				<CursorGlow />
				<div className="relative z-10">
					<Header />
					<HeroSection recentActivities={recentActivities} />
					<SkillsMatrix />
					<ProjectsGrid projects={projects} />
					<Workbench wipItems={wipItems} />
					<ContactSection />
					<Footer />
				</div>
			</main>
		</>
	);
}

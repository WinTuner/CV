import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { SkillsMatrix } from "@/components/skills-matrix";
import { ExperienceTimeline } from "@/components/experience-timeline";
import { ProjectsGrid } from "@/components/projects-grid";
import { Workbench } from "@/components/workbench";
import { GithubContributionGraph } from "@/components/github-contribution-graph";
import {
	getGithubRepos,
	getGithubWipItems,
	getGithubContributions,
} from "@/lib/github";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";
import { HighlightsStrip } from "@/components/highlights-strip";
import {
	generateWebsiteStructuredData,
	generatePersonStructuredData,
} from "@/lib/structured-data";
import { SITE_URL } from "@/lib/site";

export const revalidate = 900;

export default async function Home() {
	const baseUrl = SITE_URL;
	const websiteStructuredData = generateWebsiteStructuredData(baseUrl);
	const personStructuredData = generatePersonStructuredData();

	const [projects, wipItems, contributions] = await Promise.all([
		getGithubRepos(),
		getGithubWipItems(),
		getGithubContributions(),
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
			<main id="main" className="relative min-h-screen">
				<div className="relative z-10">
					<Header />
					<HeroSection />
					<HighlightsStrip />
					<SkillsMatrix />
					<ExperienceTimeline />
					<GithubContributionGraph contributions={contributions} />
					<ProjectsGrid projects={projects} />
					<Workbench wipItems={wipItems} />
					<ContactSection />
					<Footer />
				</div>
			</main>
		</>
	);
}

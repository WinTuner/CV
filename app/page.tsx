import { Suspense } from "react";
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

/*
 * The route is rendered on demand (streaming), so there is no route-level
 * HTML cache: caching lives on the individual fetches in `lib/github.ts`
 * (`next: { revalidate: 3600 }` Data Cache + a 2-minute in-memory cache),
 * which keeps GitHub API round-trips out of the critical path.
 *
 * Data-driven sections are streamed behind Suspense so the hero and static
 * content paint immediately on slow (especially mobile) connections, instead
 * of waiting for the GitHub API calls on the server.
 */
async function GithubContributionsSection() {
	const contributions = await getGithubContributions();
	return <GithubContributionGraph contributions={contributions} />;
}

async function ProjectsSection() {
	const projects = await getGithubRepos();
	return <ProjectsGrid projects={projects} />;
}

async function WorkbenchSection() {
	const wipItems = await getGithubWipItems();
	return <Workbench wipItems={wipItems} />;
}

function GithubContributionsSkeleton() {
	return (
		<section
			aria-hidden="true"
			className="px-4 sm:px-6 py-20 sm:py-28 content-visibility-auto"
		>
			<div className="mx-auto max-w-7xl">
				<div className="mb-12 sm:mb-16 space-y-4 animate-pulse">
					<div className="h-4 w-24 bg-muted rounded-md" />
					<div className="h-10 sm:h-12 w-2/3 max-w-lg bg-muted rounded-md" />
					<div className="h-6 w-full max-w-2xl bg-muted rounded-md" />
				</div>
				<div className="h-72 sm:h-80 rounded-lg border border-border/70 bg-card/50 animate-pulse" />
			</div>
		</section>
	);
}

function ProjectsSkeleton() {
	return (
		<section
			aria-hidden="true"
			className="px-4 sm:px-6 py-20 sm:py-28 border-t border-border/60 content-visibility-auto"
		>
			<div className="mx-auto max-w-7xl">
				<div className="mb-10 sm:mb-14 space-y-4 animate-pulse">
					<div className="h-4 w-24 bg-muted rounded-md" />
					<div className="h-10 sm:h-12 w-2/3 max-w-lg bg-muted rounded-md" />
				</div>
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-pulse">
					<div className="sm:col-span-2 lg:col-span-2 h-72 bg-muted/60 rounded-lg" />
					<div className="h-72 bg-muted/40 rounded-lg" />
					<div className="h-72 bg-muted/40 rounded-lg" />
				</div>
			</div>
		</section>
	);
}

function WorkbenchSkeleton() {
	return (
		<section
			aria-hidden="true"
			className="px-4 sm:px-6 py-20 sm:py-28 border-t border-border/60 content-visibility-auto"
		>
			<div className="mx-auto max-w-7xl">
				<div className="mb-10 sm:mb-14 space-y-4 animate-pulse">
					<div className="h-4 w-24 bg-muted rounded-md" />
					<div className="h-10 sm:h-12 w-2/3 max-w-lg bg-muted rounded-md" />
				</div>
				<div className="space-y-3 animate-pulse">
					<div className="h-24 bg-muted/50 rounded-lg" />
					<div className="h-24 bg-muted/40 rounded-lg" />
					<div className="h-24 bg-muted/40 rounded-lg" />
				</div>
			</div>
		</section>
	);
}

export default async function Home() {
	const baseUrl = SITE_URL;
	const websiteStructuredData = generateWebsiteStructuredData(baseUrl);
	const personStructuredData = generatePersonStructuredData();

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
					<Suspense fallback={<GithubContributionsSkeleton />}>
						<GithubContributionsSection />
					</Suspense>
					<Suspense fallback={<ProjectsSkeleton />}>
						<ProjectsSection />
					</Suspense>
					<Suspense fallback={<WorkbenchSkeleton />}>
						<WorkbenchSection />
					</Suspense>
					<ContactSection />
					<Footer />
				</div>
			</main>
		</>
	);
}

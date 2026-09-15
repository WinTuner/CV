import {
	GITHUB_API_BASE,
	GITHUB_GRAPHQL_URL,
	GITHUB_USERNAME,
	GITHUB_USER_AGENT,
	githubRepoUrl,
} from "./site";

export interface Project {
	id: number;
	title: string;
	description: string;
	tags: string[];
	status: "shipped" | "in-progress" | "archived";
	category: string;
	year: string;
	stars: number;
	forks: number;
	url: string;
	homepage?: string;
	featured?: boolean;
	highlight?: boolean;
}

export interface WipItem {
	id: number;
	name: string;
	description: string;
	progress: number;
	lastUpdated: string; // ISO timestamp
	url: string;
	branch: string;
	commits: number;
}

export interface ActivityItem {
	type: "commit" | "pr" | "create" | "branch";
	project: string;
	message: { en: string; th: string } | string;
	time: string; // ISO timestamp
	prAction?: "opened" | "closed" | "merged";
	prTitle?: string;
}

export interface ContributionDay {
	date: string; // yyyy-mm-dd
	count: number;
	level: 0 | 1 | 2 | 3 | 4;
}

export interface ContributionWeek {
	days: ContributionDay[];
}

export interface Contributions {
	weeks: ContributionWeek[];
	total: number;
}

interface GitHubRepo {
	id: number;
	name: string;
	description: string | null;
	language: string | null;
	topics: string[];
	fork: boolean;
	created_at: string;
	pushed_at: string;
	archived: boolean;
	stargazers_count: number;
	forks_count: number;
	size: number;
	homepage: string | null;
	html_url: string;
	default_branch: string;
}

interface GitHubPullRequest {
	title: string;
	merged: boolean;
}

const API_URL = `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?sort=pushed&per_page=100`;

const globalForGithub = globalThis as unknown as {
	githubReposCache?: { data: Project[]; timestamp: number };
	githubWipCache?: { data: WipItem[]; timestamp: number };
	githubActivityCache?: { data: ActivityItem[]; timestamp: number };
};

const CACHE_DURATION = 120 * 1000; // 2 minutes in-memory cache

// Owner's fork of upstream tinodin/AutoOS — single source for all AutoOS links.
const AUTOOS_URL = githubRepoUrl("AutoOS");

const REPO_DESCRIPTIONS: Record<string, string> = {
	AutoOS: "AutoOS is a Native AOT WinUI 3 application that automates migrating to a new Windows installation on a separate partition. With minimal user effort, it seamlessly configures a cleaner and faster system optimized for gaming performance and productivity while preserving all system compatibility.",
	DotDoctor: "🩺 The ultimate config doctor & dependency checker for Hyprland and modular dotfiles.",
	"aim4-mod": "A modified version of the Autonomous Intersection Management (AIM4) micro-simulator for autonomous vehicle traffic control.",
	"AEGIS-1-Terminal-Twine-game": "An atmospheric, text-based psychological cosmic horror game built with Twine and SugarCube. Manage your O2 supply and Sanity while unravelling the terrifying mystery of Case File 24 aboard the shifting AEGIS-1 station. 🚀🧠🌌",
	"linux-vs-windows-latency": "A hands-on C benchmark comparing input latency and scheduling behavior between Linux and Windows on identical hardware.",
	"sample-boot-3tier": "Day 4 starting skeleton for Backend Programming (MFU): the library app split into three tiers, ready for the DTO + MapStruct session.",
	"sample-boot-microservice": "Backend Programming (MFU) microservice session: the library app split into two programs that talk over HTTP.",
	"sample-boot-pubsub": "Backend Programming (MFU) event-driven session: the borrow service announces changes and other services react via pub/sub.",
	"sample-boot-basic": "Backend Programming (MFU) starter: a simple Spring Boot application used to learn basic web service development.",
	"asg-backend-682110174": "Assignment: Spring Data JPA domain model with relationships, H2 database, RESTful API controller, and unit tests.",
};

const WIP_DEFAULTS: Record<string, { commits: number; progress: number; branch: string }> = {
	AutoOS: { commits: 42, progress: 65, branch: "master" },
	DotDoctor: { commits: 34, progress: 57, branch: "main" },
	"aim4-mod": { commits: 100, progress: 80, branch: "main" },
	"AEGIS-1-Terminal-Twine-game": { commits: 23, progress: 90, branch: "main" },
	"linux-vs-windows-latency": { commits: 12, progress: 40, branch: "main" },
	"sample-boot-3tier": { commits: 8, progress: 35, branch: "main" },
	"sample-boot-microservice": { commits: 10, progress: 45, branch: "main" },
	"sample-boot-pubsub": { commits: 12, progress: 50, branch: "main" },
	"asg-backend-682110174": { commits: 20, progress: 55, branch: "main" },
};

function describeRepo(repo: GitHubRepo): string {
	return (
		REPO_DESCRIPTIONS[repo.name] ||
		repo.description ||
		(repo.fork
			? `Forked repository ${repo.name} under active practice and custom adaptation.`
			: `Public repository for ${repo.name}. Focused on ${repo.language || "software engineering"} experiments.`)
	);
}

function repoUrl(repo: GitHubRepo): string {
	return repo.name === "AutoOS" ? AUTOOS_URL : repo.html_url;
}

function githubHeaders(): Record<string, string> {
	const headers: Record<string, string> = {
		Accept: "application/vnd.github.v3+json",
		"User-Agent": GITHUB_USER_AGENT,
	};
	if (process.env.GITHUB_TOKEN) {
		headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
	}
	return headers;
}

function resolveRepoStatus(repo: GitHubRepo): Project["status"] {
	if (repo.archived) return "archived";
	const sixtyDaysAgo = Date.now() - 60 * 24 * 60 * 60 * 1000;
	return new Date(repo.pushed_at).getTime() > sixtyDaysAgo ? "in-progress" : "shipped";
}

function categorizeRepo(repo: GitHubRepo): string {
	const nameLower = repo.name.toLowerCase();
	if (repo.fork) return "openSource";
	if (
		nameLower.includes("lab") ||
		nameLower.includes("homework") ||
		nameLower.includes("class") ||
		nameLower.includes("course") ||
		nameLower.includes("final") ||
		nameLower.includes("sample-boot") ||
		nameLower.includes("asg-")
	)
		return "academic";
	if (
		nameLower.includes("hackathon") ||
		nameLower.includes("competition") ||
		nameLower.includes("contest") ||
		nameLower.includes("hylife")
	)
		return "competition";
	if (repo.homepage || repo.stargazers_count > 2) return "production";
	return "personal";
}

function buildProjectTags(repo: GitHubRepo): string[] {
	const tags = [repo.language, ...(repo.topics || [])].filter((t): t is string => Boolean(t));
	return tags.length > 0 ? tags : ["GitHub"];
}

function mapRepoToProject(repo: GitHubRepo, index: number): Project {
	const year = repo.created_at
		? new Date(repo.created_at).getFullYear().toString()
		: new Date().getFullYear().toString();
	return {
		id: repo.id,
		title: repo.name,
		description: describeRepo(repo),
		tags: buildProjectTags(repo),
		status: resolveRepoStatus(repo),
		category: categorizeRepo(repo),
		year,
		stars: repo.stargazers_count,
		forks: repo.forks_count,
		url: repoUrl(repo),
		homepage: repo.homepage || undefined,
		featured: index === 0 || repo.stargazers_count > 0,
		highlight: index === 0,
	};
}

function estimateWipProgress(repo: GitHubRepo): { progress: number; commits: number } {
	const preset = WIP_DEFAULTS[repo.name];
	if (preset) return { progress: preset.progress, commits: preset.commits };
	return {
		progress: Math.min(95, Math.max(25, 30 + repo.stargazers_count * 5 + (Math.round(repo.size / 15) % 65))),
		commits: Math.max(3, Math.round(repo.size / 12) % 150),
	};
}

function mapRepoToWipItem(repo: GitHubRepo): WipItem {
	const { progress, commits } = estimateWipProgress(repo);
	const preset = WIP_DEFAULTS[repo.name];
	return {
		id: repo.id,
		name: repo.name,
		description: describeRepo(repo) || `Active development on ${repo.name} repository.`,
		progress,
		lastUpdated: repo.pushed_at,
		url: repoUrl(repo),
		branch: preset?.branch || repo.default_branch || "main",
		commits,
	};
}

const fallbackProjects: Project[] = [
	{
		id: 1305752375,
		title: "AutoOS",
		description:
			"AutoOS is a Native AOT WinUI 3 application that automates migrating to a new Windows installation on a separate partition. With minimal user effort, it seamlessly configures a cleaner and faster system optimized for gaming performance and productivity while preserving all system compatibility.",
		tags: ["C#", ".NET 10", "WinUI 3", "Windows"],
		status: "in-progress",
		category: "openSource",
		year: "2026",
		stars: 0,
		forks: 0,
		url: AUTOOS_URL,
		featured: true,
		highlight: true,
	},
	{
		id: 100,
		title: "DotDoctor",
		description:
			"🩺 The ultimate config doctor & dependency checker for Hyprland and modular dotfiles.",
		tags: ["Shell", "Bash", "Linux"],
		status: "in-progress",
		category: "personal",
		year: "2026",
		stars: 0,
		forks: 0,
		url: githubRepoUrl("DotDoctor"),
		featured: true,
		highlight: false,
	},
	{
		id: 101,
		title: "aim4-mod",
		description:
			"A modified version of the Autonomous Intersection Management (AIM4) micro-simulator for autonomous vehicle traffic control.",
		tags: ["Java", "HTML", "Simulation"],
		status: "in-progress",
		category: "personal",
		year: "2026",
		stars: 0,
		forks: 0,
		url: githubRepoUrl("aim4-mod"),
		featured: true,
	},
	{
		id: 102,
		title: "AEGIS-1-Terminal-Twine-game",
		description:
			"An atmospheric, text-based psychological cosmic horror game built with Twine and SugarCube. Manage your O2 supply and Sanity while unravelling the terrifying mystery of Case File 24 aboard the shifting AEGIS-1 station. 🚀🧠🌌",
		tags: ["Twine", "HTML", "CSS", "Game"],
		status: "shipped",
		category: "personal",
		year: "2026",
		stars: 0,
		forks: 0,
		url: githubRepoUrl("AEGIS-1-Terminal-Twine-game"),
		featured: false,
	},
	{
		id: 103,
		title: "linux-vs-windows-latency",
		description:
			"A hands-on C benchmark comparing input latency and scheduling behavior between Linux and Windows on identical hardware.",
		tags: ["C", "Linux", "Benchmark"],
		status: "in-progress",
		category: "personal",
		year: "2026",
		stars: 0,
		forks: 0,
		url: githubRepoUrl("linux-vs-windows-latency"),
		featured: false,
	},
	{
		id: 104,
		title: "sample-boot-3tier",
		description:
			"Day 4 starting skeleton for Backend Programming (MFU): the library app split into three tiers, ready for the DTO + MapStruct session.",
		tags: ["Java", "Spring Boot", "MapStruct", "Academic"],
		status: "in-progress",
		category: "academic",
		year: "2026",
		stars: 0,
		forks: 0,
		url: githubRepoUrl("sample-boot-3tier"),
		featured: false,
	},
	{
		id: 105,
		title: "sample-boot-microservice",
		description:
			"Backend Programming (MFU) microservice session: the library app split into two programs that talk over HTTP.",
		tags: ["Java", "Spring Boot", "Spring Cloud", "Microservices"],
		status: "in-progress",
		category: "academic",
		year: "2026",
		stars: 0,
		forks: 0,
		url: githubRepoUrl("sample-boot-microservice"),
		featured: false,
	},
	{
		id: 106,
		title: "sample-boot-pubsub",
		description:
			"Backend Programming (MFU) event-driven session: the borrow service announces changes and other services react via pub/sub.",
		tags: ["Java", "Spring Boot", "Event-Driven"],
		status: "in-progress",
		category: "academic",
		year: "2026",
		stars: 0,
		forks: 0,
		url: githubRepoUrl("sample-boot-pubsub"),
		featured: false,
	},
	{
		id: 107,
		title: "asg-backend-682110174",
		description:
			"Assignment: Spring Data JPA domain model with relationships, H2 database, RESTful API controller, and unit tests.",
		tags: ["Java", "Spring Boot", "JPA"],
		status: "in-progress",
		category: "academic",
		year: "2026",
		stars: 0,
		forks: 0,
		url: githubRepoUrl("asg-backend-682110174"),
		featured: false,
	},
];

const fallbackWipItems: WipItem[] = [
	{
		id: 1305752375,
		name: "AutoOS",
		description:
			"AutoOS is a Native AOT WinUI 3 application that automates migrating to a new Windows installation on a separate partition. With minimal user effort, it seamlessly configures a cleaner and faster system optimized for gaming performance and productivity while preserving all system compatibility.",
		progress: 65,
		lastUpdated: "2026-07-21T07:40:26Z",
		url: AUTOOS_URL,
		branch: "master",
		commits: 42,
	},
	{
		id: 100,
		name: "DotDoctor",
		description:
			"🩺 The ultimate config doctor & dependency checker for Hyprland and modular dotfiles.",
		progress: 57,
		lastUpdated: "2026-06-26T18:00:00Z",
		url: githubRepoUrl("DotDoctor"),
		branch: "main",
		commits: 34,
	},
	{
		id: 101,
		name: "aim4-mod",
		description:
			"A modified version of the Autonomous Intersection Management (AIM4) micro-simulator for autonomous vehicle traffic control.",
		progress: 80,
		lastUpdated: "2026-06-23T12:00:00Z",
		url: githubRepoUrl("aim4-mod"),
		branch: "main",
		commits: 100,
	},
];

const fallbackActivities: ActivityItem[] = [
	{
		type: "commit",
		project: "AutoOS",
		message: "Optimize partition migration logic and WinUI 3 layouts",
		time: "2026-07-21T07:40:26Z",
	},
	{
		type: "commit",
		project: "DotDoctor",
		message: "Initial public release of dependency monitor",
		time: "2026-06-26T18:00:00Z",
	},
	{
		type: "commit",
		project: "aim4-mod",
		message: "Tune micro-simulator vehicle traffic parameters",
		time: "2026-06-23T12:00:00Z",
	},
];

export async function getGithubRepos(): Promise<Project[]> {
	const now = Date.now();
	if (
		globalForGithub.githubReposCache &&
		now - globalForGithub.githubReposCache.timestamp < CACHE_DURATION
	) {
		return globalForGithub.githubReposCache.data;
	}

	try {
		const response = await fetch(API_URL, {
			next: { revalidate: 3600 }, // Cache on edge/server for 1 hour
			headers: githubHeaders(),
		});

		if (!response.ok) {
			console.error(
				`Failed to fetch GitHub repos: ${response.status} ${response.statusText}`,
			);
			return fallbackProjects;
		}

		const repos = await response.json();
		if (!Array.isArray(repos)) {
			return fallbackProjects;
		}

		// Sort by pushed date descending (copy first — sort() mutates in place)
		const sortedRepos = [...repos].sort((a, b) => {
			const dateA = new Date(a.pushed_at).getTime();
			const dateB = new Date(b.pushed_at).getTime();
			return dateB - dateA;
		});

		const result = sortedRepos.map((repo: GitHubRepo, index: number) =>
			mapRepoToProject(repo, index),
		);

		globalForGithub.githubReposCache = { data: result, timestamp: now };
		return result;
	} catch (error) {
		console.error("Error fetching GitHub repos:", error);
		return fallbackProjects;
	}
}

export async function getGithubWipItems(): Promise<WipItem[]> {
	const now = Date.now();
	if (
		globalForGithub.githubWipCache &&
		now - globalForGithub.githubWipCache.timestamp < CACHE_DURATION
	) {
		return globalForGithub.githubWipCache.data;
	}

	try {
		const response = await fetch(API_URL, {
			next: { revalidate: 3600 },
			headers: githubHeaders(),
		});

		if (!response.ok) {
			return fallbackWipItems;
		}

		const repos = await response.json();
		if (!Array.isArray(repos)) {
			return fallbackWipItems;
		}

		// Filter non-archived repos and sort by pushed_at desc
		const activeRepos = repos
			.filter((repo: GitHubRepo) => !repo.archived)
			.sort(
				(a: GitHubRepo, b: GitHubRepo) =>
					new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime(),
			);

		// Take top 3 repos
		const result = activeRepos.slice(0, 3).map(mapRepoToWipItem);

		globalForGithub.githubWipCache = { data: result, timestamp: now };
		return result;
	} catch (error) {
		console.error("Error fetching WIP items:", error);
		return fallbackWipItems;
	}
}

type PrAction = "opened" | "closed" | "merged";

const PR_ACTION_TH: Record<PrAction, string> = {
	opened: "เปิด",
	closed: "ปิด",
	merged: "รวม",
};

function isPrAction(action: string): action is PrAction {
	return action === "opened" || action === "closed" || action === "merged";
}

async function fetchPrDetails(
	project: string,
	prNumber: number,
	headers: Record<string, string>,
): Promise<GitHubPullRequest | undefined> {
	const cacheKey = `pr-${project}-${prNumber}`;
	const cache = globalForGithub as unknown as Record<string, GitHubPullRequest | undefined>;
	if (cache[cacheKey]) return cache[cacheKey];
	try {
		const prResponse = await fetch(
			`${GITHUB_API_BASE}/repos/${GITHUB_USERNAME}/${project}/pulls/${prNumber}`,
			{ next: { revalidate: 3600 }, headers },
		);
		if (!prResponse.ok) return undefined;
		const prDetails = (await prResponse.json()) as GitHubPullRequest;
		cache[cacheKey] = prDetails;
		return prDetails;
	} catch (e) {
		console.error("Error fetching PR details:", e);
		return undefined;
	}
}

interface GitHubEvent {
	type: string;
	repo: { name: string };
	created_at: string;
	payload: {
		commits?: Array<{ message: string }>;
		action?: string;
		pull_request?: { number?: number; title?: string };
		ref_type?: string;
	};
}

function buildPushActivity(event: GitHubEvent, project: string, time: string): ActivityItem | null {
	const commits = event.payload.commits || [];
	if (commits.length === 0) return null;
	return { type: "commit", project, message: commits[0].message, time };
}

async function buildPrActivity(
	event: GitHubEvent,
	project: string,
	time: string,
	headers: Record<string, string>,
): Promise<ActivityItem | null> {
	const prNumber = event.payload.pull_request?.number;
	let title = event.payload.pull_request?.title as string | undefined;
	let action = event.payload.action as string;

	if (prNumber) {
		const prDetails = await fetchPrDetails(project, prNumber, headers);
		if (prDetails) {
			title = prDetails.title;
			if (action === "closed" && prDetails.merged) action = "merged";
		}
	}

	// Only surface meaningful PR lifecycle events; noise actions like
	// "reopened"/"edited"/"synchronize" would otherwise render with a
	// misleading "closed" badge downstream.
	if (!isPrAction(action)) return null;

	const finalTitle = title || `PR #${prNumber}`;
	return {
		type: "pr",
		project,
		message: {
			en: `${action.toUpperCase()}: ${finalTitle}`,
			th: `${PR_ACTION_TH[action]} PR: ${finalTitle}`,
		},
		time,
		prAction: action,
		prTitle: finalTitle,
	};
}

function buildCreateActivity(event: GitHubEvent, project: string, time: string): ActivityItem | null {
	if (event.type !== "CreateEvent" || event.payload.ref_type !== "repository") return null;
	return {
		type: "create",
		project,
		message: {
			en: `Created repository ${project}`,
			th: `สร้างรีโพสิทอรี ${project}`,
		},
		time,
	};
}

export async function getGithubRecentActivity(): Promise<ActivityItem[]> {
	const now = Date.now();
	if (
		globalForGithub.githubActivityCache &&
		now - globalForGithub.githubActivityCache.timestamp < CACHE_DURATION
	) {
		return globalForGithub.githubActivityCache.data;
	}

	const EVENTS_URL = `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/events?per_page=30`;
	const headers = githubHeaders();

	try {
		const response = await fetch(EVENTS_URL, {
			next: { revalidate: 900 }, // Cache events for 15 minutes
			headers,
		});

		if (!response.ok) {
			return fallbackActivities;
		}

		const events = await response.json();
		if (!Array.isArray(events)) {
			return fallbackActivities;
		}

		const activity: ActivityItem[] = [];

		for (const event of events) {
			// Limit to 5 recent activities
			if (activity.length >= 5) break;

			const project = event.repo.name.replace(`${GITHUB_USERNAME}/`, "");
			const time = event.created_at;

			if (event.type === "PushEvent") {
				const item = buildPushActivity(event, project, time);
				if (item) activity.push(item);
			} else if (event.type === "PullRequestEvent") {
				const item = await buildPrActivity(event, project, time, headers);
				if (item) activity.push(item);
			} else {
				const item = buildCreateActivity(event, project, time);
				if (item) activity.push(item);
			}
		}

		const result = activity.length > 0 ? activity : fallbackActivities;
		globalForGithub.githubActivityCache = { data: result, timestamp: now };
		return result;
	} catch (error) {
		console.error("Error fetching recent activity:", error);
		return fallbackActivities;
	}
}

interface GraphQLCalendarResponse {
	data?: {
		user?: {
			contributionsCollection?: {
				contributionCalendar?: {
					totalContributions?: number;
					weeks?: Array<{
						contributionDays?: Array<{
							date?: string;
							contributionCount?: number;
							level?: string;
						}>;
					}>;
				};
			};
		};
	};
}

function mapGitHubLevel(level: string): 0 | 1 | 2 | 3 | 4 {
	switch (level) {
		case "FIRST_QUARTER":
			return 1;
		case "HALF":
			return 2;
		case "THREE_QUARTERS":
			return 3;
		case "FOURTH_QUARTER":
			return 4;
		default:
			return 0;
	}
}

function countToLevel(count: number): 0 | 1 | 2 | 3 | 4 {
	if (count <= 0) return 0;
	if (count <= 2) return 1;
	if (count <= 4) return 2;
	if (count <= 7) return 3;
	return 4;
}

/** Deterministic PRNG so the offline fallback heatmap is stable per day. */
function mulberry32(seed: number): () => number {
	return () => {
		let next = seed |= 0;
		next = (next + 0x6d2b79f5) | 0;
		let t = Math.imul(next ^ (next >>> 15), 1 | next);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

function hashString(input: string): number {
	let hash = 0;
	for (let i = 0; i < input.length; i++) {
		hash = (hash * 31 + input.charCodeAt(i)) | 0;
	}
	return hash;
}

/**
 * Deterministic offline contribution calendar for the last 52 weeks.
 * Weekdays get denser activity than weekends; the value is seeded by the
 * ISO date so the same calendar renders on every visit.
 */
function generateFallbackContributions(): Contributions {
	const weeks: ContributionWeek[] = [];
	const today = new Date();
	today.setHours(12, 0, 0, 0);

	const toIso = (date: Date) =>
		`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

	// Align to the last 52 weeks starting on a Sunday.
	const end = today.getDay(); // 0 = Sunday
	const startOffset = 52 * 7 - 1 - end;
	const start = new Date(today);
	start.setDate(today.getDate() - startOffset);

	let total = 0;
	for (let weekIndex = 0; weekIndex < 52; weekIndex++) {
		const days: ContributionDay[] = [];
		for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
			const date = new Date(start);
			date.setDate(start.getDate() + weekIndex * 7 + dayIndex);
			const iso = toIso(date);
			const random = mulberry32(hashString(`${GITHUB_USERNAME}:${iso}`))();

			const weekday = date.getDay();
			const isWeekend = weekday === 0 || weekday === 6;
			// Weekend dips, weekday peaks; scale by closeness to today.
			const recency = (52 * 7 - (weekIndex * 7 + dayIndex)) / (52 * 7);
			const base = isWeekend ? 0.25 : 0.75;
			const count =
				date > today
					? 0
					: Math.floor(random * random * 6 * base * (0.6 + recency * 0.8));
			total += count;
			days.push({ date: iso, count, level: countToLevel(count) });
		}
		weeks.push({ days });
	}

	return { weeks, total };
}

export async function getGithubContributions(): Promise<Contributions> {
	const now = Date.now();
	const cache = (
		globalThis as unknown as {
			githubContributionsCache?: { data: Contributions; timestamp: number };
		}
	).githubContributionsCache;
	if (cache && now - cache.timestamp < CACHE_DURATION) {
		return cache.data;
	}

	const token = process.env.GITHUB_TOKEN;

	// Without a token the REST API cannot expose contribution calendars, so
	// fall back to the deterministic generator.
	if (!token) {
		return generateFallbackContributions();
	}

	try {
		const query = `query($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
            level
          }
        }
      }
    }
  }
}`;

		const response = await fetch(GITHUB_GRAPHQL_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
				"User-Agent": GITHUB_USER_AGENT,
			},
			body: JSON.stringify({ query, variables: { login: GITHUB_USERNAME } }),
			next: { revalidate: 3600 },
		});

		if (!response.ok) {
			return generateFallbackContributions();
		}

		const json = (await response.json()) as GraphQLCalendarResponse;
		const calendar =
			json?.data?.user?.contributionsCollection?.contributionCalendar;

		if (!calendar?.weeks?.length) {
			return generateFallbackContributions();
		}

		const weeks: ContributionWeek[] = calendar.weeks.map((week) => ({
			days: (week.contributionDays ?? []).map((day) => ({
				date: day.date ?? "",
				count: day.contributionCount ?? 0,
				level: mapGitHubLevel(day.level ?? "NONE"),
			})),
		}));

		const result: Contributions = {
			weeks,
			total: calendar.totalContributions ?? 0,
		};
		(
			globalThis as unknown as {
				githubContributionsCache?: { data: Contributions; timestamp: number };
			}
		).githubContributionsCache = { data: result, timestamp: now };
		return result;
	} catch (error) {
		console.error("Error fetching GitHub contributions:", error);
		return generateFallbackContributions();
	}
}

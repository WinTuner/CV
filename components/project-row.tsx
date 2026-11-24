import { GitFork, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { GithubIcon } from "./social-icons";
import { UpstreamContributors } from "./contributors-row";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/github";

export type ProjectRowLabels = {
	/** `null` hides the status — home shows it only when it is news (shipped/archived). */
	status: string | null;
	fork: string;
	source: string;
	live: string;
};

/** One hairline row in the project list — no card chrome, hover warms the surface. */
export function ProjectRow({ project, labels }: { project: Project; labels: ProjectRowLabels }) {
	return (
		<article className="group -mx-3 border-t border-border/70 px-3 py-6 transition-colors duration-200 hover:bg-warm/70 sm:py-7">
			<div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-xs text-muted-foreground">
				<span>{project.year}</span>
				{labels.status && <span className="text-primary">{labels.status}</span>}
				{project.fork && (
					<span className="inline-flex items-center gap-1">
						<GitFork className="h-3 w-3" />
						{labels.fork}
					</span>
				)}
			</div>

			<h3 className="mt-2 font-serif text-xl font-medium tracking-tight">
				<a
					href={project.homepage || project.url}
					target="_blank"
					rel="noopener noreferrer"
					className="transition-colors duration-200 group-hover:text-primary"
				>
					{project.title}
				</a>
			</h3>

			<p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
				{project.description}
			</p>

			<p className="mt-3 font-mono text-xs text-muted-foreground">
				{project.tags.join(" · ")}
			</p>

			<div className="mt-3">
				<UpstreamContributors name={project.title} url={project.url} />
			</div>

			<div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs text-muted-foreground">
				<a
					href={project.url}
					target="_blank"
					rel="noopener noreferrer"
					className="inline-flex items-center gap-1.5 transition-colors duration-200 hover:text-primary"
				>
					<GithubIcon className="h-3.5 w-3.5" />
					<span className="underline-animate">{labels.source}</span>
				</a>
				{project.homepage && (
					<a
						href={project.homepage}
						target="_blank"
						rel="noopener noreferrer"
						className={cn(
							"inline-flex items-center gap-1.5 text-primary transition-colors duration-200 hover:text-foreground",
						)}
					>
						<span className="underline-animate">{labels.live}</span>
						<ArrowUpRight className="h-3 w-3" />
					</a>
				)}
				<span className="inline-flex items-center gap-1">
					<Star className="h-3 w-3" /> {project.stars}
				</span>
				<span className="inline-flex items-center gap-1">
					<GitFork className="h-3 w-3" /> {project.forks}
				</span>
			</div>
		</article>
	);
}

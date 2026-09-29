"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useLanguage } from "./language-provider";
import { useInView } from "@/lib/use-in-view";
import { CONTRIBUTOR_UPSTREAMS, type Contributor } from "@/lib/github";

const LABEL: Record<string, string> = {
	en: "Contributors",
	th: "ผู้ร่วมพัฒนา",
	ja: "コントリビューター",
	zh: "贡献者",
};

const MAX_AVATARS = 7;

/**
 * Looks up the upstream repo for a display title (AutoOS, SynToolkit) and
 * renders its contributor row — null for anything else.
 */
export function UpstreamContributors({ name }: { name: string }) {
	const upstream = CONTRIBUTOR_UPSTREAMS[name];
	if (!upstream) return null;
	return <ContributorsRow owner={upstream.owner} repo={upstream.repo} />;
}

/**
 * Live contributor avatar stack for an upstream repo.
 *
 * Fetches once from `/api/contributors` when scrolled into view (fires
 * once via `useInView`). Renders nothing while loading, on error, or when
 * the list is empty — so offline/API failures never break the card.
 */
export function ContributorsRow({ owner, repo }: { owner: string; repo: string }) {
	const { language } = useLanguage();
	const { ref, isInView } = useInView<HTMLDivElement>({ threshold: 0.1 });
	const [contributors, setContributors] = useState<Contributor[] | null>(null);

	useEffect(() => {
		if (!isInView) return;
		let cancelled = false;
		fetch(`/api/contributors?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}`)
			.then((res) => (res.ok ? res.json() : []))
			.then((data) => {
				if (!cancelled && Array.isArray(data)) setContributors(data);
			})
			.catch(() => {
				if (!cancelled) setContributors([]);
			});
		return () => {
			cancelled = true;
		};
	}, [isInView, owner, repo]);

	if (!contributors || contributors.length === 0) {
		return <div ref={ref} aria-hidden="true" />;
	}

	const shown = contributors.slice(0, MAX_AVATARS);
	const extra = contributors.length - shown.length;

	return (
		<div ref={ref} className="flex items-center gap-2.5 pt-1">
			<div className="flex -space-x-2">
				{shown.map((c) => (
					<a
						key={c.login}
						href={c.profileUrl}
						target="_blank"
						rel="noopener noreferrer"
						title={`${c.login} (${c.contributions} commits)`}
						aria-label={`Contributor ${c.login}`}
						className="relative h-6 w-6 overflow-hidden rounded-full border border-border/70 bg-muted transition-transform duration-200 hover:z-10 hover:scale-125"
					>
						{c.avatarUrl ? (
							<Image
								src={c.avatarUrl}
								alt={c.login}
								width={24}
								height={24}
								loading="lazy"
								className="h-full w-full object-cover"
							/>
						) : (
							<span
								aria-hidden="true"
								className="flex h-full w-full items-center justify-center font-mono text-[9px] text-muted-foreground"
							>
								{c.login.slice(0, 1).toUpperCase()}
							</span>
						)}
					</a>
				))}
				{extra > 0 && (
					<span
						aria-label={`${extra} more contributors`}
						className="flex h-6 items-center rounded-full border border-border/70 bg-muted px-1.5 font-mono text-[9px] text-muted-foreground"
					>
						+{extra}
					</span>
				)}
			</div>
			<span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
				{LABEL[language] ?? LABEL.en} · {contributors.length}
			</span>
		</div>
	);
}

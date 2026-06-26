import { ProjectsPageContent } from "@/components/public/projects/projects-page-content";
import { getGithubRepos } from "@/lib/github";
import { Suspense } from "react";
import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://thanatphong.vercel.app';

export const metadata: Metadata = {
  title: "Projects",
  description: "Explore open source projects, experiments, and tools. From web applications to systems programming, dive into the code.",
  keywords: ["open source", "projects", "web development", "systems programming", "experiments"],
  openGraph: {
    title: "Projects — WinTuner",
    description: "Explore open source projects, experiments, and tools.",
    url: `${baseUrl}/projects`,
    type: "website",
    images: [
      {
        url: `${baseUrl}/og-image-projects.png`,
        width: 1200,
        height: 630,
        alt: "WinTuner Projects",
      },
    ],
  },
  alternates: {
    canonical: `${baseUrl}/projects`,
  },
};

async function ProjectsList() {
  const projects = await getGithubRepos();
  return <ProjectsPageContent projects={projects} />;
}

function ProjectsSkeleton() {
  return (
    <section className="px-4 sm:px-6 py-12 sm:py-20">
      <div className="mx-auto max-w-7xl">
        {/* Skeleton Hero */}
        <div className="mb-12 sm:mb-16 space-y-4 animate-pulse">
          <div className="h-4 w-24 bg-muted rounded-md" />
          <div className="h-10 sm:h-12 w-2/3 max-w-lg bg-muted rounded-md" />
          <div className="h-6 w-full max-w-xl bg-muted rounded-md" />
        </div>

        {/* Skeleton Search and Filters */}
        <div className="mb-10 space-y-6 animate-pulse">
          <div className="h-10 w-full max-w-md bg-muted rounded-md" />
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-8 w-20 bg-muted rounded-md" />
            ))}
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="h-6 w-16 bg-muted rounded-md" />
            ))}
          </div>
        </div>

        {/* Skeleton Projects Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Highlight card (spans 2 columns on desktop) */}
          <div className="sm:col-span-2 lg:col-span-2 h-72 bg-muted/60 animate-pulse rounded-xl" />
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-72 bg-muted/40 animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ProjectsPage() {
  return (
    <div className="pt-24">
      <Suspense fallback={<ProjectsSkeleton />}>
        <ProjectsList />
      </Suspense>
    </div>
  );
}

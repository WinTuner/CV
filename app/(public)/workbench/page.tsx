import { WorkbenchPageContent } from "@/components/public/workbench/workbench-page-content";
import { getGithubWipItems, getGithubRecentActivity } from "@/lib/github";
import { Suspense } from "react";
import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://thanatphong.vercel.app';

export const metadata: Metadata = {
  title: "Workbench",
  description: "Active experiments, prototypes, and work in progress. A peek into the digital workshop where ideas take shape.",
  keywords: ["experiments", "prototypes", "work in progress", "playground", "dev tools"],
  openGraph: {
    title: "Workbench — WinTuner",
    description: "Active experiments, prototypes, and work in progress.",
    url: `${baseUrl}/workbench`,
    type: "website",
    images: [
      {
        url: `${baseUrl}/og-image-workbench.png`,
        width: 1200,
        height: 630,
        alt: "WinTuner Workbench",
      },
    ],
  },
  alternates: {
    canonical: `${baseUrl}/workbench`,
  },
};

async function WorkbenchList() {
  const [wipItems, recentActivity] = await Promise.all([
    getGithubWipItems(),
    getGithubRecentActivity()
  ]);

  return <WorkbenchPageContent wipItems={wipItems} recentActivity={recentActivity} />;
}

function WorkbenchSkeleton() {
  return (
    <section className="px-4 sm:px-6 py-12 sm:py-20">
      <div className="mx-auto max-w-7xl animate-pulse">
        {/* Skeleton Hero */}
        <div className="mb-12 sm:mb-16 space-y-4">
          <div className="h-4 w-24 bg-muted rounded-md" />
          <div className="h-10 sm:h-12 w-2/3 max-w-lg bg-muted rounded-md" />
          <div className="h-6 w-full max-w-xl bg-muted rounded-md" />
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Dashboard console skeleton */}
          <div className="lg:col-span-2 h-96 bg-muted/50 rounded-xl" />
          {/* Side panel skeleton */}
          <div className="space-y-6">
            <div className="h-32 bg-muted/40 rounded-xl" />
            <div className="h-64 bg-muted/40 rounded-xl" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function WorkbenchPage() {
  return (
    <div className="pt-24">
      <Suspense fallback={<WorkbenchSkeleton />}>
        <WorkbenchList />
      </Suspense>
    </div>
  );
}

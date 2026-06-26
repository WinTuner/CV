import { WorkbenchPageContent } from "@/components/public/workbench/workbench-page-content";
import { getGithubWipItems, getGithubRecentActivity } from "@/lib/github";
import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://eindev.ir';

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

export default async function WorkbenchPage() {
  const wipItems = await getGithubWipItems();
  const recentActivity = await getGithubRecentActivity();

  return (
    <div className="pt-24">
      <WorkbenchPageContent wipItems={wipItems} recentActivity={recentActivity} />
    </div>
  );
}

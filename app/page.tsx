import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { SkillsMatrix } from "@/components/skills-matrix"
import { ProjectsGrid } from "@/components/projects-grid"
import { Workbench } from "@/components/workbench"
import { getGithubRepos, getGithubWipItems } from "@/lib/github"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { CursorGlow } from "@/components/cursor-glow"
import { generateWebsiteStructuredData, generatePersonStructuredData } from "@/lib/structured-data"

export default async function Home() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://eindev.ir'
  const websiteStructuredData = generateWebsiteStructuredData(baseUrl)
  const personStructuredData = generatePersonStructuredData()

  const [projects, wipItems] = await Promise.all([
    getGithubRepos(),
    getGithubWipItems()
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personStructuredData) }}
      />
      <main className="relative min-h-screen overflow-hidden scanlines">
        <CursorGlow />
        <div className="relative z-10">
          <Header />
          <HeroSection />
          <SkillsMatrix />
          <ProjectsGrid projects={projects} />
          <Workbench wipItems={wipItems} />
          <ContactSection />
          <Footer />
        </div>
      </main>
    </>
  )
}

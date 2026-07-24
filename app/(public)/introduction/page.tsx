import { IntroductionContent } from "@/components/public/introduction/introduction-content"
import type { Metadata } from "next"

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://thanatphong.vercel.app'

export const metadata: Metadata = {
  title: "Resume & Introduction",
  description: "Detailed background, qualifications, certifications, achievements, and working experiments of Thanatphong Tarin.",
  openGraph: {
    title: "Resume & Introduction — WinTuner",
    description: "Detailed background, qualifications, certifications, achievements, and working experiments of Thanatphong Tarin.",
    url: `${baseUrl}/introduction`,
    type: "profile",
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Thanatphong Tarin profile page",
      },
    ],
  },
  alternates: {
    canonical: `${baseUrl}/introduction`,
  },
}

export default function IntroductionPage() {
  return (
    <div className="pt-24">
      <IntroductionContent />
    </div>
  )
}

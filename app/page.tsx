import Navbar from "@/components/navbar"
import HeroSection from "@/components/hero-section"
import IconBoxes from "@/components/icon-boxes"
import ParticipationBanner from "@/components/participation-banner"
import AboutSection from "@/components/about-section"
import HowToSection from "@/components/how-to-section"
import TracksSection from "@/components/tracks-section"
import PrizesSection from "@/components/prizes-section"
import TimelineSection from "@/components/timeline-section"
import SponsorsSection from "@/components/sponsors-section"
import FAQSection from "@/components/faq-section"
import Footer from "@/components/footer"
import FloatingArrow from "@/components/floating-arrow"

export default function Home() {
  return (
    <main className="bg-black min-h-screen overflow-x-hidden relative">
      {/* Fondo con textura sutil */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              radial-gradient(circle at 1px 1px, rgba(170, 255, 0, 0.08) 1px, transparent 1px),
              linear-gradient(45deg, rgba(170, 255, 0, 0.02) 25%, transparent 25%),
              linear-gradient(-45deg, rgba(170, 255, 0, 0.02) 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, rgba(170, 255, 0, 0.02) 75%),
              linear-gradient(-45deg, transparent 75%, rgba(170, 255, 0, 0.02) 75%)
            `,
            backgroundSize: '50px 50px, 100px 100px, 100px 100px, 100px 100px, 100px 100px',
            backgroundPosition: '0 0, 0 0, 10px 10px, 10px 10px, 0 0',
            opacity: 1,
          }}
        />
      </div>

      <div className="relative z-10">
        <FloatingArrow />
        <Navbar />
        <HeroSection />
        <IconBoxes />
        <AboutSection />
        <ParticipationBanner />
        <HowToSection />
        <TracksSection />
        <PrizesSection />
        <TimelineSection />
        <SponsorsSection />
        <FAQSection />
        <Footer />
      </div>
    </main>
  )
}

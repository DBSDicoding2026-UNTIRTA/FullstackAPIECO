import Link from "next/link";

import CtaSection from "@/components/landing/CtaSection";
import DashboardPreview from "@/components/landing/DashboardPreview";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import AppLogo from "@/components/shared/AppLogo";
import Container from "@/components/shared/Container";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-linear-to-br from-white via-emerald-50 to-lime-50">
      <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur-sm">
        <Container className="flex items-center justify-between py-4">
          <AppLogo />
          <Link
            href="/login"
            className="rounded-xl bg-linear-to-r from-emerald-600 to-lime-500 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Masuk
          </Link>
        </Container>
      </header>

      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <DashboardPreview />
      <CtaSection />
    </main>
  );
}

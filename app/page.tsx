import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import DemoPreviewSection from '@/components/landing/DemoPreviewSection';
import ImpactStatsSection from '@/components/landing/ImpactStatsSection';
import LeaderboardPreview from '@/components/landing/LeaderboardPreview';
import TeamSection from '@/components/landing/TeamSection';
import FinalCtaSection from '@/components/landing/FinalCtaSection';
import Footer from '@/components/landing/Footer';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { getGlobalSettingsForSession } from '@/lib/settings/server';
import { translate } from '@/lib/i18n/dictionaries';

export const metadata = {
  title: 'Pilah Yuk!! - Platform Gamifikasi Daur Ulang dengan AI',
  description:
    'Upload foto sampah, AI akan mengenalinya, dan kumpulkan poin serta badge. Bergabunglah dengan komunitas pengguna yang membantu lingkungan.',
  keywords:
    'sampah, daur ulang, AI, klasifikasi sampah, gamifikasi, poin, badge, leaderboard',
  author: 'Pilah Yuk!!',
  openGraph: {
    title: 'Pilah Yuk!! - Daur Ulang Jadi Lebih Menyenangkan',
    description: 'Platform gamifikasi daur ulang berbasis AI untuk masyarakat Indonesia',
    type: 'website',
  },
};

export default async function Home() {
  const session = await getServerSession(authOptions);
  const settings = await getGlobalSettingsForSession(session);
  const t = (key: Parameters<typeof translate>[1], values?: Record<string, string | number>) =>
    translate(settings.preferences.language, key, values);

  const ctaLabel = session ? t('nav.dashboard') : t('common.login');
  const ctaHref = session ? (session.user?.role === 'ADMIN' ? '/admin' : '/dashboard') : '/login';

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      <Navbar ctaLabel={ctaLabel} ctaHref={ctaHref} />
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <DemoPreviewSection />
      <ImpactStatsSection />
      <LeaderboardPreview />
      <TeamSection />
      <FinalCtaSection />
      <Footer />
    </main>
  );
}

import Navbar from '@/components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
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
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_26%),radial-gradient(circle_at_top_right,rgba(132,204,22,0.12),transparent_22%),linear-gradient(to_bottom,#f8fafc,#ffffff_28%,#f7fef9_68%,#ffffff)] text-slate-950 dark:bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_24%),radial-gradient(circle_at_top_right,rgba(132,204,22,0.12),transparent_20%),linear-gradient(to_bottom,#020617,#07111c_36%,#020617)] dark:text-slate-100">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-24 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl dark:bg-emerald-500/10" />
        <div className="absolute -right-24 top-36 h-80 w-80 rounded-full bg-lime-300/20 blur-3xl dark:bg-lime-500/10" />
        <div className="absolute -bottom-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-200/30 blur-3xl dark:bg-emerald-900/20" />
      </div>

      <Navbar ctaLabel={ctaLabel} ctaHref={ctaHref} />
      <HeroSection ctaLabel={ctaLabel} ctaHref={ctaHref} />
      <HowItWorksSection />
      <DemoPreviewSection />
      <ImpactStatsSection />
      <LeaderboardPreview />
      <TeamSection />
      <FinalCtaSection ctaLabel={ctaLabel} ctaHref={ctaHref} />
      <Footer />
    </main>
  );
}

'use client';

import Link from 'next/link';
import { useSettings } from '@/hooks/use-settings';

export default function Footer() {
  const { t } = useSettings();
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    [t('landing.footer.section.product')]: [
      { label: t('landing.footer.link.features'), href: '#features' },
      { label: t('landing.footer.link.pricing'), href: '#pricing' },
      { label: t('landing.footer.link.security'), href: '#security' },
      { label: t('landing.footer.link.roadmap'), href: '#roadmap' },
    ],
    [t('landing.footer.section.company')]: [
      { label: t('landing.footer.link.about'), href: '#about' },
      { label: t('landing.footer.link.blog'), href: '#blog' },
      { label: t('landing.footer.link.careers'), href: '#careers' },
      { label: t('landing.footer.link.contact'), href: '#contact' },
    ],
    [t('landing.footer.section.legal')]: [
      { label: t('landing.footer.link.privacy'), href: '#privacy' },
      { label: t('landing.footer.link.terms'), href: '#terms' },
      { label: t('landing.footer.link.cookies'), href: '#cookies' },
      { label: t('landing.footer.link.gdpr'), href: '#gdpr' },
    ],
  };

  const socialLinks = [
    { icon: '📱', label: 'Instagram', href: '#' },
    { icon: '🐦', label: 'Twitter', href: '#' },
    { icon: '💼', label: 'LinkedIn', href: '#' },
    { icon: '📧', label: 'Email', href: '#' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-16 md:py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12">
          {/* Brand section */}
          <div className="lg:col-span-1">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent mb-4 inline-block">
              Pilah Yuk!!
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              {t('landing.footer.tagline')}
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-emerald-500/20 border border-gray-700 hover:border-emerald-500/50 flex items-center justify-center text-lg transition-all duration-200"
                  title={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links sections */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-white mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-emerald-400 transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800" />

        {/* Bottom section */}
        <div className="py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm text-center md:text-left">
            © {currentYear} Pilah Yuk!!. {t('landing.footer.copyright')}
          </p>

          <div className="flex items-center gap-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
              {t('landing.footer.status')}
            </a>
            <div className="w-1 h-1 rounded-full bg-gray-700" />
            <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
              {t('landing.footer.contactUs')}
            </a>
            <div className="w-1 h-1 rounded-full bg-gray-700" />
            <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
              {t('landing.footer.feedback')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

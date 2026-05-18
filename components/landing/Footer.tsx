'use client';

import Link from 'next/link';
import { ExternalLink, Globe, Mail, SendHorizontal } from 'lucide-react';
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
    { icon: Globe, label: 'Website', href: '#' },
    { icon: Mail, label: 'Email', href: 'mailto:pilahyuk@example.com' },
    { icon: SendHorizontal, label: 'Contact', href: '#' },
    { icon: ExternalLink, label: 'External Link', href: '#' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-16 md:py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12">
          {/* Brand section */}
          <div className="lg:col-span-1">
            <Link href="/" className="mb-4 inline-block bg-linear-to-r from-emerald-400 to-teal-500 bg-clip-text text-2xl font-bold text-transparent">
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
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 transition-all duration-200 hover:border-emerald-500/50 hover:bg-emerald-500/20"
                  title={social.label}
                >
                  <social.icon className="h-4 w-4" />
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

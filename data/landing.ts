import {
  HowItWorksStep,
  Feature,
  LeaderboardUser,
  ImpactStat,
  FloatingIconConfig,
} from '@/types/landing';

export const howItWorksSteps: HowItWorksStep[] = [
  {
    id: 1,
    titleKey: 'landing.how.step1.title',
    descriptionKey: 'landing.how.step1.description',
    icon: '📸',
  },
  {
    id: 2,
    titleKey: 'landing.how.step2.title',
    descriptionKey: 'landing.how.step2.description',
    icon: '🤖',
  },
  {
    id: 3,
    titleKey: 'landing.how.step3.title',
    descriptionKey: 'landing.how.step3.description',
    icon: '⭐',
  },
  {
    id: 4,
    titleKey: 'landing.how.step4.title',
    descriptionKey: 'landing.how.step4.description',
    icon: '🏆',
  },
];

export const features: Feature[] = [
  {
    id: 1,
    titleKey: 'landing.features.item1.title',
    descriptionKey: 'landing.features.item1.description',
    icon: '🧠',
    color: 'from-emerald-400 to-teal-500',
  },
  {
    id: 2,
    titleKey: 'landing.features.item2.title',
    descriptionKey: 'landing.features.item2.description',
    icon: '💰',
    color: 'from-amber-400 to-orange-500',
  },
  {
    id: 3,
    titleKey: 'landing.features.item3.title',
    descriptionKey: 'landing.features.item3.description',
    icon: '🎖️',
    color: 'from-pink-400 to-rose-500',
  },
  {
    id: 4,
    titleKey: 'landing.features.item4.title',
    descriptionKey: 'landing.features.item4.description',
    icon: '📊',
    color: 'from-blue-400 to-cyan-500',
  },
  {
    id: 5,
    titleKey: 'landing.features.item5.title',
    descriptionKey: 'landing.features.item5.description',
    icon: '🌍',
    color: 'from-green-400 to-lime-500',
  },
  {
    id: 6,
    titleKey: 'landing.features.item6.title',
    descriptionKey: 'landing.features.item6.description',
    icon: '📝',
    color: 'from-purple-400 to-indigo-500',
  },
];

export const leaderboardUsers: LeaderboardUser[] = [
  {
    id: 1,
    rank: 1,
    name: 'Dafa Rizqy',
    points: 3250,
    avatar: '👨‍💼',
  },
  {
    id: 2,
    rank: 2,
    name: 'Sarah Putri',
    points: 2870,
    avatar: '👩‍💻',
  },
  {
    id: 3,
    rank: 3,
    name: 'Lutfi Rahman',
    points: 2450,
    avatar: '👨‍🎓',
  },
];

export const impactStats: ImpactStat[] = [
  {
    id: 1,
    labelKey: 'landing.stats.item1.label',
    value: 1200,
    suffix: '+',
    icon: '🗑️',
    color: 'from-emerald-400 to-teal-500',
  },
  {
    id: 2,
    labelKey: 'landing.stats.item2.label',
    value: 850,
    suffix: '+',
    icon: '🍾',
    color: 'from-blue-400 to-cyan-500',
  },
  {
    id: 3,
    labelKey: 'landing.stats.item3.label',
    value: 320,
    suffix: '+',
    icon: '👥',
    color: 'from-orange-400 to-red-500',
  },
  {
    id: 4,
    labelKey: 'landing.stats.item4.label',
    value: 5,
    suffix: '',
    icon: '📦',
    color: 'from-purple-400 to-pink-500',
  },
];

export const floatingIcons: FloatingIconConfig[] = [
  {
    id: 'bottle',
    icon: '🍾',
    delay: 0,
    duration: 4,
    x: -80,
    y: -60,
  },
  {
    id: 'leaf',
    icon: '🍃',
    delay: 0.5,
    duration: 5,
    x: 120,
    y: -100,
  },
  {
    id: 'recycle',
    icon: '♻️',
    delay: 1,
    duration: 4.5,
    x: -120,
    y: 100,
  },
  {
    id: 'camera',
    icon: '📷',
    delay: 1.5,
    duration: 5.5,
    x: 100,
    y: 80,
  },
  {
    id: 'sparkles',
    icon: '✨',
    delay: 2,
    duration: 6,
    x: -60,
    y: 60,
  },
];

export const LOGIN_BENEFITS = [
  { id: 'benefit-1', textKey: 'auth.login.highlight.ai' },
  { id: 'benefit-2', textKey: 'auth.login.highlight.points' },
  { id: 'benefit-3', textKey: 'dashboard.subtitle' },
] as const;

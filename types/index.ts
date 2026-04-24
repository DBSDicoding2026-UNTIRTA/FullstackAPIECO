export interface SectionHeaderContent {
  readonly title: string;
  readonly description: string;
}

export interface HeroHighlightItem {
  readonly id: string;
  readonly value: string;
  readonly label: string;
}

export interface HowItWorksItem {
  readonly id: string;
  readonly step: number;
  readonly title: string;
  readonly description: string;
  readonly accent: "emerald" | "sky" | "amber" | "violet";
}

export interface FeatureItem {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly icon: string;
}

export interface PreviewStatItem {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly detail: string;
}

export interface LoginBenefitItem {
  readonly id: string;
  readonly text: string;
}

export interface DashboardUser {
  readonly name: string;
  readonly points: number;
  readonly level: number;
  readonly recycledItems: number;
  readonly activeBadge: string;
}

export interface DashboardStatItem {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly caption: string;
  readonly icon: string;
  readonly tone: "emerald" | "sky" | "amber" | "violet";
}

export interface LeaderboardEntry {
  readonly id: string;
  readonly rank: number;
  readonly name: string;
  readonly points: number;
  readonly isCurrentUser?: boolean;
}

export interface ChallengeItem {
  readonly id: string;
  readonly title: string;
  readonly current: number;
  readonly target: number;
  readonly icon: string;
}

export interface UserBadge {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly icon: string;
  readonly unlocked: boolean;
}

export type AdminQuizAnswer = "A" | "B" | "C" | "D";

export type AdminQuizModule = {
  id: string;
  title: string;
  description: string | null;
  order: number;
  xpReward: number;
  isActive: boolean;
  questionCount: number;
  createdAt?: string;
  updatedAt?: string;
};

export type AdminQuizRecord = {
  id: string;
  moduleId: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: AdminQuizAnswer;
  points: number;
  createdAt: string;
  updatedAt: string;
  module: {
    id: string;
    title: string;
    order: number;
  };
};

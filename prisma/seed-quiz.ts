import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";
import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

type QuizSeedItem = {
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: "A" | "B" | "C" | "D";
  points: number;
  moduleTitle: string;
};

const moduleSeeds = [
  {
    title: "Modul 1: Dasar Pemilahan Sampah",
    description: "Pengenalan kategori dasar sebelum masuk ke klasifikasi yang lebih spesifik.",
    order: 1,
    xpReward: 50,
    isActive: true,
  },
  {
    title: "Modul 2: Sampah Plastik",
    description: "Kenali jenis-jenis sampah plastik yang sering ditemui sehari-hari.",
    order: 2,
    xpReward: 60,
    isActive: true,
  },
  {
    title: "Modul 3: Sampah Kertas",
    description: "Latihan membedakan limbah berbasis kertas dan turunannya.",
    order: 3,
    xpReward: 55,
    isActive: true,
  },
  {
    title: "Modul 4: Sampah Organik",
    description: "Soal seputar sampah yang mudah terurai secara alami.",
    order: 4,
    xpReward: 45,
    isActive: true,
  },
  {
    title: "Modul 5: Sampah Kaca dan Logam",
    description: "Identifikasi sampah kaca, logam, dan material sejenis.",
    order: 5,
    xpReward: 70,
    isActive: true,
  },
] as const;

const quizSeeds: QuizSeedItem[] = [
  {
    question: "Botol plastik termasuk jenis sampah apa?",
    optionA: "Organik",
    optionB: "Plastik",
    optionC: "Kaca",
    optionD: "Logam",
    correctAnswer: "B",
    points: 10,
    moduleTitle: "Modul 1: Dasar Pemilahan Sampah",
  },
  {
    question: "Kertas bekas termasuk kategori sampah apa?",
    optionA: "Kertas",
    optionB: "Plastik",
    optionC: "Organik",
    optionD: "Logam",
    correctAnswer: "A",
    points: 8,
    moduleTitle: "Modul 1: Dasar Pemilahan Sampah",
  },
  {
    question: "Kulit buah termasuk jenis sampah apa?",
    optionA: "Plastik",
    optionB: "Kaca",
    optionC: "Organik",
    optionD: "Logam",
    correctAnswer: "C",
    points: 5,
    moduleTitle: "Modul 1: Dasar Pemilahan Sampah",
  },
  {
    question: "Kaleng minuman termasuk jenis sampah apa?",
    optionA: "Kaca",
    optionB: "Logam",
    optionC: "Organik",
    optionD: "Kertas",
    correctAnswer: "B",
    points: 12,
    moduleTitle: "Modul 1: Dasar Pemilahan Sampah",
  },
  {
    question: "Botol kaca termasuk kategori apa?",
    optionA: "Plastik",
    optionB: "Kaca",
    optionC: "Logam",
    optionD: "Organik",
    correctAnswer: "B",
    points: 10,
    moduleTitle: "Modul 1: Dasar Pemilahan Sampah",
  },
  {
    question: "Sisa makanan termasuk jenis sampah apa?",
    optionA: "Organik",
    optionB: "Plastik",
    optionC: "Kertas",
    optionD: "Logam",
    correctAnswer: "A",
    points: 5,
    moduleTitle: "Modul 4: Sampah Organik",
  },
  {
    question: "Kardus bekas termasuk jenis apa?",
    optionA: "Kertas",
    optionB: "Plastik",
    optionC: "Logam",
    optionD: "Organik",
    correctAnswer: "A",
    points: 8,
    moduleTitle: "Modul 3: Sampah Kertas",
  },
  {
    question: "Sedotan plastik termasuk kategori apa?",
    optionA: "Kaca",
    optionB: "Plastik",
    optionC: "Organik",
    optionD: "Logam",
    correctAnswer: "B",
    points: 10,
    moduleTitle: "Modul 2: Sampah Plastik",
  },
  {
    question: "Daun kering termasuk jenis sampah apa?",
    optionA: "Organik",
    optionB: "Plastik",
    optionC: "Kaca",
    optionD: "Logam",
    correctAnswer: "A",
    points: 5,
    moduleTitle: "Modul 4: Sampah Organik",
  },
  {
    question: "Majalah bekas termasuk jenis sampah apa?",
    optionA: "Kertas",
    optionB: "Plastik",
    optionC: "Organik",
    optionD: "Logam",
    correctAnswer: "A",
    points: 8,
    moduleTitle: "Modul 3: Sampah Kertas",
  },
  {
    question: "Botol shampoo kosong termasuk jenis apa?",
    optionA: "Organik",
    optionB: "Plastik",
    optionC: "Kaca",
    optionD: "Logam",
    correctAnswer: "B",
    points: 10,
    moduleTitle: "Modul 2: Sampah Plastik",
  },
  {
    question: "Pecahan kaca termasuk kategori apa?",
    optionA: "Plastik",
    optionB: "Logam",
    optionC: "Kaca",
    optionD: "Organik",
    correctAnswer: "C",
    points: 10,
    moduleTitle: "Modul 5: Sampah Kaca dan Logam",
  },
  {
    question: "Sendok plastik termasuk jenis apa?",
    optionA: "Plastik",
    optionB: "Logam",
    optionC: "Organik",
    optionD: "Kertas",
    correctAnswer: "A",
    points: 10,
    moduleTitle: "Modul 2: Sampah Plastik",
  },
  {
    question: "Aluminium foil termasuk jenis apa?",
    optionA: "Kertas",
    optionB: "Logam",
    optionC: "Plastik",
    optionD: "Organik",
    correctAnswer: "B",
    points: 12,
    moduleTitle: "Modul 5: Sampah Kaca dan Logam",
  },
  {
    question: "Tisu bekas termasuk jenis apa?",
    optionA: "Kertas",
    optionB: "Organik",
    optionC: "Plastik",
    optionD: "Logam",
    correctAnswer: "B",
    points: 6,
    moduleTitle: "Modul 3: Sampah Kertas",
  },
  {
    question: "Kotak pizza berminyak termasuk apa?",
    optionA: "Kertas",
    optionB: "Organik",
    optionC: "Plastik",
    optionD: "Logam",
    correctAnswer: "B",
    points: 7,
    moduleTitle: "Modul 3: Sampah Kertas",
  },
  {
    question: "Botol air mineral kosong termasuk?",
    optionA: "Kaca",
    optionB: "Plastik",
    optionC: "Logam",
    optionD: "Organik",
    correctAnswer: "B",
    points: 10,
    moduleTitle: "Modul 2: Sampah Plastik",
  },
  {
    question: "Koran bekas termasuk jenis apa?",
    optionA: "Kertas",
    optionB: "Plastik",
    optionC: "Organik",
    optionD: "Logam",
    correctAnswer: "A",
    points: 8,
    moduleTitle: "Modul 3: Sampah Kertas",
  },
  {
    question: "Kaleng susu termasuk kategori apa?",
    optionA: "Plastik",
    optionB: "Logam",
    optionC: "Kaca",
    optionD: "Organik",
    correctAnswer: "B",
    points: 12,
    moduleTitle: "Modul 5: Sampah Kaca dan Logam",
  },
  {
    question: "Kulit telur termasuk jenis apa?",
    optionA: "Organik",
    optionB: "Kaca",
    optionC: "Plastik",
    optionD: "Logam",
    correctAnswer: "A",
    points: 5,
    moduleTitle: "Modul 4: Sampah Organik",
  },
  {
    question: "Bungkus snack plastik termasuk?",
    optionA: "Plastik",
    optionB: "Kertas",
    optionC: "Organik",
    optionD: "Logam",
    correctAnswer: "A",
    points: 10,
    moduleTitle: "Modul 2: Sampah Plastik",
  },
  {
    question: "Botol parfum kaca termasuk?",
    optionA: "Kaca",
    optionB: "Plastik",
    optionC: "Logam",
    optionD: "Organik",
    correctAnswer: "A",
    points: 10,
    moduleTitle: "Modul 5: Sampah Kaca dan Logam",
  },
  {
    question: "Daun pisang bekas termasuk?",
    optionA: "Organik",
    optionB: "Plastik",
    optionC: "Kertas",
    optionD: "Logam",
    correctAnswer: "A",
    points: 5,
    moduleTitle: "Modul 4: Sampah Organik",
  },
  {
    question: "Kabel listrik bekas termasuk?",
    optionA: "Plastik",
    optionB: "Logam",
    optionC: "Organik",
    optionD: "Kertas",
    correctAnswer: "B",
    points: 12,
    moduleTitle: "Modul 5: Sampah Kaca dan Logam",
  },
  {
    question: "Kemasan susu karton termasuk?",
    optionA: "Kertas",
    optionB: "Plastik",
    optionC: "Logam",
    optionD: "Organik",
    correctAnswer: "A",
    points: 8,
    moduleTitle: "Modul 3: Sampah Kertas",
  },
];

export async function seedQuiz(): Promise<void> {
  await prisma.quizQuestion.deleteMany({});

  for (const moduleSeed of moduleSeeds) {
    await prisma.quizModule.upsert({
      where: {
        title: moduleSeed.title,
      },
      update: {
        description: moduleSeed.description,
        order: moduleSeed.order,
        xpReward: moduleSeed.xpReward,
        isActive: moduleSeed.isActive,
      },
      create: {
        title: moduleSeed.title,
        description: moduleSeed.description,
        order: moduleSeed.order,
        xpReward: moduleSeed.xpReward,
        isActive: moduleSeed.isActive,
      },
    });
  }

  const modules = await prisma.quizModule.findMany({
    select: {
      id: true,
      title: true,
    },
  });

  const moduleByTitle = new Map(
    modules.map((moduleRecord) => [moduleRecord.title, moduleRecord.id])
  );

  await prisma.quizQuestion.createMany({
    data: quizSeeds.map((quizSeed) => {
      const moduleId = moduleByTitle.get(quizSeed.moduleTitle);

      if (!moduleId) {
        throw new Error(`Module not found for seed: ${quizSeed.moduleTitle}`);
      }

      return {
        question: quizSeed.question,
        optionA: quizSeed.optionA,
        optionB: quizSeed.optionB,
        optionC: quizSeed.optionC,
        optionD: quizSeed.optionD,
        correctAnswer: quizSeed.correctAnswer,
        points: quizSeed.points,
        moduleId,
      };
    }),
  });

  console.log("✅ Quiz seeded");
}
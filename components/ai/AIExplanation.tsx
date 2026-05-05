"use client";

import React from "react";
import { Lightbulb, Zap } from "lucide-react";

interface AIExplanationProps {
  result: string;
}

const WASTE_EXPLANATIONS: Record<
  string,
  {
    uses: string[];
    steps: string[];
  }
> = {
  Plastik: {
    uses: [
      "Bisa didaur ulang menjadi botol baru",
      "Bisa dijadikan kerajinan tangan",
      "Bisa digunakan ulang sebagai wadah",
    ],
    steps: [
      "Upload atau ambil foto sampah plastik",
      "Klik tombol 'Analisis' untuk memulai",
      "Lihat hasil dan pelajari cara pengelolaan",
    ],
  },
  Kertas: {
    uses: [
      "Dapat didaur ulang menjadi kertas baru",
      "Bisa digunakan untuk kompos",
      "Dapat dipulping untuk membuat karton",
    ],
    steps: [
      "Upload atau ambil foto sampah kertas",
      "Klik tombol 'Analisis' untuk memulai",
      "Lihat hasil dan pelajari cara pengelolaan",
    ],
  },
  Logam: {
    uses: [
      "Sangat berharga untuk didaur ulang",
      "Dapat dijual ke pengumpul logam",
      "Dapat dilebur dan dibentuk ulang",
    ],
    steps: [
      "Upload atau ambil foto sampah logam",
      "Klik tombol 'Analisis' untuk memulai",
      "Lihat hasil dan pelajari cara pengelolaan",
    ],
  },
  Kaca: {
    uses: [
      "Dapat didaur ulang tanpa batas",
      "Bisa dibuat botol atau wadah baru",
      "Dapat digunakan dalam industri konstruksi",
    ],
    steps: [
      "Upload atau ambil foto sampah kaca",
      "Klik tombol 'Analisis' untuk memulai",
      "Lihat hasil dan pelajari cara pengelolaan",
    ],
  },
  "Sampah Organik": {
    uses: [
      "Dapat dibuat kompos untuk tanaman",
      "Dapat diolah menjadi pupuk organik",
      "Dapat didaur ulang melalui pengomposan",
    ],
    steps: [
      "Upload atau ambil foto sampah organik",
      "Klik tombol 'Analisis' untuk memulai",
      "Lihat hasil dan pelajari cara pengelolaan",
    ],
  },
};

export default function AIExplanation({ result }: AIExplanationProps) {
  const explanation = WASTE_EXPLANATIONS[result] || {
    uses: [
      "Pertahankan dalam kondisi bersih",
      "Pisahkan dari sampah lainnya",
      "Bawa ke tempat pengumpulan sampah yang sesuai",
    ],
    steps: [
      "Upload atau ambil foto sampah",
      "Klik tombol 'Analisis' untuk memulai",
      "Lihat hasil dan pelajari cara pengelolaan",
    ],
  };

  return (
    <div className="w-full space-y-6">
      {/* Section 1: Uses */}
      <div className="space-y-3 rounded-3xl border-2 border-emerald-100 bg-gradient-to-br from-emerald-50/80 to-white p-6 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-emerald-100 p-3">
            <Lightbulb className="h-5 w-5 text-emerald-600" />
          </div>
          <h3 className="text-lg font-black text-emerald-900">
            Apa Kegunaan Sampah Ini?
          </h3>
        </div>

        <ul className="space-y-2">
          {explanation.uses.map((use, idx) => (
            <li
              key={idx}
              className="flex gap-3 rounded-xl bg-white p-3 text-sm"
            >
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-600">
                {idx + 1}
              </span>
              <span className="text-slate-700">{use}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Section 2: How to Use */}
      <div className="space-y-3 rounded-3xl border-2 border-blue-100 bg-gradient-to-br from-blue-50/80 to-white p-6 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-blue-100 p-3">
            <Zap className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-black text-blue-900">
            Cara Menggunakan AI Ini
          </h3>
        </div>

        <ul className="space-y-2">
          {explanation.steps.map((step, idx) => (
            <li
              key={idx}
              className="flex gap-3 rounded-xl bg-white p-3 text-sm"
            >
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">
                {idx + 1}
              </span>
              <span className="text-slate-700">{step}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}


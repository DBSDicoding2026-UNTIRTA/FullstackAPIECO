"use client";

import React from "react";
import { CheckCircle } from "lucide-react";

interface AIResultCardProps {
  result: string;
  confidence: number;
}

export function AIResultCard({ result, confidence }: AIResultCardProps) {
  const confidencePercent = Math.round(confidence * 100);

  return (
    <div className="w-full space-y-4 rounded-3xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-emerald-100 p-3">
          <CheckCircle className="h-6 w-6 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-xl font-black text-emerald-900">
            Hasil Analisis
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Gambar berhasil dianalisis
          </p>
        </div>
      </div>

      {/* Result */}
      <div className="space-y-3 rounded-2xl bg-white p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-600">Jenis Sampah</span>
          <span className="text-2xl font-black text-emerald-600">{result}</span>
        </div>
      </div>

      {/* Confidence */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-600">
            Akurasi Analisis
          </span>
          <span className="text-lg font-black text-emerald-600">
            {confidencePercent}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500"
            style={{ width: `${confidencePercent}%` }}
          />
        </div>
      </div>

      {/* Confidence Level */}
      <div className="rounded-xl bg-emerald-50 px-3 py-2 text-center">
        <p className="text-xs font-semibold text-emerald-700">
          {confidencePercent >= 90
            ? "Sangat Yakin"
            : confidencePercent >= 70
              ? "Yakin"
              : "Kurang Yakin"}
        </p>
      </div>
    </div>
  );
}

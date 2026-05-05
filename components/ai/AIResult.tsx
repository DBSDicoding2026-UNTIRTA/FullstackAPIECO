"use client";

import React from "react";
import { CheckCircle } from "lucide-react";

interface AIResultProps {
  label: string;
  confidence: number;
}

export default function AIResult({ label, confidence }: AIResultProps) {
  const confidencePercent = Math.round(confidence * 100);

  const getConfidenceLevel = () => {
    if (confidencePercent >= 85) return "Sangat Yakin";
    if (confidencePercent >= 70) return "Yakin";
    return "Kurang Yakin";
  };

  return (
    <div className="space-y-4 rounded-3xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-emerald-100 p-3">
          <CheckCircle className="h-6 w-6 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-emerald-900">
            {label}
          </h2>
          <p className="text-sm text-slate-600">
            Hasil analisis AI berhasil
          </p>
        </div>
      </div>

      {/* Confidence Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-600">
            Akurasi
          </span>
          <span className="text-xl font-black text-emerald-600">
            {confidencePercent}%
          </span>
        </div>

        <div className="h-4 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500"
            style={{ width: `${confidencePercent}%` }}
          />
        </div>
      </div>

      {/* Confidence Level */}
      <div className="rounded-xl bg-emerald-100 px-4 py-2 text-center">
        <p className="font-semibold text-emerald-700">
          {getConfidenceLevel()}
        </p>
      </div>
    </div>
  );
}


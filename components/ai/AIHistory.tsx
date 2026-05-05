"use client";

import React, { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface HistoryItem {
  id: string;
  result: string;
  confidence: number;
  createdAt: string;
}

interface AIHistoryProps {
  refreshTrigger?: number;
}

export default function AIHistory({ refreshTrigger = 0 }: AIHistoryProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/history?limit=10");
      if (res.ok) {
        const data = await res.json();
        setHistory(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [refreshTrigger]);

  if (loading && history.length === 0) {
    return (
      <div className="text-center">
        <p className="text-sm text-slate-600">Memuat riwayat...</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center">
        <p className="text-sm text-slate-600">
          Belum ada riwayat analisis. Mulai analisis sekarang!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5 text-emerald-600" />
        <h3 className="font-black text-slate-900">Riwayat Analisis</h3>
      </div>

      <div className="space-y-2">
        {history.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-white p-4 transition hover:border-emerald-300"
          >
            <div className="space-y-1">
              <p className="font-semibold text-slate-900">{item.result}</p>
              <p className="text-xs text-slate-500">
                {new Date(item.createdAt).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div className="rounded-xl bg-emerald-100 px-3 py-1">
              <p className="text-sm font-bold text-emerald-700">
                {Math.round(item.confidence * 100)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


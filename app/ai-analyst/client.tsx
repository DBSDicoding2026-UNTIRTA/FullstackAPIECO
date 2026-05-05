"use client";

import Image from "next/image";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  Clock3,
  CloudUpload,
  Cpu,
  ImagePlus,
  Loader2,
  ScanSearch,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type WasteLabel = "plastik" | "kertas" | "kaca" | "logam" | "organik";

interface AIAnalysisHistoryItem {
  id: string;
  imageUrl: string;
  result: string;
  confidence: number;
  createdAt: string;
}

interface AIAnalysisState {
  label: WasteLabel;
  confidence: number;
}

const WASTE_LABELS: Record<WasteLabel, string> = {
  plastik: "Plastik",
  kertas: "Kertas",
  kaca: "Kaca",
  logam: "Logam",
  organik: "Organik",
};

const WASTE_GUIDES: Record<WasteLabel, { uses: string[]; summary: string }> = {
  plastik: {
    uses: [
      "Dapat didaur ulang menjadi botol baru",
      "Bisa dijadikan kerajinan ramah lingkungan",
      "Cocok dijadikan ecobrick untuk proyek hijau",
    ],
    summary:
      "Plastik yang bersih punya nilai guna tinggi jika dipilah dan dikirim ke proses daur ulang.",
  },
  kertas: {
    uses: [
      "Dapat menjadi kertas daur ulang",
      "Bisa diolah menjadi kompos kertas",
      "Cocok untuk kerajinan dan produk kreatif",
    ],
    summary:
      "Kertas yang kering dan bersih mudah masuk ke rantai daur ulang berikutnya.",
  },
  kaca: {
    uses: [
      "Dapat dilebur ulang menjadi kaca baru",
      "Bisa dibuat botol baru atau wadah dekoratif",
      "Mendukung material bangunan dan dekorasi",
    ],
    summary:
      "Kaca dapat diproses ulang berulang kali jika dipilah secara aman dan tidak tercampur bahan lain.",
  },
  logam: {
    uses: [
      "Dapat dilebur ulang menjadi material baru",
      "Bisa dimanfaatkan sebagai kaleng daur ulang",
      "Berpotensi bernilai ekonomi di bank sampah",
    ],
    summary:
      "Logam biasanya punya nilai ekonomi dan sangat layak dikembalikan ke rantai daur ulang.",
  },
  organik: {
    uses: [
      "Dapat diolah menjadi kompos",
      "Bisa menjadi pupuk cair untuk tanaman",
      "Cocok sebagai pakan maggot untuk budidaya",
    ],
    summary:
      "Sampah organik paling bermanfaat jika dipisahkan sejak awal agar cepat terurai.",
  },
};

function normalizeWasteLabel(value: string): WasteLabel {
  const normalized = value.trim().toLowerCase();

  if (normalized.includes("plastik")) return "plastik";
  if (normalized.includes("kertas")) return "kertas";
  if (normalized.includes("kaca")) return "kaca";
  if (normalized.includes("logam")) return "logam";
  return "organik";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function AIAnalystClient() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const previewUrlRef = useRef<string | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AIAnalysisState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [history, setHistory] = useState<AIAnalysisHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const selectedGuide = useMemo(() => {
    if (!result) {
      return null;
    }

    return WASTE_GUIDES[result.label];
  }, [result]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsCameraOpen(false);
  }, []);

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);

    try {
      const response = await fetch("/api/ai/history?limit=8");
      const payload = (await response.json()) as {
        data?: AIAnalysisHistoryItem[];
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error || "Gagal memuat history");
      }

      setHistory(payload.data ?? []);
    } catch (historyLoadError) {
      console.error("Failed to fetch AI history:", historyLoadError);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadHistory();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loadHistory]);

  useEffect(() => {
    return () => {
      stopCamera();
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, [stopCamera]);

  useEffect(() => {
    if (!isCameraOpen || !videoRef.current || !streamRef.current) {
      return;
    }

    videoRef.current.srcObject = streamRef.current;
    void videoRef.current.play().catch(() => undefined);
  }, [isCameraOpen]);

  const setPreviewFromFile = useCallback((file: File) => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    const nextPreviewUrl = URL.createObjectURL(file);
    previewUrlRef.current = nextPreviewUrl;
    setPreviewUrl(nextPreviewUrl);
  }, []);

  const handleFileSelect = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) {
        setError("File harus berupa gambar.");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("Ukuran gambar maksimal 5MB.");
        return;
      }

      stopCamera();
      setSelectedFile(file);
      setError(null);
      setCameraError(null);
      setResult(null);
      setPreviewFromFile(file);
    },
    [setPreviewFromFile, stopCamera]
  );

  const startCamera = useCallback(async () => {
    setError(null);
    setCameraError(null);
    setResult(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });

      streamRef.current = stream;
      setIsCameraOpen(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => undefined);
      }
    } catch (cameraAccessError) {
      setCameraError(
        cameraAccessError instanceof Error
          ? cameraAccessError.message
          : "Tidak bisa mengakses kamera. Gunakan upload foto sebagai alternatif."
      );
    }
  }, []);

  const capturePhoto = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      setCameraError("Kamera belum siap untuk mengambil foto.");
      return;
    }

    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) {
        setCameraError("Gagal mengambil foto dari kamera.");
        return;
      }

      const capturedFile = new File([blob], "ai-analyst-capture.jpg", {
        type: "image/jpeg",
      });

      handleFileSelect(capturedFile);
    }, "image/jpeg", 0.92);
  }, [handleFileSelect]);

  const handleAnalyze = useCallback(async () => {
    if (!selectedFile) {
      setError("Unggah atau ambil foto terlebih dahulu.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/ai/analyze", {
        method: "POST",
        body: formData,
      });

      const payload = (await response.json()) as {
        label?: string;
        result?: string;
        confidence?: number;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(
          payload.error ||
            "Gagal menganalisis gambar. Pastikan service FastAPI berjalan."
        );
      }

      const labelSource = "label" in payload ? payload.label : payload.result;

      setResult({
        label: normalizeWasteLabel(labelSource || "organik"),
        confidence: payload.confidence ?? 0,
      });

      await loadHistory();
    } catch (analyzeError) {
      setError(
        analyzeError instanceof Error
          ? analyzeError.message
          : "Terjadi kesalahan saat analisis"
      );
    } finally {
      setIsLoading(false);
    }
  }, [loadHistory, selectedFile]);

  const handleReset = useCallback(() => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    setCameraError(null);

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleOpenFilePicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const confidencePercent = result ? Math.round(result.confidence * 100) : 0;

  return (
    <div className="space-y-5 pb-8">
      <section className="rounded-[28px] border border-emerald-100/80 bg-white/95 p-4 shadow-[0_22px_60px_rgba(16,185,129,0.12)] backdrop-blur">
        <div className="flex flex-col gap-3 border-b border-emerald-50 pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <Cpu className="h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-black tracking-tight text-slate-900 sm:text-xl">
                  AI Analyst
                </p>
                <p className="text-sm text-slate-600">
                  Upload atau ambil foto, lalu AI akan memberi klasifikasi dan tips daur ulang.
                </p>
              </div>
            </div>
          </div>

          <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            <Camera className="h-3.5 w-3.5" />
            <Upload className="h-3.5 w-3.5" />
            Camera + Upload AI
          </div>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <div className="rounded-3xl border border-emerald-100 bg-linear-to-br from-emerald-50/80 via-white to-white p-4">
              <div
                className="group relative flex min-h-45 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-emerald-200 bg-white/80 p-4 text-center transition hover:border-emerald-400 hover:bg-emerald-50/80"
                onDragOver={(event) => {
                  event.preventDefault();
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  const droppedFile = event.dataTransfer.files?.[0];
                  if (droppedFile) {
                    handleFileSelect(droppedFile);
                  }
                }}
              >
                {previewUrl ? (
                  <div className="w-full space-y-3 text-left">
                    <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-slate-50 shadow-sm">
                      <Image
                        src={previewUrl}
                        alt="Preview sampah yang diunggah"
                        width={1280}
                        height={720}
                        unoptimized
                        className="h-45 w-full object-cover sm:h-55"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-3 rounded-2xl bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
                      <div className="flex min-w-0 items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                        <p className="truncate font-medium">
                          {selectedFile?.name || "Gambar siap dianalisis"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleReset}
                        className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
                      >
                        <X className="h-3.5 w-3.5" />
                        Ganti
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                      <ImagePlus className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-base font-semibold text-slate-900 sm:text-lg">
                        Drag & drop foto sampah di sini
                      </p>
                      <p className="text-sm text-slate-600">
                        Atau gunakan tombol di bawah untuk upload dan kamera.
                      </p>
                    </div>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                      handleFileSelect(file);
                    }
                  }}
                  disabled={isLoading}
                />
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={handleOpenFilePicker}
                  disabled={isLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <CloudUpload className="h-4 w-4" />
                  Upload Photo
                </button>
                <button
                  type="button"
                  onClick={startCamera}
                  disabled={isLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Camera className="h-4 w-4" />
                  Use Camera
                </button>
                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={isLoading || !selectedFile}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-emerald-500 to-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Analyzing
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Analyze Image
                    </>
                  )}
                </button>
              </div>
            </div>

            {isCameraOpen ? (
              <div className="rounded-3xl border border-emerald-100 bg-white p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Camera preview</p>
                    <p className="text-xs text-slate-500">
                      Gunakan mode landscape agar sampah terlihat jelas.
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                    Live
                  </span>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-950">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="h-55 w-full object-cover sm:h-65"
                  />
                </div>
                <canvas ref={canvasRef} className="hidden" />

                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={capturePhoto}
                    disabled={isLoading}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Camera className="h-4 w-4" />
                    Capture
                  </button>
                  <button
                    type="button"
                    onClick={stopCamera}
                    disabled={isLoading}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <X className="h-4 w-4" />
                    Close Camera
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-emerald-100 bg-emerald-50/60 p-4 text-sm text-slate-600">
                Kamera belum aktif. Tekan <span className="font-semibold text-slate-800">Use Camera</span> untuk memulai atau upload foto langsung.
              </div>
            )}

            {cameraError ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                {cameraError}
              </div>
            ) : null}

            {error ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            ) : null}
          </div>

          <div className="space-y-4">
            {result ? (
              <div className="rounded-3xl border border-emerald-100 bg-linear-to-br from-emerald-50 to-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Hasil AI
                    </div>
                    <h2 className="text-2xl font-black tracking-tight text-emerald-900">
                      {WASTE_LABELS[result.label]}
                    </h2>
                    <p className="mt-1 text-sm text-slate-600">
                      AI berhasil mengklasifikasikan gambar ini sebagai {WASTE_LABELS[result.label].toLowerCase()}.
                    </p>
                  </div>

                  <span className="inline-flex items-center rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
                    {confidencePercent}%
                  </span>
                </div>

                <div className="mt-4 space-y-2 rounded-2xl bg-white p-3">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-medium text-slate-600">Waste Type</span>
                    <span className="font-semibold text-slate-900">
                      {WASTE_LABELS[result.label]}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-medium text-slate-600">Confidence</span>
                    <span className="font-semibold text-emerald-700">
                      {confidencePercent}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-emerald-100">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-emerald-500 to-emerald-600 transition-all"
                      style={{ width: `${confidencePercent}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-emerald-100 bg-white p-3 text-sm text-slate-700">
                  {selectedGuide?.summary}
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
                >
                  <ImagePlus className="h-4 w-4" />
                  Analyze another image
                </button>
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-emerald-100 bg-white p-4 text-sm text-slate-500">
                Hasil klasifikasi akan muncul di card ini setelah gambar dianalisis.
              </div>
            )}

            {result ? (
              <div className="rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center gap-2">
                  <div className="rounded-full bg-emerald-100 p-2 text-emerald-700">
                    <ScanSearch className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      What can this waste be used for?
                    </h3>
                    <p className="text-xs text-slate-500">
                      Rekomendasi singkat berdasarkan hasil klasifikasi.
                    </p>
                  </div>
                </div>

                <ul className="space-y-2">
                  {selectedGuide?.uses.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 rounded-2xl bg-emerald-50/70 px-3 py-2 text-sm text-slate-700"
                    >
                      <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <div className="rounded-full bg-emerald-100 p-2 text-emerald-700">
                  <ArrowRight className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">How to use AI</h3>
                  <p className="text-xs text-slate-500">
                    Tiga langkah singkat untuk klasifikasi cepat.
                  </p>
                </div>
              </div>

              <div className="grid gap-2">
                {[
                  "Upload or capture photo",
                  "Click Analyze Image",
                  "Read the result and recycling tips",
                ].map((step, index) => (
                  <div
                    key={step}
                    className="flex items-center gap-3 rounded-2xl bg-slate-50 px-3 py-3 text-sm text-slate-700"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                      {index + 1}
                    </span>
                    <span className="font-medium">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-emerald-100/80 bg-white/95 p-4 shadow-[0_18px_45px_rgba(16,185,129,0.08)] backdrop-blur">
        <div className="mb-3 flex items-center gap-2">
          <div className="rounded-full bg-emerald-100 p-2 text-emerald-700">
            <Clock3 className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">History user</h3>
            <p className="text-xs text-slate-500">
              Riwayat analisis terbaru tampil dalam daftar compact.
            </p>
          </div>
        </div>

        {historyLoading && history.length === 0 ? (
          <div className="space-y-2">
            {[0, 1, 2].map((item) => (
              <div key={item} className="h-20 animate-pulse rounded-2xl bg-slate-100" />
            ))}
          </div>
        ) : history.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-emerald-100 bg-emerald-50/60 p-4 text-center">
            <p className="text-sm font-semibold text-slate-900">Belum ada history analisis.</p>
            <p className="mt-1 text-sm text-slate-600">
              Upload foto pertama untuk melihat riwayat di sini.
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {history.map((item) => (
              <article
                key={item.id}
                className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-white p-3 shadow-sm"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={`History ${item.result}`}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  ) : null}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {item.result}
                    </p>
                    <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      {Math.round(item.confidence * 100)}%
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {formatDate(item.createdAt)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

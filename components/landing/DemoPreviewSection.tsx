"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function DemoPreviewSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const mockupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current || !contentRef.current || !mockupRef.current) return;

    const section = sectionRef.current;
    const content = contentRef.current;
    const mockup = mockupRef.current;

    const ctx = gsap.context(() => {
      gsap.from(content, {
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
        opacity: 0,
        x: -40,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from(mockup, {
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
        opacity: 0,
        x: 40,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.to(mockup, {
        scrollTrigger: {
          trigger: section,
          start: "top center",
          end: "bottom center",
          scrub: 1,
        },
        y: -20,
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-gradient-to-b from-white via-emerald-50/40 to-white px-4 py-20 sm:px-6 md:py-28 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div ref={contentRef} className="flex flex-col gap-6">
            <span className="w-fit rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
              Demo Aplikasi
            </span>

            <h2 className="text-3xl font-bold leading-tight text-slate-950 sm:text-4xl lg:text-5xl">
              Lihat Cara AI Membantu Memilah Sampah
            </h2>

            <p className="max-w-xl text-lg leading-8 text-slate-600">
              Pilah Yuk!! membantu pengguna mengenali jenis sampah dari gambar,
              lalu memberikan poin, badge, dan progress ramah lingkungan.
            </p>

            <div className="space-y-4">
              {[
                {
                  icon: "🗑️",
                  title: "Upload Foto Sampah",
                  description:
                    "Pengguna cukup mengunggah gambar sampah yang ingin diklasifikasikan.",
                },
                {
                  icon: "⚡",
                  title: "AI Mendeteksi Jenis Sampah",
                  description:
                    "Model AI akan mengenali kategori seperti plastik, kertas, kaca, logam, atau organik.",
                },
                {
                  icon: "🏆",
                  title: "Dapatkan Poin dan Badge",
                  description:
                    "Setiap aksi pemilahan akan menambah poin dan progress pengguna.",
                },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <div className="shrink-0">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-xl">
                      {item.icon}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-950">
                      {item.title}
                    </h4>
                    <p className="text-sm leading-6 text-slate-600">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-4 w-fit rounded-xl bg-gradient-to-r from-emerald-500 to-lime-500 px-8 py-3 font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:scale-105 hover:shadow-emerald-500/30 active:scale-95">
              Coba Deteksi Sampah
            </button>
          </div>

          <div ref={mockupRef} className="relative">
            <div className="relative mx-auto aspect-square w-full max-w-md">
              <div className="absolute -inset-8 rounded-3xl bg-gradient-to-br from-emerald-200 to-lime-200 opacity-30 blur-2xl" />

              <div className="relative overflow-hidden rounded-3xl border border-emerald-200 bg-white p-6 shadow-2xl shadow-emerald-900/10">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-lime-500 text-xl">
                    ♻️
                  </div>
                  <div>
                    <p className="font-bold text-slate-950">Pilah Yuk!!</p>
                    <p className="text-xs text-slate-500">AI Waste Scanner</p>
                  </div>
                </div>

                <div className="mb-6 flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/50 p-8">
                  <span className="text-5xl">🗑️</span>
                  <p className="text-center text-sm font-medium text-slate-600">
                    Upload foto sampahmu
                  </p>
                  <p className="text-xs text-slate-400">JPG, PNG maks. 5MB</p>
                </div>

                <div className="space-y-4">
                  <ResultCard
                    title="Plastik"
                    accuracy="92% Akurat"
                    points="+10"
                    icon="🍾"
                    color="emerald"
                    widthClass="w-11/12"
                  />

                  <ResultCard
                    title="Kertas"
                    accuracy="88% Akurat"
                    points="+8"
                    icon="📰"
                    color="blue"
                    widthClass="w-10/12"
                  />
                </div>

                <div className="mt-6 flex justify-around border-t border-slate-200 pt-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-emerald-500">28</p>
                    <p className="text-xs text-slate-500">Hari ini</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-lime-500">156</p>
                    <p className="text-xs text-slate-500">Bulan ini</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type ResultCardProps = {
  title: string;
  accuracy: string;
  points: string;
  icon: string;
  color: "emerald" | "blue";
  widthClass: string;
};

function ResultCard({
  title,
  accuracy,
  points,
  icon,
  color,
  widthClass,
}: ResultCardProps) {
  const colorClass =
    color === "emerald"
      ? {
          card: "border-emerald-200 bg-emerald-50",
          text: "text-emerald-600",
          barBg: "bg-emerald-200",
          bar: "bg-emerald-500",
        }
      : {
          card: "border-blue-200 bg-blue-50",
          text: "text-blue-600",
          barBg: "bg-blue-200",
          bar: "bg-blue-500",
        };

  return (
    <div className={`rounded-xl border p-4 ${colorClass.card}`}>
      <div className="mb-2 flex items-start justify-between">
        <div>
          <p className="text-sm font-bold text-slate-950">{title}</p>
          <p className={`text-xs font-semibold ${colorClass.text}`}>
            {accuracy}
          </p>
        </div>
        <span className="text-2xl">{icon}</span>
      </div>

      <p className="mb-3 text-xs text-slate-600">
        Poin: <span className={`font-bold ${colorClass.text}`}>{points}</span>
      </p>

      <div className={`h-1.5 w-full rounded-full ${colorClass.barBg}`}>
        <div className={`h-1.5 rounded-full ${colorClass.bar} ${widthClass}`} />
      </div>
    </div>
  );
}
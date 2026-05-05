"use client";

import React, { useRef, useState } from "react";
import { Camera, X } from "lucide-react";

interface AICameraProps {
  onCapture: (file: File) => void;
  isLoading: boolean;
}

export default function AICamera({ onCapture, isLoading }: AICameraProps) {
  const [isActive, setIsActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsActive(true);
      }
    } catch (error) {
      console.error("Failed to access camera:", error);
      alert("Tidak bisa mengakses kamera.");
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      const ctx = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx?.drawImage(video, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "camera-capture.jpg", {
            type: "image/jpeg",
          });
          onCapture(file);
          stopCamera();
        }
      }, "image/jpeg");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      setIsActive(false);
    }
  };

  if (!isActive) {
    return (
      <button
        onClick={startCamera}
        disabled={isLoading}
        className="w-full rounded-2xl border-2 border-emerald-600 bg-emerald-600 px-6 py-4 font-black text-white transition hover:bg-emerald-700 hover:shadow-lg disabled:opacity-50"
      >
        <div className="flex items-center justify-center gap-2">
          <Camera className="h-5 w-5" />
          Gunakan Kamera
        </div>
      </button>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative h-80 overflow-hidden rounded-2xl bg-black">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="h-full w-full object-cover"
        />
      </div>
      <canvas ref={canvasRef} className="hidden" />

      <div className="flex gap-2">
        <button
          onClick={capturePhoto}
          disabled={isLoading}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
        >
          <Camera className="h-5 w-5" />
          Ambil Foto
        </button>
        <button
          onClick={stopCamera}
          disabled={isLoading}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-300 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-400 disabled:opacity-50"
        >
          <X className="h-5 w-5" />
          Batal
        </button>
      </div>
    </div>
  );
}


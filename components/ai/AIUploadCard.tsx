"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { Camera, Upload, X } from "lucide-react";

interface AIUploadCardProps {
  onImageSelect: (file: File) => void;
  isLoading: boolean;
}

export function AIUploadCard({ onImageSelect, isLoading }: AIUploadCardProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    onImageSelect(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraOpen(true);
      }
    } catch (error) {
      console.error("Failed to access camera:", error);
      alert("Tidak bisa mengakses kamera. Silakan gunakan upload foto.");
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
          handleFileSelect(file);
          closeCamera();
        }
      }, "image/jpeg");
    }
  };

  const closeCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      setIsCameraOpen(false);
    }
  };

  const clearPreview = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full space-y-4 rounded-3xl border-2 border-emerald-100 bg-gradient-to-br from-emerald-50/80 to-white p-6 shadow-lg">
      {/* Preview Section */}
      {preview && !isCameraOpen && (
        <div className="relative space-y-3">
          <div className="relative h-64 w-full overflow-hidden rounded-2xl bg-slate-100">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
            />
          </div>
          <button
            onClick={clearPreview}
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-300 disabled:opacity-50"
          >
            <X className="h-4 w-4" />
            Ganti Foto
          </button>
        </div>
      )}

      {/* Camera Section */}
      {isCameraOpen && (
        <div className="space-y-3">
          <div className="relative h-64 w-full overflow-hidden rounded-2xl bg-black">
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
              onClick={closeCamera}
              disabled={isLoading}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-200 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-300 disabled:opacity-50"
            >
              <X className="h-5 w-5" />
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Upload Buttons */}
      {!preview && !isCameraOpen && (
        <div className="space-y-3">
          <div className="text-center">
            <h3 className="text-lg font-black text-emerald-900">
              Unggah Foto Sampah
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Ambil foto atau unggah dari galeri Anda
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={openCamera}
              disabled={isLoading}
              className="flex flex-1 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-emerald-200 bg-white px-4 py-4 transition hover:border-emerald-400 hover:bg-emerald-50 disabled:opacity-50"
            >
              <div className="rounded-full bg-emerald-100 p-3">
                <Camera className="h-6 w-6 text-emerald-600" />
              </div>
              <span className="font-semibold text-slate-900">Gunakan Kamera</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="flex flex-1 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-emerald-200 bg-white px-4 py-4 transition hover:border-emerald-400 hover:bg-emerald-50 disabled:opacity-50"
            >
              <div className="rounded-full bg-emerald-100 p-3">
                <Upload className="h-6 w-6 text-emerald-600" />
              </div>
              <span className="font-semibold text-slate-900">Upload Foto</span>
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}

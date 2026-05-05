"use client";

import React, { useRef } from "react";
import { Upload } from "lucide-react";

interface AIUploadProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

export default function AIUpload({ onFileSelect, isLoading }: AIUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div
      className="relative flex min-h-40 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-emerald-300 bg-emerald-50 p-8 transition hover:border-emerald-500"
      onDragOver={(e) => {
        e.preventDefault();
        e.currentTarget.classList.add("border-emerald-500", "bg-emerald-100");
      }}
      onDragLeave={(e) => {
        e.currentTarget.classList.remove("border-emerald-500", "bg-emerald-100");
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.currentTarget.classList.remove("border-emerald-500", "bg-emerald-100");
        const file = e.dataTransfer.files?.[0];
        if (file) {
          onFileSelect(file);
        }
      }}
    >
      <div className="space-y-3 text-center">
        <div className="flex justify-center">
          <div className="rounded-full bg-emerald-200 p-4">
            <Upload className="h-8 w-8 text-emerald-600" />
          </div>
        </div>
        <div>
          <p className="font-black text-emerald-900">Drag & Drop atau Klik</p>
          <p className="text-sm text-emerald-700">
            untuk mengunggah foto sampah Anda
          </p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
        disabled={isLoading}
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isLoading}
        className="absolute inset-0 z-0 rounded-3xl"
      />
    </div>
  );
}


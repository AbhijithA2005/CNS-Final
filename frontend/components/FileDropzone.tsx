"use client";

import React, { useRef, useState } from "react";
import { UploadCloud, File, FileArchive, FileText, Image as ImageIcon, Music, Video } from "lucide-react";
import { formatBytes } from "@/lib/utils";

interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSizeBytes?: number;
  label?: string;
  sublabel?: string;
}

export function FileDropzone({
  onFileSelect,
  accept,
  maxSizeBytes = 50 * 1024 * 1024,
  label = "Drop your file here",
  sublabel = "or browse from your device",
}: FileDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    setError(null);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (file.size > maxSizeBytes) {
      setError(`File size exceeds ${formatBytes(maxSizeBytes)} limit.`);
      return;
    }
    if (accept && accept.includes(".svault") && !file.name.endsWith(".svault")) {
      setError("Please select a valid .svault encrypted container.");
      return;
    }
    onFileSelect(file);
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer rounded-3xl p-8 sm:p-12 text-center transition-all duration-300 border-2 border-dashed ${
          isDragOver
            ? "border-indigo-500 bg-indigo-500/10 scale-[1.01]"
            : "border-white/15 bg-white/[0.03] hover:border-white/30 hover:bg-white/[0.05]"
        } backdrop-blur-2xl group`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="p-4 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-indigo-500/10">
            <UploadCloud className="w-8 h-8 text-indigo-400 group-hover:text-indigo-300" />
          </div>

          <div className="space-y-1">
            <p className="text-base sm:text-lg font-medium text-white tracking-tight">
              {label}
            </p>
            <p className="text-xs sm:text-sm text-slate-400">
              {sublabel}
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs text-slate-400 bg-white/5 border border-white/10">
            <span>Supports any file up to 50 MB (Text, PDF, Images, ZIP, Binary)</span>
          </div>
        </div>
      </div>

      {error && (
        <p className="mt-2 text-xs text-rose-400 font-medium text-center">
          {error}
        </p>
      )}
    </div>
  );
}

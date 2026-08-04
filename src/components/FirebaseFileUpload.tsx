"use client";

import React, { useState } from "react";
import { uploadFileToFirebase } from "@/lib/firebaseStorage";
import { FileText, FileSpreadsheet, Image as ImageIcon, UploadCloud, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface FirebaseFileUploadProps {
  onUploadSuccess?: (result: { url: string; fullPath: string; fileName: string }) => void;
  folder?: string;
  allowedTypes?: string; // e.g. "image/*,.pdf,.xlsx,.csv"
  label?: string;
}

export default function FirebaseFileUpload({
  onUploadSuccess,
  folder,
  allowedTypes = "image/*,.pdf,.doc,.docx,.xlsx,.xls,.csv",
  label = "Upload Image, Document, or Excel file"
}: FirebaseFileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<{ url: string; fileName: string } | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const res = await uploadFileToFirebase(file, folder);
      setUploadedFile({ url: res.url, fileName: res.fileName });
      if (onUploadSuccess) {
        onUploadSuccess(res);
      }
    } catch (err: any) {
      console.error("Firebase Upload Error:", err);
      setError(err.message || "Failed to upload file to Firebase Storage");
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (["xlsx", "xls", "csv"].includes(ext || "")) return <FileSpreadsheet className="w-8 h-8 text-emerald-500" />;
    if (["pdf", "doc", "docx"].includes(ext || "")) return <FileText className="w-8 h-8 text-blue-500" />;
    return <ImageIcon className="w-8 h-8 text-amber-500" />;
  };

  return (
    <div className="w-full p-4 border-2 border-dashed border-neutral-700 hover:border-neutral-500 rounded-xl transition-all bg-neutral-900/50 backdrop-blur">
      <div className="flex flex-col items-center justify-center text-center space-y-3">
        {uploading ? (
          <div className="flex flex-col items-center space-y-2 py-4">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
            <p className="text-sm text-neutral-300 font-medium">Uploading to Firebase Storage...</p>
          </div>
        ) : uploadedFile ? (
          <div className="flex flex-col items-center space-y-2 py-2">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              {getFileIcon(uploadedFile.fileName)}
            </div>
            <p className="text-sm text-emerald-400 font-medium truncate max-w-xs">{uploadedFile.fileName}</p>
            <a
              href={uploadedFile.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs underline text-amber-400 hover:text-amber-300"
            >
              View Uploaded File
            </a>
            <label className="mt-2 text-xs cursor-pointer text-neutral-400 hover:text-neutral-200 underline">
              Upload Another File
              <input type="file" onChange={handleFileChange} accept={allowedTypes} className="hidden" />
            </label>
          </div>
        ) : (
          <>
            <div className="p-3 bg-neutral-800 rounded-full text-neutral-300">
              <UploadCloud className="w-7 h-7 text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-200">{label}</p>
              <p className="text-xs text-neutral-400 mt-1">Supports Images, PDFs, Docs, and Excel (.xlsx, .csv)</p>
            </div>
            <label className="cursor-pointer px-4 py-2 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-semibold text-xs rounded-lg transition-colors shadow">
              Select File
              <input type="file" onChange={handleFileChange} accept={allowedTypes} className="hidden" />
            </label>
          </>
        )}

        {error && (
          <div className="flex items-center space-x-2 text-rose-400 text-xs mt-2 bg-rose-950/40 p-2 rounded border border-rose-800/50">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}

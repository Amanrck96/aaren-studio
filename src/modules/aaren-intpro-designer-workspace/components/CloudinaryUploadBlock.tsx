"use client";

import React, { useState, useRef } from "react";
import { ProjectDocumentData } from "../types/workspace";
import { UploadCloud, FileText, Download, CheckCircle, AlertTriangle, Trash2, FileCode } from "lucide-react";

interface CloudinaryUploadBlockProps {
  projectId: string;
  documents: ProjectDocumentData[];
  onUploadSuccess: (doc: ProjectDocumentData) => void;
}

const MAX_SIZE_BYTES = 200 * 1024 * 1024; // 200MB

export default function CloudinaryUploadBlock({
  projectId,
  documents,
  onUploadSuccess,
}: CloudinaryUploadBlockProps) {
  const [dragActive, setDragActive] = useState(false);
  const [fileType, setFileType] = useState("Drawing");
  const [customName, setCustomName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setErrorMsg(null);

    // 1. Client-Side Size Check (200MB limit)
    if (file.size > MAX_SIZE_BYTES) {
      setErrorMsg(`File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds the maximum allowed limit of 200MB.`);
      return;
    }

    setUploading(true);
    setProgress(20);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("projectId", projectId);
    formData.append("fileType", fileType);
    if (customName.trim()) {
      formData.append("name", customName.trim());
    }

    try {
      setProgress(50);
      const res = await fetch("/api/workspace/upload", {
        method: "POST",
        body: formData,
      });

      setProgress(90);
      const json = await res.json();

      if (!res.ok || !json.success) {
        setErrorMsg(json.error || "Upload failed. Please try again.");
      } else {
        onUploadSuccess(json.data);
        setCustomName("");
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    } catch (err: any) {
      setErrorMsg("Network error during file upload.");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2.4rem" }}>
      {/* Upload Zone */}
      <div
        style={{
          background: "#FAF9F6",
          border: "1px solid rgba(129, 102, 63, 0.25)",
          borderRadius: "1.4rem",
          padding: "2.8rem 2.4rem",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
        }}
      >
        <div>
          <h3
            style={{
              fontFamily: "var(--font-jost), 'Jost', sans-serif",
              fontSize: "2rem",
              fontWeight: 700,
              color: "#81663F",
              margin: "0 0 0.4rem",
              textTransform: "uppercase",
            }}
          >
            Upload Drawings, Contracts & Specifications
          </h3>
          <p style={{ fontSize: "1.3rem", color: "#5E5852", margin: 0 }}>
            Upload CAD files, contracts, 3D renderings, and high-res architectural plans directly to Cloudinary (up to 200MB per file).
          </p>
        </div>

        {errorMsg && (
          <div
            style={{
              background: "rgba(220, 38, 38, 0.08)",
              border: "1px solid rgba(220, 38, 38, 0.3)",
              color: "#991B1B",
              padding: "1.2rem 1.6rem",
              borderRadius: "0.8rem",
              fontSize: "1.25rem",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "0.8rem",
            }}
          >
            <AlertTriangle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Upload Controls */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.2rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "1.15rem", fontWeight: 700, color: "#1C1917", marginBottom: "0.4rem" }}>
              Document Category
            </label>
            <select
              value={fileType}
              onChange={(e) => setFileType(e.target.value)}
              style={{
                width: "100%",
                padding: "0.9rem 1.2rem",
                borderRadius: "0.6rem",
                border: "1px solid rgba(129, 102, 63, 0.3)",
                background: "#FFFFFF",
                fontSize: "1.25rem",
                fontWeight: 600,
                color: "#1C1917",
                outline: "none",
              }}
            >
              <option value="Drawing">📐 Architectural Drawing (DWG/PDF)</option>
              <option value="Contract">📜 Signed Client Contract</option>
              <option value="BOQ">📊 Bill of Quantities / Pricing</option>
              <option value="3D Render">🎨 3D Visualization / CGI</option>
              <option value="Specification">📝 Material Cut-Sheet</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "1.15rem", fontWeight: 700, color: "#1C1917", marginBottom: "0.4rem" }}>
              Document Title (Optional)
            </label>
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="e.g. Master Bedroom Joinery Rev 2"
              style={{
                width: "100%",
                padding: "0.9rem 1.2rem",
                borderRadius: "0.6rem",
                border: "1px solid rgba(129, 102, 63, 0.3)",
                background: "#FFFFFF",
                fontSize: "1.25rem",
                color: "#1C1917",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>

        {/* Drag & Drop Area */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${dragActive ? "#81663F" : "rgba(129, 102, 63, 0.4)"}`,
            borderRadius: "1.2rem",
            background: dragActive ? "#F4EFE6" : "#FFFFFF",
            padding: "3.6rem 2rem",
            textAlign: "center",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleUpload(e.target.files[0]);
              }
            }}
            style={{ display: "none" }}
          />

          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              background: "rgba(129, 102, 63, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.4rem",
              color: "#81663F",
            }}
          >
            <UploadCloud size={30} />
          </div>

          <h4 style={{ fontSize: "1.6rem", fontWeight: 700, color: "#1C1917", margin: "0 0 0.6rem" }}>
            {uploading ? "Uploading to Cloudinary..." : "Click or drag & drop files here"}
          </h4>
          <p style={{ fontSize: "1.25rem", color: "#5E5852", margin: 0 }}>
            Supports PDF, DWG, DXF, PNG, JPG, ZIP, XLSX (Maximum size: <strong>200MB</strong>)
          </p>

          {uploading && (
            <div style={{ maxWidth: "320px", margin: "1.6rem auto 0", height: "6px", background: "rgba(129, 102, 63, 0.2)", borderRadius: "999px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${progress}%`, background: "#81663F", borderRadius: "999px", transition: "width 0.3s ease" }} />
            </div>
          )}
        </div>
      </div>

      {/* Documents List */}
      <div
        style={{
          background: "#FAF9F6",
          border: "1px solid rgba(129, 102, 63, 0.25)",
          borderRadius: "1.4rem",
          padding: "2.4rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.6rem",
        }}
      >
        <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#81663F", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Uploaded Project Documents ({documents.length})
        </div>

        {documents.length === 0 ? (
          <p style={{ fontSize: "1.35rem", color: "#5E5852", margin: "1rem 0" }}>
            No documents uploaded yet for this project.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {documents.map((doc) => {
              const sizeMb = doc.fileSize ? (doc.fileSize / (1024 * 1024)).toFixed(2) + " MB" : "Document";
              return (
                <div
                  key={doc.id}
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid rgba(129, 102, 63, 0.15)",
                    borderRadius: "0.8rem",
                    padding: "1.2rem 1.6rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "1.2rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "1.2rem", minWidth: 0 }}>
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "0.6rem",
                        background: "rgba(129, 102, 63, 0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#81663F",
                        flexShrink: 0,
                      }}
                    >
                      <FileText size={20} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: "1.35rem", fontWeight: 700, color: "#1C1917", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {doc.name}
                      </div>
                      <div style={{ fontSize: "1.1rem", color: "#5E5852", display: "flex", gap: "0.8rem" }}>
                        <span style={{ color: "#81663F", fontWeight: 700 }}>{doc.fileType}</span>
                        <span>•</span>
                        <span>{sizeMb}</span>
                        <span>•</span>
                        <span>{new Date(doc.createdAt).toLocaleDateString("en-IN")}</span>
                      </div>
                    </div>
                  </div>

                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: "rgba(129, 102, 63, 0.08)",
                      border: "1px solid rgba(129, 102, 63, 0.2)",
                      color: "#81663F",
                      padding: "0.6rem 1.2rem",
                      borderRadius: "0.6rem",
                      fontSize: "1.15rem",
                      fontWeight: 700,
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.4rem",
                    }}
                  >
                    <Download size={13} />
                    <span>Download</span>
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

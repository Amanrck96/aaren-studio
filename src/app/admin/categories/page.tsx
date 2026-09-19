"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AdminNav from "@/components/AdminNav";
import { CategoryItem } from "@/lib/types";

// ─── Shared style tokens (same as admin/downloads) ─────────────
const C = {
  gold: "#81663F", goldDark: "#684F2E", goldLight: "#E8DFC8",
  bg: "#F7F5F0", white: "#FFFFFF", text: "#1E1E1E",
  textMuted: "#6A6359", textFaint: "#8A8275",
  border: "#E4DCCE", borderLight: "#D5CEBF",
  surface: "#FAF8F5", accent: "#B89C74",
};

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "8px 14px", borderRadius: 12,
  border: `1px solid ${C.borderLight}`, backgroundColor: C.surface,
  fontSize: 13, color: C.text, outline: "none", boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 10, fontWeight: 700,
  textTransform: "uppercase", letterSpacing: "0.1em",
  color: C.textMuted, marginBottom: 6,
};

const btnGold: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 6,
  padding: "8px 16px", borderRadius: 12, backgroundColor: C.gold,
  color: C.white, fontSize: 12, fontWeight: 600, border: "none",
  cursor: "pointer", whiteSpace: "nowrap",
};

const btnOutline: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 6,
  padding: "8px 14px", borderRadius: 12, backgroundColor: C.white,
  color: C.textMuted, fontSize: 12, fontWeight: 500,
  border: `1px solid ${C.borderLight}`, cursor: "pointer",
  whiteSpace: "nowrap",
};

// ─── Toast ─────────────────────────────────────────────────────
type Toast = { message: string; type: "success" | "error" };

// ─── Main export (wrapped in Suspense for useRouter) ───────────
export default function AdminCategoriesPage() {
  return (
    <Suspense fallback={<div style={{ padding: 32, textAlign: "center", color: C.gold }}>Loading…</div>}>
      <AdminCategoriesContent />
    </Suspense>
  );
}

function AdminCategoriesContent() {
  const router = useRouter();

  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<Toast | null>(null);

  // Modal
  const [editingCat, setEditingCat] = useState<Partial<CategoryItem> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);

  // ── Auth check ──────────────────────────────────────────────
  useEffect(() => {
    const cookies = document.cookie.split("; ");
    const session = cookies.find((r) => r.startsWith("aaren_admin_session="));
    if (!session || !session.includes("authenticated")) router.push("/admin/login");
  }, [router]);

  // ── Data fetching ───────────────────────────────────────────
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/categories?t=${Date.now()}`, { cache: "no-store" });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setCategories(json.data.sort((a: CategoryItem, b: CategoryItem) => a.sequenceNumber - b.sequenceNumber));
      }
    } catch (err: any) {
      showToast(err.message || "Failed to load categories", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  // ── Toast helper ────────────────────────────────────────────
  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Filtered categories ──────────────────────────────────────
  const filtered = categories.filter((c) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.shortCode.toLowerCase().includes(q) ||
      (c.description || "").toLowerCase().includes(q)
    );
  });

  // ── Open modal ───────────────────────────────────────────────
  const openAdd = () => {
    setEditingCat({
      name: "",
      shortCode: "",
      description: "",
      coverImage: "",
      sequenceNumber: categories.length + 1,
    });
    setIsModalOpen(true);
  };

  const openEdit = (cat: CategoryItem) => {
    setEditingCat({ ...cat });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (saving || uploadingImage) return;
    setEditingCat(null);
    setIsModalOpen(false);
  };

  // ── Image upload ─────────────────────────────────────────────
  const handleImageFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingCat) return;
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "Categories");
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const json = await res.json();
      if (json.url) {
        setEditingCat((prev) => prev ? { ...prev, coverImage: json.url } : null);
        showToast("Cover image uploaded!");
      } else {
        showToast(json.error || "Upload failed", "error");
      }
    } catch (err: any) {
      showToast(err.message || "Upload error", "error");
    } finally {
      setUploadingImage(false);
      if (imageInputRef.current) imageInputRef.current.value = "";
    }
  };

  // ── Save ─────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!editingCat?.name?.trim()) { showToast("Category name is required", "error"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingCat),
      });
      const json = await res.json();
      if (json.success) {
        showToast(editingCat.id ? "Category updated!" : "Category added!");
        closeModal();
        fetchCategories();
      } else {
        showToast(json.error || "Save failed", "error");
      }
    } catch (err: any) {
      showToast(err.message || "Save failed", "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ───────────────────────────────────────────────────
  const handleDelete = async (cat: CategoryItem) => {
    if (!confirm(`Delete "${cat.name}"? This cannot be undone.`)) return;
    setDeletingId(cat.id);
    try {
      const res = await fetch(`/api/categories?id=${encodeURIComponent(cat.id)}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) { showToast(`"${cat.name}" deleted.`); fetchCategories(); }
      else showToast(json.error || "Delete failed", "error");
    } catch (err: any) {
      showToast(err.message || "Delete failed", "error");
    } finally {
      setDeletingId(null);
    }
  };

  // ── Reorder ──────────────────────────────────────────────────
  const handleReorder = async (index: number, dir: "up" | "down") => {
    const list = [...filtered];
    const swapIdx = dir === "up" ? index - 1 : index + 1;
    if (swapIdx < 0 || swapIdx >= list.length) return;

    const catA = { ...list[index], sequenceNumber: list[swapIdx].sequenceNumber };
    const catB = { ...list[swapIdx], sequenceNumber: list[index].sequenceNumber };

    // Optimistic local update
    const updated = [...categories];
    const idxA = updated.findIndex((c) => c.id === catA.id);
    const idxB = updated.findIndex((c) => c.id === catB.id);
    if (idxA >= 0) updated[idxA] = catA;
    if (idxB >= 0) updated[idxB] = catB;
    setCategories(updated.sort((a, b) => a.sequenceNumber - b.sequenceNumber));

    try {
      await Promise.all([
        fetch("/api/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(catA) }),
        fetch("/api/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(catB) }),
      ]);
      showToast("Order updated!");
    } catch {
      showToast("Reorder failed", "error");
      fetchCategories();
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: C.bg, color: C.text }}>
      <AdminNav />
      <div style={{ flex: 1, overflowX: "hidden", padding: "40px 32px", marginLeft: 300 }}>

        {/* ── Toast ── */}
        {toast && (
          <div
            style={{
              position: "fixed", bottom: 24, right: 24, zIndex: 9999,
              display: "flex", alignItems: "center", gap: 10,
              padding: "12px 20px", borderRadius: 14,
              backgroundColor: toast.type === "success" ? C.text : "#7F1D1D",
              color: C.white, fontSize: 13, fontWeight: 500,
              border: `1px solid ${toast.type === "success" ? C.gold : "#991B1B"}`,
              boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            }}
          >
            {toast.type === "success" ? "✅" : "⚠️"} {toast.message}
          </div>
        )}

        {/* ── Header ── */}
        <div
          style={{
            display: "flex", alignItems: "flex-start", justifyContent: "space-between",
            gap: 16, paddingBottom: 32, borderBottom: `1px solid ${C.border}`,
            flexWrap: "wrap", marginBottom: 24,
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span
                style={{
                  padding: "2px 10px", borderRadius: 9999, fontSize: 10, fontWeight: 700,
                  textTransform: "uppercase", letterSpacing: "0.1em",
                  backgroundColor: C.goldLight, color: C.gold,
                }}
              >
                Categories CMS
              </span>
            </div>
            <h1 style={{ fontSize: 30, fontWeight: 700, color: C.text, margin: 0 }}>
              Browse by Category Manager
            </h1>
            <p style={{ fontSize: 13, color: C.textMuted, marginTop: 4 }}>
              Add, edit, reorder and delete product categories shown on the website.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <button onClick={fetchCategories} style={btnOutline}>
              🔄 Refresh
            </button>
            <button onClick={openAdd} style={{ ...btnGold, backgroundColor: C.text }}>
              + Add Category
            </button>
          </div>
        </div>

        {/* ── Stats bar ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 24 }}>
          {[
            { label: "Total Categories", value: String(categories.length), sub: "All active categories" },
            { label: "Visible On Site", value: String(filtered.length || categories.length), sub: search ? "After search filter" : "Public-facing" },
          ].map((s) => (
            <div key={s.label} style={{ backgroundColor: C.white, padding: 20, borderRadius: 16, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: C.gold }}>{s.label}</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: C.text, marginTop: 4 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: C.textFaint, marginTop: 2 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* ── Search ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
          <div style={{ position: "relative", flex: 1, maxWidth: 400 }}>
            <span
              style={{
                position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
                fontSize: 14, color: C.textFaint, pointerEvents: "none",
              }}
            >
              🔍
            </span>
            <input
              type="text"
              placeholder="Search categories…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ ...inputStyle, paddingLeft: 38 }}
            />
          </div>
          <span style={{ fontSize: 12, color: C.textFaint }}>
            Showing {filtered.length} of {categories.length}
          </span>
        </div>

        {/* ── Grid ── */}
        {loading ? (
          <div style={{ padding: "80px 0", textAlign: "center", color: C.gold }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>⏳</div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>Loading categories…</div>
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              backgroundColor: C.white, borderRadius: 20,
              border: `1px solid ${C.border}`, padding: 48, textAlign: "center",
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 12 }}>🏷️</div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>No categories found</div>
            <div style={{ fontSize: 12, color: C.textFaint, marginTop: 4 }}>
              {search ? "Try a different search." : "Click \"Add Category\" to get started."}
            </div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
            {filtered.map((cat, idx) => {
              const isDeleting = deletingId === cat.id;
              return (
                <div
                  key={cat.id}
                  style={{
                    backgroundColor: C.white, borderRadius: 20,
                    border: `1px solid ${C.border}`, overflow: "hidden",
                    display: "flex", flexDirection: "column",
                    opacity: isDeleting ? 0.5 : 1,
                    transition: "opacity 0.2s",
                  }}
                >
                  {/* Thumbnail */}
                  <div
                    style={{
                      position: "relative", width: "100%", paddingTop: "56.25%",
                      backgroundColor: "#EAE4D9", overflow: "hidden",
                    }}
                  >
                    {cat.coverImage ? (
                      <Image
                        src={cat.coverImage}
                        alt={cat.name}
                        fill
                        sizes="400px"
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <div
                        style={{
                          position: "absolute", inset: 0, display: "flex",
                          alignItems: "center", justifyContent: "center",
                          fontSize: 40, opacity: 0.3,
                        }}
                      >
                        🏷️
                      </div>
                    )}
                    <div
                      style={{
                        position: "absolute", top: 10, right: 10, padding: "2px 8px",
                        borderRadius: 9999, fontSize: 10, fontWeight: 700,
                        backgroundColor: "rgba(0,0,0,0.7)", color: "#fff",
                      }}
                    >
                      #{idx + 1}
                    </div>
                  </div>

                  {/* Info */}
                  <div style={{ padding: "16px 20px", flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
                      <h3 style={{ fontSize: 17, fontWeight: 700, color: C.text, margin: 0, textTransform: "uppercase" }}>
                        {cat.name}
                      </h3>
                      {cat.shortCode && (
                        <span
                          style={{
                            padding: "2px 8px", borderRadius: 9999, fontSize: 10,
                            fontWeight: 700, flexShrink: 0,
                            backgroundColor: `rgba(129,102,63,0.12)`, color: C.gold,
                            border: `1px solid rgba(129,102,63,0.25)`,
                            letterSpacing: "0.05em",
                          }}
                        >
                          {cat.shortCode}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 11, color: C.gold, marginBottom: 6, fontWeight: 600 }}>
                      Order #{cat.sequenceNumber}
                    </div>
                    {cat.description && (
                      <p
                        style={{
                          fontSize: 12, color: C.textMuted, marginTop: 4,
                          lineHeight: 1.6,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical" as React.CSSProperties["WebkitBoxOrient"],
                          overflow: "hidden",
                        }}
                      >
                        {cat.description}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div
                    style={{
                      padding: "10px 20px", backgroundColor: C.surface,
                      borderTop: `1px solid ${C.border}`,
                      display: "flex", alignItems: "center",
                      justifyContent: "space-between", gap: 8,
                    }}
                  >
                    {/* Reorder arrows */}
                    <div style={{ display: "flex", gap: 4 }}>
                      <button
                        onClick={() => handleReorder(idx, "up")}
                        disabled={idx === 0}
                        style={{
                          ...btnOutline, padding: "4px 8px",
                          opacity: idx === 0 ? 0.3 : 1,
                        }}
                        title="Move up"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => handleReorder(idx, "down")}
                        disabled={idx === filtered.length - 1}
                        style={{
                          ...btnOutline, padding: "4px 8px",
                          opacity: idx === filtered.length - 1 ? 0.3 : 1,
                        }}
                        title="Move down"
                      >
                        ↓
                      </button>
                    </div>

                    {/* Edit + Delete */}
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => handleDelete(cat)}
                        disabled={isDeleting}
                        style={{
                          padding: "6px 8px", borderRadius: 10,
                          border: "1px solid #FCA5A5",
                          backgroundColor: C.white, color: "#DC2626",
                          cursor: "pointer", opacity: isDeleting ? 0.4 : 1,
                        }}
                        title="Delete"
                      >
                        🗑️
                      </button>
                      <button
                        onClick={() => openEdit(cat)}
                        style={{ ...btnGold, padding: "6px 12px", fontSize: 11 }}
                      >
                        ✏️ Edit
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ══ EDIT / ADD MODAL ══════════════════════════════════════ */}
        {isModalOpen && editingCat && (
          <div
            style={{
              position: "fixed", inset: 0, zIndex: 200,
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: 16,
              backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
            }}
          >
            <div
              style={{
                backgroundColor: C.white, width: "100%", maxWidth: 600,
                maxHeight: "92vh", borderRadius: 24,
                boxShadow: "0 24px 64px rgba(0,0,0,0.25)",
                border: `1px solid ${C.borderLight}`,
                display: "flex", flexDirection: "column", overflow: "hidden",
              }}
            >
              {/* Modal header */}
              <div
                style={{
                  padding: "16px 24px", borderBottom: `1px solid ${C.border}`,
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  backgroundColor: C.surface, flexShrink: 0,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: C.gold, display: "inline-block" }} />
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: C.text, margin: 0 }}>
                    {editingCat.id ? `Edit: ${editingCat.name}` : "Add New Category"}
                  </h2>
                </div>
                <button
                  onClick={closeModal}
                  style={{
                    width: 32, height: 32, borderRadius: "50%",
                    border: "none", backgroundColor: "transparent",
                    cursor: "pointer", fontSize: 18, color: C.textMuted,
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Modal body */}
              <div
                style={{
                  padding: 24, overflowY: "auto", flex: 1,
                  display: "flex", flexDirection: "column", gap: 18,
                }}
              >
                {/* Name + Short Code */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={labelStyle}>Category Name *</label>
                    <input
                      style={inputStyle}
                      value={editingCat.name || ""}
                      onChange={(e) => setEditingCat({ ...editingCat, name: e.target.value })}
                      placeholder="e.g. Door Systems"
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Short Code</label>
                    <input
                      style={inputStyle}
                      value={editingCat.shortCode || ""}
                      onChange={(e) => setEditingCat({ ...editingCat, shortCode: e.target.value })}
                      placeholder="e.g. DS 06"
                    />
                  </div>
                </div>

                {/* Sequence Number */}
                <div style={{ maxWidth: 160 }}>
                  <label style={labelStyle}>Sequence Number</label>
                  <input
                    type="number"
                    style={inputStyle}
                    value={editingCat.sequenceNumber ?? 1}
                    onChange={(e) => setEditingCat({ ...editingCat, sequenceNumber: Number(e.target.value) })}
                    min={1}
                  />
                </div>

                {/* Description */}
                <div>
                  <label style={labelStyle}>Description</label>
                  <textarea
                    rows={3}
                    style={{ ...inputStyle, resize: "vertical" } as React.CSSProperties}
                    value={editingCat.description || ""}
                    onChange={(e) => setEditingCat({ ...editingCat, description: e.target.value })}
                    placeholder="Short description of this category…"
                  />
                </div>

                {/* Cover Image */}
                <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 18 }}>
                  <label style={labelStyle}>Cover Image</label>

                  {/* Preview */}
                  <div
                    style={{
                      position: "relative", width: "100%", paddingTop: "45%",
                      borderRadius: 12, border: `1px solid ${C.borderLight}`,
                      overflow: "hidden", backgroundColor: "#F3EDE3", marginBottom: 10,
                    }}
                  >
                    <div
                      style={{
                        position: "absolute", inset: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                    >
                      {editingCat.coverImage ? (
                        <Image
                          src={editingCat.coverImage}
                          alt="Cover preview"
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      ) : (
                        <div style={{ textAlign: "center", color: C.textFaint }}>
                          <div style={{ fontSize: 28, marginBottom: 4 }}>🖼️</div>
                          <div style={{ fontSize: 11 }}>No image uploaded</div>
                        </div>
                      )}
                      {uploadingImage && (
                        <div
                          style={{
                            position: "absolute", inset: 0,
                            backgroundColor: "rgba(0,0,0,0.6)",
                            display: "flex", alignItems: "center",
                            justifyContent: "center", gap: 8,
                            color: C.white, fontSize: 12,
                          }}
                        >
                          ⏳ Uploading…
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Upload button + URL paste */}
                  <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileSelected}
                      style={{ display: "none" }}
                    />
                    <button
                      type="button"
                      disabled={uploadingImage}
                      onClick={() => imageInputRef.current?.click()}
                      style={btnOutline}
                    >
                      💻 {editingCat.coverImage ? "Replace Image" : "Upload Image"}
                    </button>
                    {editingCat.coverImage && (
                      <button
                        type="button"
                        onClick={() => setEditingCat({ ...editingCat, coverImage: "" })}
                        style={{ fontSize: 12, color: "#DC2626", background: "none", border: "none", cursor: "pointer" }}
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {/* URL paste */}
                  <div>
                    <label style={{ ...labelStyle, marginBottom: 4 }}>Or paste image URL directly</label>
                    <input
                      type="url"
                      style={{ ...inputStyle, fontFamily: "monospace", fontSize: 12, color: C.gold }}
                      value={editingCat.coverImage || ""}
                      onChange={(e) => setEditingCat({ ...editingCat, coverImage: e.target.value })}
                      placeholder="https://cdn.example.com/cover.jpg"
                    />
                  </div>
                </div>
              </div>

              {/* Modal footer */}
              <div
                style={{
                  padding: "14px 24px", borderTop: `1px solid ${C.border}`,
                  backgroundColor: C.surface,
                  display: "flex", alignItems: "center", justifyContent: "flex-end",
                  gap: 10, flexShrink: 0,
                }}
              >
                <button type="button" disabled={saving} onClick={closeModal} style={btnOutline}>
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={saving || uploadingImage}
                  onClick={handleSave}
                  style={btnGold}
                >
                  {saving ? "⏳ Saving…" : "✅ Save Category"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import AdminNav from "@/components/AdminNav";
import { FaqItem } from "@/lib/types";
import {
  HelpCircle,
  Plus,
  Search,
  Upload,
  Download,
  Trash2,
  Edit2,
  ExternalLink,
  Save,
  X,
  CheckCircle,
  RefreshCw,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

export default function AdminFaqPage() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedBrand, setSelectedBrand] = useState<string>("All");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [importing, setImporting] = useState<boolean>(false);

  // Form State
  const [editingFaq, setEditingFaq] = useState<Partial<FaqItem>>({
    category: "General & Showroom",
    brand: "",
    question: "",
    answer: "",
    sequenceNumber: 1,
  });

  const [customCategory, setCustomCategory] = useState<string>("");

  useEffect(() => {
    fetchFaqs();
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/faq?t=${Date.now()}`, { cache: "no-store" });
      const json = await res.json();
      if (json && json.success && Array.isArray(json.data)) {
        setFaqs(json.data);
      }
    } catch (e) {
      console.error("Error fetching FAQs:", e);
    } finally {
      setLoading(false);
    }
  };

  // Categories and Brands derived from FAQ list + Presets
  const defaultCategoryPresets = [
    "General & Showroom",
    "Surfaces & Materials",
    "Kitchens & Wardrobes",
    "Hardware & Fittings",
    "Architects & Commercial",
    "Freedom Screens",
    "FIMA Carlo Frattini",
    "Falper",
    "NewTechWood",
    "Mafi",
    "Slashform",
    "Waltz",
    "WOW",
    "Loco",
    "Bullfrog Spas",
    "Formica",
    "Mirage",
  ];

  const allCategories = useMemo(() => {
    const fromData = faqs.map((f) => f.category).filter(Boolean);
    const merged = Array.from(new Set(["All", ...defaultCategoryPresets, ...fromData]));
    return merged;
  }, [faqs]);

  const allBrands = useMemo(() => {
    const fromData = faqs.map((f) => f.brand).filter(Boolean) as string[];
    return Array.from(new Set(["All", ...fromData]));
  }, [faqs]);

  // Filtered FAQs
  const filteredFaqs = useMemo(() => {
    return faqs.filter((f) => {
      const matchesCat = selectedCategory === "All" || f.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesBrand = selectedBrand === "All" || (f.brand || "").toLowerCase() === selectedBrand.toLowerCase();
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q) ||
        (f.brand && f.brand.toLowerCase().includes(q));
      return matchesCat && matchesBrand && matchesSearch;
    });
  }, [faqs, selectedCategory, selectedBrand, searchQuery]);

  // Save / Update FAQ
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaq.question?.trim() || !editingFaq.answer?.trim()) {
      showToast("Please provide both a Question and an Answer.");
      return;
    }

    if (customCategory !== "" && !customCategory.trim()) {
      showToast("Custom Category cannot be empty.");
      return;
    }

    setSaving(true);
    try {
      const finalCategory = customCategory.trim() || editingFaq.category || "General";
      const payload = {
        ...editingFaq,
        category: finalCategory,
      };

      const res = await fetch("/api/faq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        showToast(editingFaq.id ? "✓ FAQ updated successfully!" : "✓ New FAQ created!");
        setShowModal(false);
        setCustomCategory("");
        fetchFaqs();
      } else {
        showToast("Error: " + (json.error || "Failed to save FAQ"));
      }
    } catch (err: any) {
      showToast("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Delete FAQ
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ item?")) return;
    try {
      const res = await fetch(`/api/faq?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        showToast("✓ FAQ deleted.");
        setFaqs((prev) => prev.filter((f) => f.id !== id));
      } else {
        showToast("Error: " + (json.error || "Failed to delete"));
      }
    } catch (err: any) {
      showToast("Error: " + err.message);
    }
  };

  // Excel File Upload & Import
  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const xlsx = await import("xlsx");
      const data = await file.arrayBuffer();
      const workbook = xlsx.read(data, { type: "array" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const rawRows = xlsx.utils.sheet_to_json(firstSheet, { header: 1 }) as any[][];

      const brandKeywords: { name: string; keys: string[] }[] = [
        { name: "FIMA Carlo Frattini", keys: ["fima", "frattini", "spillo tech"] },
        { name: "Falper", keys: ["falper", "senzafine", "cristalplant"] },
        { name: "Freedom Screens", keys: ["freedom screen", "freedom screens", "retractable screen"] },
        { name: "NewTechWood", keys: ["newtechwood", "newtech wood", "ultrashield", "wpc decking"] },
        { name: "Mafi", keys: ["mafi", "austrian wood", "natural wood flooring"] },
        { name: "Slashform", keys: ["slashform", "kitchen system"] },
        { name: "Waltz", keys: ["waltz", "jb glass", "glass partition"] },
        { name: "WOW", keys: ["wow", "ceramic tiles", "bejmat", "aquarelle"] },
        { name: "Loco", keys: ["loco", "millwork"] },
        { name: "Bullfrog Spas", keys: ["bullfrog", "jetpak", "enduraframe", "swim spa"] },
        { name: "Formica", keys: ["formica", "fenix", "homapal", "arpa vis"] },
        { name: "Mirage", keys: ["mirage", "porcelain slab", "elysian"] },
        { name: "Inkiostro Bianco", keys: ["inkiostro", "wallcoverings"] },
        { name: "Peelply", keys: ["peelply", "plywood"] },
      ];

      const parsed: FaqItem[] = [];
      let currentQ: string | null = null;

      for (let i = 0; i < rawRows.length; i++) {
        const row = rawRows[i];
        if (!row || row.length === 0 || !row[0]) continue;
        const text = String(row[0]).trim();

        // 2-column Q&A check
        if (row.length >= 2 && row[1]) {
          const qText = String(row[0]).trim().replace(/^\d+\.\s*/, "");
          const aText = String(row[1]).trim();
          let matched = "General & Showroom";
          let brandName = "";
          for (const b of brandKeywords) {
            if (b.keys.some((k) => qText.toLowerCase().includes(k) || aText.toLowerCase().includes(k))) {
              matched = b.name;
              brandName = b.name;
              break;
            }
          }
          parsed.push({
            id: `faq-xl-${Date.now()}-${parsed.length + 1}`,
            sequenceNumber: parsed.length + 1,
            category: matched,
            brand: brandName || undefined,
            question: qText,
            answer: aText,
          });
          continue;
        }

        // Alternating row check
        if (/^\d+\.\s+/.test(text) || text.endsWith("?")) {
          currentQ = text;
        } else if (currentQ) {
          const cleanQ = currentQ.replace(/^\d+\.\s*/, "").trim();
          let matched = "General & Showroom";
          let brandName = "";
          for (const b of brandKeywords) {
            if (b.keys.some((k) => cleanQ.toLowerCase().includes(k) || text.toLowerCase().includes(k))) {
              matched = b.name;
              brandName = b.name;
              break;
            }
          }
          parsed.push({
            id: `faq-xl-${Date.now()}-${parsed.length + 1}`,
            sequenceNumber: parsed.length + 1,
            category: matched,
            brand: brandName || undefined,
            question: cleanQ,
            answer: text,
          });
          currentQ = null;
        }
      }

      if (parsed.length === 0) {
        alert("No question/answer rows detected in the uploaded file.");
        return;
      }

      // Save to server
      const res = await fetch("/api/faq", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });

      const json = await res.json();
      if (json.success) {
        showToast(`✓ Successfully imported ${parsed.length} FAQs from Excel!`);
        fetchFaqs();
      } else {
        alert("Error saving imported FAQs: " + json.error);
      }
    } catch (err: any) {
      alert("Failed to parse Excel file: " + err.message);
    } finally {
      setImporting(false);
    }
  };

  // Export FAQs as CSV
  const handleExport = async () => {
    if (faqs.length === 0) return;
    const xlsx = await import("xlsx");
    const ws = xlsx.utils.json_to_sheet(
      faqs.map((f, i) => ({
        "Sl No": i + 1,
        Category: f.category,
        Brand: f.brand || "",
        Question: f.question,
        Answer: f.answer,
      }))
    );
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "FAQs");
    xlsx.writeFile(wb, "AAREN_Brandwise_FAQs.xlsx");
  };

  return (
    <div className="admin-page-container font-['Jost',sans-serif]">
      <AdminNav />

      <main className="admin-main-content admin-main">
        {/* HEADER SECTION */}
        <div className="top-header-nav">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <span className="section-pill">KNOWLEDGE BASE</span>
              <span className="count-pill">{faqs.length} FAQs Total</span>
            </div>
            <h1 className="page-title">FAQ & Brand Knowledge Manager</h1>
            <p className="page-sub">
              Manage all frequently asked questions, categorize by brand (*FIMA, Falper, Freedom Screens, Mafi, NewTechWood*), and import brand-wise Excel spreadsheets.
            </p>
          </div>

          <div className="action-buttons">
            <Link href="/faq" target="_blank" className="btn-secondary">
              <ExternalLink size={15} />
              <span>View Live FAQ Page</span>
            </Link>

            {/* Excel File Input */}
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              id="excelFaqUpload"
              style={{ display: "none" }}
              onChange={handleExcelUpload}
            />
            <label htmlFor="excelFaqUpload" className="btn-secondary" style={{ cursor: "pointer" }}>
              <Upload size={15} />
              <span>{importing ? "Importing..." : "📥 Import Excel / CSV"}</span>
            </label>

            <button onClick={handleExport} className="btn-secondary">
              <Download size={15} />
              <span>Export</span>
            </button>

            <button
              onClick={() => {
                setEditingFaq({
                  category: selectedCategory !== "All" ? selectedCategory : "General & Showroom",
                  brand: selectedBrand !== "All" ? selectedBrand : "",
                  question: "",
                  answer: "",
                  sequenceNumber: faqs.length + 1,
                });
                setCustomCategory("");
                setShowModal(true);
              }}
              className="btn-primary"
            >
              <Plus size={16} />
              <span>+ Add New FAQ</span>
            </button>
          </div>
        </div>

        {/* STATS STRIP */}
        <div className="stats-strip">
          <div className="stat-card">
            <span className="stat-num">{faqs.length}</span>
            <span className="stat-label">Total Questions</span>
          </div>
          <div className="stat-card">
            <span className="stat-num">{allCategories.filter((c) => c !== "All").length}</span>
            <span className="stat-label">Active Categories</span>
          </div>
          <div className="stat-card">
            <span className="stat-num">{faqs.filter((f) => !!f.brand).length}</span>
            <span className="stat-label">Brand-Specific FAQs</span>
          </div>
          <div className="stat-card">
            <span className="stat-num">{filteredFaqs.length}</span>
            <span className="stat-label">Displaying Matches</span>
          </div>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="filters-card">
          <div className="search-wrap">
            <Search size={16} color="#8c764b" />
            <input
              type="text"
              placeholder="Search by question, answer, brand, or category keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="clear-btn">
                ✕
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="category-chips-row">
            {allCategories.map((cat) => {
              const count = cat === "All" ? faqs.length : faqs.filter((f) => f.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`cat-chip ${selectedCategory === cat ? "active" : ""}`}
                >
                  <span>{cat}</span>
                  <span className="cat-badge">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* FAQ CARDS LIST */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#8c764b" }}>
            <RefreshCw size={28} className="animate-spin" style={{ margin: "0 auto 12px" }} />
            <div style={{ fontWeight: 700, textTransform: "uppercase" }}>Loading FAQs...</div>
          </div>
        ) : filteredFaqs.length === 0 ? (
          <div className="empty-state">
            <HelpCircle size={48} color="#cbd5e1" style={{ margin: "0 auto 12px" }} />
            <h3 style={{ fontSize: "16px", fontWeight: 700 }}>No FAQs Match Your Filter</h3>
            <p style={{ color: "#64748b", fontSize: "13px", marginTop: "4px" }}>
              Try searching with another keyword or click &ldquo;+ Add New FAQ&rdquo; to create one.
            </p>
          </div>
        ) : (
          <div className="faqs-grid">
            {filteredFaqs.map((faq, idx) => (
              <div key={faq.id || idx} className="faq-admin-card">
                <div className="card-top">
                  <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                    <span className="idx-tag">#{idx + 1}</span>
                    <span className="category-tag">{faq.category}</span>
                    {faq.brand && <span className="brand-tag">🏢 {faq.brand}</span>}
                  </div>
                  <div className="card-actions">
                    <button
                      onClick={() => {
                        setEditingFaq(faq);
                        setShowModal(true);
                      }}
                      className="btn-icon edit"
                      title="Edit FAQ"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(faq.id)}
                      className="btn-icon delete"
                      title="Delete FAQ"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <h3 className="faq-card-question">{faq.question}</h3>
                <p className="faq-card-answer">{faq.answer}</p>
              </div>
            ))}
          </div>
        )}

        {/* ADD / EDIT MODAL */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <div>
                  <h2 style={{ fontSize: "18px", fontWeight: 800, margin: 0 }}>
                    {editingFaq.id ? "Edit FAQ Item" : "Add New FAQ"}
                  </h2>
                  <p style={{ fontSize: "12px", color: "#64748b", margin: "2px 0 0" }}>
                    Create or update questions and detailed answers for customer knowledge base.
                  </p>
                </div>
                <button onClick={() => setShowModal(false)} className="close-btn">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSave} className="modal-form">
                {/* Category Preset Selection */}
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={customCategory ? "CUSTOM" : editingFaq.category || "General & Showroom"}
                    onChange={(e) => {
                      if (e.target.value === "CUSTOM") {
                        setCustomCategory(editingFaq.category || "New Category");
                      } else {
                        setCustomCategory("");
                        setEditingFaq({ ...editingFaq, category: e.target.value });
                      }
                    }}
                  >
                    {allCategories
                      .filter((c) => c !== "All")
                      .map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    <option value="CUSTOM">+ Create Custom Category...</option>
                  </select>
                </div>

                {/* Custom Category Input */}
                {customCategory !== "" && (
                  <div className="form-group">
                    <label>New Custom Category Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Acoustic Solutions, Smart Pergolas..."
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                    />
                  </div>
                )}

                {/* Brand Selection */}
                <div className="form-group">
                  <label>Associated Partner Brand (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Freedom Screens, FIMA, Falper, NewTechWood..."
                    value={editingFaq.brand || ""}
                    onChange={(e) => setEditingFaq({ ...editingFaq, brand: e.target.value })}
                  />
                  <small style={{ color: "#64748b", fontSize: "11px", marginTop: "3px", display: "block" }}>
                    If this FAQ is specific to a brand, entering the brand name will link it.
                  </small>
                </div>

                {/* Question */}
                <div className="form-group">
                  <label>Question Text *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. What is Freedom Screens Infinite Zipline system?"
                    value={editingFaq.question || ""}
                    onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                  />
                </div>

                {/* Answer */}
                <div className="form-group">
                  <label>Detailed Answer *</label>
                  <textarea
                    rows={6}
                    required
                    placeholder="Provide a comprehensive and informative answer for architects, designers, and clients..."
                    value={editingFaq.answer || ""}
                    onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                  />
                </div>

                <div className="modal-actions">
                  <button type="button" onClick={() => setShowModal(false)} className="btn-cancel">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className="btn-primary">
                    <Save size={15} />
                    <span>{saving ? "Saving..." : editingFaq.id ? "Update FAQ" : "Create FAQ"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* FLOATING TOAST */}
      <div className={`toast ${toastMsg ? "show" : ""}`}>
        <span>{toastMsg}</span>
      </div>

      {/* STYLES */}
      <style jsx global>{`
        .admin-page-container {
          background: #0b0f19;
          color: #f8fafc;
          min-height: 100vh;
          font-size: 13px;
        }

        .admin-main {
          max-width: 1400px;
          margin: 0 auto;
          padding: 32px 24px 80px;
        }

        @media (min-width: 640px) {
          .admin-main { padding: 36px 48px 80px; }
        }

        .top-header-nav {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 24px;
          padding-bottom: 20px;
          border-bottom: 1px solid #1e293b;
        }

        .section-pill {
          background: linear-gradient(135deg, #d4af37 0%, #aa820a 100%);
          color: #000000;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.1em;
          padding: 3px 8px;
          border-radius: 4px;
          text-transform: uppercase;
        }

        .count-pill {
          background: #1e293b;
          color: #94a3b8;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 4px;
          border: 1px solid #334155;
        }

        .page-title {
          font-size: 26px;
          font-weight: 800;
          color: #ffffff;
          text-transform: uppercase;
          letter-spacing: -0.01em;
          margin: 4px 0;
        }

        .page-sub {
          color: #cbd5e1;
          font-size: 13px;
          margin: 0;
        }

        .action-buttons {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          background: linear-gradient(135deg, #d4af37 0%, #aa820a 100%);
          color: #000000;
          border-radius: 8px;
          font-weight: 800;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border: none;
          cursor: pointer;
          transition: transform 0.2s;
          box-shadow: 0 4px 14px rgba(212, 175, 55, 0.35);
        }
        .btn-primary:hover { transform: translateY(-1px); }

        .btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 14px;
          background: #1e293b;
          color: #f8fafc;
          border: 1px solid #334155;
          border-radius: 8px;
          font-weight: 700;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s;
        }
        .btn-secondary:hover { background: #334155; }

        .stats-strip {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 14px;
          margin-bottom: 24px;
        }

        .stat-card {
          background: #151c2c;
          padding: 16px 20px;
          border-radius: 12px;
          border: 1px solid #28334e;
          box-shadow: 0 4px 16px rgba(0,0,0,0.3);
        }

        .stat-num {
          display: block;
          font-size: 24px;
          font-weight: 900;
          color: #d4af37;
          line-height: 1;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #94a3b8;
        }

        .filters-card {
          background: #151c2c;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
          border: 1px solid #28334e;
          margin-bottom: 24px;
        }

        .search-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #0f172a;
          border: 1px solid #334155;
          border-radius: 10px;
          padding: 10px 16px;
          margin-bottom: 16px;
        }

        .search-wrap input {
          flex: 1;
          border: none;
          background: transparent;
          font-size: 13px;
          color: #ffffff;
          outline: none;
        }

        .clear-btn {
          border: none;
          background: none;
          color: #94a3b8;
          cursor: pointer;
        }

        .category-chips-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .cat-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 999px;
          background: #0f172a;
          border: 1px solid #334155;
          font-size: 11px;
          font-weight: 700;
          color: #cbd5e1;
          cursor: pointer;
          transition: all 0.2s;
        }
        .cat-chip:hover { border-color: #d4af37; color: #d4af37; }
        .cat-chip.active {
          background: #d4af37;
          color: #000000;
          border-color: #d4af37;
        }

        .cat-badge {
          background: rgba(255,255,255,0.15);
          padding: 1px 6px;
          border-radius: 999px;
          font-size: 10px;
        }
        .cat-chip.active .cat-badge {
          background: rgba(0,0,0,0.25);
          color: #000000;
        }

        .faqs-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }

        @media (min-width: 768px) {
          .faqs-grid { grid-template-columns: 1fr 1fr; }
        }

        .faq-admin-card {
          background: #151c2c;
          border-radius: 12px;
          padding: 20px;
          border: 1px solid #28334e;
          box-shadow: 0 4px 16px rgba(0,0,0,0.3);
          display: flex;
          flex-direction: column;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .faq-admin-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.5);
          border-color: rgba(212, 175, 55, 0.4);
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .idx-tag {
          font-size: 10px;
          font-weight: 800;
          color: #d4af37;
          background: rgba(212, 175, 55, 0.15);
          border: 1px solid rgba(212, 175, 55, 0.3);
          padding: 2px 6px;
          border-radius: 4px;
        }

        .category-tag {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          background: #1e293b;
          color: #38bdf8;
          padding: 2px 8px;
          border-radius: 4px;
          border: 1px solid #334155;
        }

        .brand-tag {
          font-size: 10px;
          font-weight: 800;
          background: rgba(212, 175, 55, 0.15);
          color: #d4af37;
          border: 1px solid rgba(212, 175, 55, 0.3);
          padding: 2px 8px;
          border-radius: 4px;
        }

        .card-actions {
          display: flex;
          gap: 4px;
        }

        .btn-icon {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-icon.edit { background: #2563eb; color: #ffffff; }
        .btn-icon.edit:hover { background: #1d4ed8; }
        .btn-icon.delete { background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); }
        .btn-icon.delete:hover { background: rgba(239, 68, 68, 0.3); }

        .faq-card-question {
          font-size: 15px;
          font-weight: 800;
          color: #ffffff;
          margin: 0 0 8px;
          line-height: 1.35;
        }

        .faq-card-answer {
          font-size: 12px;
          color: #cbd5e1;
          line-height: 1.55;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          background: #151c2c;
          border-radius: 16px;
          border: 1px dashed #334155;
          color: #94a3b8;
        }

        /* MODAL */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.85);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          padding: 16px;
        }

        .modal-content {
          background: #111827;
          border: 1px solid rgba(212, 175, 55, 0.4);
          border-radius: 16px;
          width: 100%;
          max-width: 600px;
          padding: 24px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 40px rgba(0,0,0,0.6);
          color: #ffffff;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
          padding-bottom: 14px;
          border-bottom: 1px solid #1e293b;
        }

        .close-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #94a3b8;
        }

        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-group label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #f1f5f9;
          margin-bottom: 6px;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 10px 12px;
          border-radius: 8px;
          border: 1px solid #334155;
          background: #0b0e14;
          font-size: 13px;
          font-family: inherit;
          color: #ffffff;
          outline: none;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          border-color: #d4af37;
          background: #111827;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 8px;
        }

        .btn-cancel {
          padding: 10px 16px;
          background: #1e293b;
          color: #cbd5e1;
          border-radius: 8px;
          border: 1px solid #334155;
          font-weight: 700;
          cursor: pointer;
        }

        /* Floating Toast */
        .toast {
          position: fixed;
          bottom: 24px;
          right: 24px;
          background: #d4af37;
          color: #000000;
          padding: 12px 20px;
          border-radius: 8px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.4);
          font-weight: 800;
          font-size: 13px;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: none;
          z-index: 99999;
        }
        .toast.show {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminNav from "@/components/AdminNav";
import { ProductItem, ProjectItem } from "@/lib/types";
import { generateAarenProjectPDF } from "@/lib/pdfGenerator";

export default function AdminProjectsPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [projectForm, setProjectForm] = useState({
    title: "",
    client: "",
    category: "Residential Architecture",
    description: "",
  });

  const [selectedProductMap, setSelectedProductMap] = useState<
    Record<string, { quantity: number; finish?: string; notes?: string }>
  >({});

  useEffect(() => {
    fetchInitialData();
  }, []);

  async function fetchInitialData() {
    setLoading(true);
    try {
      const [prodRes, projRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/projects"),
      ]);

      const prodJson = await prodRes.json();
      const projJson = await projRes.json();

      if (prodJson.success) setProducts(prodJson.data);
      if (projJson.success) setProjects(projJson.data);
    } catch (err) {
      console.error("Error fetching admin project data:", err);
    } finally {
      setLoading(false);
    }
  }

  function toggleProductSelection(prodId: string) {
    setSelectedProductMap((prev) => {
      const next = { ...prev };
      if (next[prodId]) {
        delete next[prodId];
      } else {
        next[prodId] = { quantity: 1 };
      }
      return next;
    });
  }

  function updateQuantity(prodId: string, qty: number) {
    setSelectedProductMap((prev) => ({
      ...prev,
      [prodId]: { ...prev[prodId], quantity: Math.max(1, qty) },
    }));
  }

  async function handleCreateProjectAndPDF(e: React.FormEvent) {
    e.preventDefault();
    if (!projectForm.title || !projectForm.client) {
      alert("Please fill in Project Title and Client Name");
      return;
    }

    const selectedList = Object.keys(selectedProductMap).map((prodId) => {
      const prod = products.find((p) => p.id === prodId);
      const selData = selectedProductMap[prodId];
      return {
        productId: prodId,
        productName: prod ? prod.name : "Custom Product",
        brand: prod ? prod.brand : "Aaren",
        category: prod ? prod.category : "General",
        finish: prod ? prod.finish : undefined,
        dimensions: prod && prod.width ? `${prod.width} x ${prod.height || "-"}` : undefined,
        quantity: selData.quantity,
        notes: selData.notes,
        imageUrl: prod ? prod.imageUrl : undefined,
      };
    });

    setSubmitting(true);
    setMessage("Creating project & generating Aaren branded PDF report...");

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: projectForm.title,
          client: projectForm.client,
          category: projectForm.category,
          description: projectForm.description,
          selectedProducts: selectedList,
        }),
      });

      const json = await res.json();
      if (json.success) {
        // Generate PDF
        const pdfDoc = generateAarenProjectPDF({
          title: projectForm.title,
          client: projectForm.client,
          category: projectForm.category,
          description: projectForm.description,
          selectedProducts: selectedList,
        });

        // Trigger PDF Download
        const filename = `AAREN_PROJECT_${projectForm.title.toUpperCase().replace(/[^A-Z0-9]/g, "_")}.pdf`;
        pdfDoc.save(filename);

        setMessage(`🎉 Project created successfully! PDF "${filename}" downloaded automatically.`);
        fetchInitialData();
        setProjectForm({ title: "", client: "", category: "Residential Architecture", description: "" });
        setSelectedProductMap({});
      } else {
        setMessage(`Error: ${json.error}`);
      }
    } catch (err: any) {
      setMessage(`Failed: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  }

  function downloadExistingProjectPDF(project: ProjectItem) {
    const pdfDoc = generateAarenProjectPDF({
      title: project.title,
      client: project.client,
      category: project.category,
      description: project.description,
      selectedProducts: project.selectedProducts || [],
    });
    const filename = `AAREN_PROJECT_${project.title.toUpperCase().replace(/[^A-Z0-9]/g, "_")}.pdf`;
    pdfDoc.save(filename);
  }

  return (
    <div style={{ background: "#0a0a0c", color: "#f0f0f2", minHeight: "100vh" }}>
      <AdminNav />
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "2rem" }}>
      {/* Navigation Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", borderBottom: "1px solid #222", paddingBottom: "1.5rem" }}>
        <div>
          <div style={{ fontSize: "0.85rem", color: "#888", letterSpacing: "0.1em", textTransform: "uppercase" }}>AAREN STUDIO ADMIN</div>
          <h1 style={{ fontSize: "2.4rem", fontWeight: 700, margin: "0.2rem 0" }}>Project Builder & PDF Generator</h1>
          <p style={{ color: "#aaa", fontSize: "0.95rem" }}>Create architectural projects, select products, and export branded PDF catalogs.</p>
        </div>
        <Link href="/admin/products" style={{ padding: "0.8rem 1.4rem", background: "#222", color: "#fff", textDecoration: "none", borderRadius: "6px", fontSize: "0.9rem", fontWeight: 600 }}>
          ← Back to Products Upload
        </Link>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        {/* LEFT COLUMN: Project Creation Form */}
        <div style={{ background: "#141418", border: "1px solid #222", borderRadius: "12px", padding: "2rem" }}>
          <h2 style={{ fontSize: "1.4rem", marginBottom: "1.5rem", borderBottom: "1px solid #222", paddingBottom: "0.8rem" }}>Create New Project</h2>

          <form onSubmit={handleCreateProjectAndPDF} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", color: "#888", marginBottom: "0.4rem" }}>Project Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Prestige Golfshire Villa Living Room"
                value={projectForm.title}
                onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                style={{ width: "100%", padding: "0.8rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px", fontSize: "0.95rem" }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#888", marginBottom: "0.4rem" }}>Client Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mr. Rajesh Kumar"
                  value={projectForm.client}
                  onChange={(e) => setProjectForm({ ...projectForm, client: e.target.value })}
                  style={{ width: "100%", padding: "0.8rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#888", marginBottom: "0.4rem" }}>Category *</label>
                <select
                  value={projectForm.category}
                  onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                  style={{ width: "100%", padding: "0.8rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
                >
                  <option value="Residential Villa">Residential Villa</option>
                  <option value="Luxury Penthouse">Luxury Penthouse</option>
                  <option value="Commercial Office">Commercial Office</option>
                  <option value="Hospitality & Retail">Hospitality & Retail</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.85rem", color: "#888", marginBottom: "0.4rem" }}>Project Overview / Notes</label>
              <textarea
                rows={3}
                placeholder="Key specifications, material requirements, and architectural theme..."
                value={projectForm.description}
                onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                style={{ width: "100%", padding: "0.8rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px" }}
              />
            </div>

            {/* Product Selection List */}
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", color: "#888", marginBottom: "0.5rem" }}>
                Select Products for Project ({Object.keys(selectedProductMap).length} selected)
              </label>
              <div style={{ maxHeight: "280px", overflowY: "auto", border: "1px solid #222", borderRadius: "6px", background: "#0a0a0c" }}>
                {products.map((p) => {
                  const isSelected = !!selectedProductMap[p.id];
                  return (
                    <div
                      key={p.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0.75rem 1rem",
                        borderBottom: "1px solid #1a1a20",
                        background: isSelected ? "rgba(59, 130, 246, 0.1)" : "transparent",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", cursor: "pointer" }} onClick={() => toggleProductSelection(p.id)}>
                        <input type="checkbox" checked={isSelected} readOnly />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: "0.9rem", color: isSelected ? "#60a5fa" : "#fff" }}>{p.name}</div>
                          <div style={{ fontSize: "0.78rem", color: "#777" }}>
                            {p.brand} | {p.category} {p.finish ? `(${p.finish})` : ""}
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span style={{ fontSize: "0.75rem", color: "#aaa" }}>Qty:</span>
                          <input
                            type="number"
                            min={1}
                            value={selectedProductMap[p.id].quantity}
                            onChange={(e) => updateQuantity(p.id, parseInt(e.target.value, 10) || 1)}
                            style={{ width: "50px", padding: "0.3rem", background: "#1a1a20", border: "1px solid #333", color: "#fff", borderRadius: "4px", textAlign: "center" }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                marginTop: "1rem",
                padding: "1rem",
                background: "linear-gradient(135deg, #22c55e 0%, #15803d 100%)",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontWeight: 700,
                fontSize: "1rem",
                cursor: submitting ? "wait" : "pointer",
              }}
            >
              {submitting ? "Generating PDF & Saving..." : "✨ Create Project & Download PDF"}
            </button>

            {message && (
              <div style={{ padding: "0.8rem", borderRadius: "6px", background: message.startsWith("Error") ? "rgba(239, 68, 68, 0.2)" : "rgba(34, 197, 94, 0.2)", color: message.startsWith("Error") ? "#f87171" : "#4ade80", fontSize: "0.9rem" }}>
                {message}
              </div>
            )}
          </form>
        </div>

        {/* RIGHT COLUMN: Existing Projects List & PDF Downloads */}
        <div style={{ background: "#141418", border: "1px solid #222", borderRadius: "12px", padding: "2rem" }}>
          <h2 style={{ fontSize: "1.4rem", marginBottom: "1.5rem", borderBottom: "1px solid #222", paddingBottom: "0.8rem" }}>Existing Projects & PDF Downloads</h2>

          {loading ? (
            <div style={{ color: "#888", textAlign: "center", padding: "2rem" }}>Loading projects...</div>
          ) : projects.length === 0 ? (
            <div style={{ color: "#888", textAlign: "center", padding: "2rem" }}>No projects created yet. Create one above to test PDF generation.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {projects.map((proj) => (
                <div key={proj.id} style={{ background: "#0a0a0c", border: "1px solid #222", borderRadius: "8px", padding: "1.2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "1.05rem", color: "#fff" }}>{proj.title}</div>
                    <div style={{ fontSize: "0.82rem", color: "#aaa", marginTop: "0.2rem" }}>
                      Client: <strong>{proj.client}</strong> | {proj.category} | {proj.selectedProducts?.length || 0} products
                    </div>
                  </div>
                  <button
                    onClick={() => downloadExistingProjectPDF(proj)}
                    style={{ padding: "0.6rem 1.1rem", background: "#333", color: "#fff", border: "1px solid #444", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.4rem" }}
                  >
                    📄 Export PDF
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);
}

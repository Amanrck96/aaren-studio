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
    category: "Single Residential",
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

      if (!prodRes.ok) throw new Error("Failed to fetch products: " + prodRes.statusText);
      if (!projRes.ok) throw new Error("Failed to fetch projects: " + projRes.statusText);

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

    if (Object.keys(selectedProductMap).length === 0) {
      alert("Please select at least one product for this project catalog.");
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
    <div style={{ background: "#FAF8F5", color: "#1E1E1E", minHeight: "100vh" }}>
      <AdminNav />
      <main className="admin-main-content" style={{ flex: 1, padding: "2.5rem 3rem", background: "#FAF8F5" }}>
        {/* Navigation Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", borderBottom: "1px solid #DCD5C6", paddingBottom: "1.5rem" }}>
          <div>
            <div style={{ fontSize: "0.85rem", color: "#81663F", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 800 }}>AAREN STUDIO ADMIN</div>
            <h1 style={{ fontSize: "2.4rem", fontWeight: 900, color: "#1E1E1E", margin: "0.2rem 0" }}>Project Builder & PDF Generator</h1>
            <p style={{ color: "#555555", fontSize: "0.95rem" }}>Create architectural projects, select products, and export branded PDF catalogs.</p>
          </div>
          <Link href="/admin/products" style={{ padding: "0.8rem 1.4rem", background: "#F4EFE6", color: "#1E1E1E", textDecoration: "none", borderRadius: "8px", fontSize: "0.9rem", fontWeight: 700, border: "1px solid #D5CEBF" }}>
            ← Back to Products Upload
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
          {/* LEFT COLUMN: Project Creation Form */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E2DCD2", borderRadius: "16px", padding: "2rem", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#81663F", marginBottom: "1.5rem", borderBottom: "1px solid #EAE4D8", paddingBottom: "0.8rem" }}>Create New Project</h2>

            <form onSubmit={handleCreateProjectAndPDF} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#1E1E1E", marginBottom: "0.4rem", fontWeight: 700 }}>Project Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Prestige Golfshire Villa Living Room"
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  style={{ width: "100%", padding: "0.8rem", background: "#FAF8F5", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "8px", fontSize: "0.95rem" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#1E1E1E", marginBottom: "0.4rem", fontWeight: 700 }}>Client Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mr. Rajesh Kumar"
                    value={projectForm.client}
                    onChange={(e) => setProjectForm({ ...projectForm, client: e.target.value })}
                    style={{ width: "100%", padding: "0.8rem", background: "#FAF8F5", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "8px" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#1E1E1E", marginBottom: "0.4rem", fontWeight: 700 }}>Project Type / Category *</label>
                  <select
                    value={projectForm.category}
                    onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                    style={{ width: "100%", padding: "0.8rem", background: "#FAF8F5", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "8px" }}
                  >
                    <option value="Single Residential">Single Residential</option>
                    <option value="Multi Residential">Multi Residential</option>
                    <option value="Property Staging">Property Staging</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Hospitality">Hospitality</option>
                    <option value="Retail">Retail</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Institutional">Institutional</option>
                    <option value="Government">Government</option>
                    <option value="Set And Creative Design">Set And Creative Design</option>
                    <option value="Community Spaces">Community Spaces</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#1E1E1E", marginBottom: "0.4rem", fontWeight: 700 }}>Project Overview / Notes</label>
                <textarea
                  rows={3}
                  placeholder="Key specifications, material requirements, and architectural theme..."
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  style={{ width: "100%", padding: "0.8rem", background: "#FAF8F5", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "8px" }}
                />
              </div>

              {/* Product Selection List */}
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#1E1E1E", marginBottom: "0.5rem", fontWeight: 700 }}>
                  Select Products for Project ({Object.keys(selectedProductMap).length} selected)
                </label>
                <div style={{ maxHeight: "280px", overflowY: "auto", border: "1px solid #D5CEBF", borderRadius: "8px", background: "#FAF8F5" }}>
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
                          borderBottom: "1px solid #EAE4D8",
                          background: isSelected ? "rgba(129, 102, 63, 0.12)" : "transparent",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", cursor: "pointer" }} onClick={() => toggleProductSelection(p.id)}>
                          <input type="checkbox" checked={isSelected} readOnly />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: "0.9rem", color: isSelected ? "#81663F" : "#1E1E1E" }}>{p.name}</div>
                            <div style={{ fontSize: "0.78rem", color: "#6A6359" }}>
                              {p.brand} | {p.category} {p.finish ? `(${p.finish})` : ""}
                            </div>
                          </div>
                        </div>

                        {isSelected && (
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <span style={{ fontSize: "0.75rem", color: "#1E1E1E", fontWeight: 600 }}>Qty:</span>
                            <input
                              type="number"
                              min={1}
                              value={selectedProductMap[p.id].quantity}
                              onChange={(e) => updateQuantity(p.id, parseInt(e.target.value, 10) || 1)}
                              style={{ width: "50px", padding: "0.3rem", background: "#FFFFFF", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "6px", textAlign: "center" }}
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
                  background: "#1E1E1E",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: 800,
                  fontSize: "1rem",
                  cursor: submitting ? "wait" : "pointer",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
                }}
              >
                {submitting ? "Generating PDF & Saving..." : "✨ Create Project & Download PDF"}
              </button>

              {message && (
                <div style={{ padding: "0.8rem", borderRadius: "8px", background: message.startsWith("Failed") || message.startsWith("Error") ? "#FEE2E2" : "#D1FAE5", color: message.startsWith("Failed") || message.startsWith("Error") ? "#B91C1C" : "#065F46", fontSize: "0.9rem", fontWeight: 700, border: "1px solid #DCD5C6" }}>
                  {message}
                </div>
              )}
            </form>
          </div>

          {/* RIGHT COLUMN: Existing Projects List & PDF Downloads */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E2DCD2", borderRadius: "16px", padding: "2rem", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#81663F", marginBottom: "1.5rem", borderBottom: "1px solid #EAE4D8", paddingBottom: "0.8rem" }}>Existing Projects & PDF Downloads</h2>

            {loading ? (
              <div style={{ color: "#6A6359", textAlign: "center", padding: "2rem" }}>Loading projects...</div>
            ) : projects.length === 0 ? (
              <div style={{ color: "#6A6359", textAlign: "center", padding: "2rem" }}>No projects created yet. Create one above to test PDF generation.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {projects.map((proj) => (
                  <div key={proj.id} style={{ background: "#FAF8F5", border: "1px solid #E2DCD2", borderRadius: "12px", padding: "1.4rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: "1.1rem", color: "#1E1E1E" }}>{proj.title}</div>
                      <div style={{ fontSize: "0.88rem", color: "#555555", marginTop: "0.3rem" }}>
                        Client: <strong style={{ color: "#81663F" }}>{proj.client}</strong> | Category: <span style={{ color: "#1E1E1E" }}>{proj.category}</span> | Products: {proj.selectedProducts?.length || 0}
                      </div>
                    </div>
                    <button
                      onClick={() => downloadExistingProjectPDF(proj)}
                      style={{ padding: "0.6rem 1.2rem", background: "#1E1E1E", color: "#FFFFFF", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "0.88rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "0.4rem", boxShadow: "0 4px 14px rgba(0,0,0,0.12)" }}
                    >
                      📄 Export PDF
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}


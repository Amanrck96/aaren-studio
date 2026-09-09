"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import AdminNav from "@/components/AdminNav";
import { ShopItem, ShopSettingsItem, DEFAULT_SHOP_SETTINGS } from "@/lib/types";
import {
  ShoppingBag,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Save,
  CheckCircle2,
  Search,
  SlidersHorizontal,
  X,
  Copy,
  Layers,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

export default function AdminShopPage() {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [settings, setSettings] = useState<ShopSettingsItem>(DEFAULT_SHOP_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Modal State for Add / Edit
  const [editingItem, setEditingItem] = useState<Partial<ShopItem> | null>(null);
  const [isSavingItem, setIsSavingItem] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const fetchShopData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/shop?t=${Date.now()}`, { cache: "no-store" });
      const json = await res.json();
      if (json.success) {
        if (Array.isArray(json.data)) setItems(json.data);
        if (json.settings) setSettings(json.settings);
      }
    } catch (err: any) {
      showToast("❌ Error loading shop data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShopData();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await fetch("/api/shop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "settings", settings }),
      });
      const json = await res.json();
      if (json.success) {
        showToast("✨ Shop Page Header Settings Saved!");
      } else {
        showToast("❌ Error saving settings: " + json.error);
      }
    } catch (err: any) {
      showToast("❌ Network error: " + err.message);
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.name) {
      alert("Specimen name is required.");
      return;
    }
    setIsSavingItem(true);
    try {
      const res = await fetch("/api/shop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingItem),
      });
      const json = await res.json();
      if (json.success && json.data) {
        showToast(editingItem.id ? "✅ Specimen updated successfully!" : "🎉 New specimen added to Shop!");
        setEditingItem(null);
        await fetchShopData();
      } else {
        alert("Error saving: " + (json.error || "Unknown error"));
      }
    } catch (err: any) {
      alert("Error saving item: " + err.message);
    } finally {
      setIsSavingItem(false);
    }
  };

  const handleDeleteItem = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}" from the shop?`)) return;
    try {
      const res = await fetch(`/api/shop?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        showToast("🗑️ Specimen deleted from Shop.");
        setItems((prev) => prev.filter((it) => it.id !== id));
      } else {
        alert("Error deleting: " + json.error);
      }
    } catch (err: any) {
      alert("Error deleting item: " + err.message);
    }
  };

  const handleDuplicateItem = (item: ShopItem) => {
    const dup: Partial<ShopItem> = {
      ...item,
      id: undefined,
      name: `${item.name} (Copy)`,
      num: String(Number(item.num || 0) + 1).padStart(2, "0"),
      sequenceNumber: (item.sequenceNumber || items.length) + 1,
    };
    setEditingItem(dup);
  };

  const categories = ["All", ...Array.from(new Set(items.map((i) => i.category || "General")))];

  const filteredItems = items.filter((it) => {
    const matchesCat = selectedCategory === "All" || it.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      it.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      it.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      it.spec.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (it.price && it.price.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div style={{ background: "#FAF8F5", color: "#1E1E1E", minHeight: "100vh", display: "flex", fontFamily: "var(--font-jost), 'Jost', sans-serif" }}>
      <AdminNav />

      <main className="admin-main-content" style={{ flex: 1, padding: "2.5rem 3rem", background: "#FAF8F5", maxWidth: "1400px", margin: "0 auto" }}>
        {/* Top Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2.5rem", borderBottom: "1px solid #DCD5C6", paddingBottom: "1.5rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ background: "rgba(129, 102, 63, 0.12)", color: "#81663F", border: "1px solid rgba(129, 102, 63, 0.25)", fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 800, padding: "4px 10px", borderRadius: "6px" }}>
                LUXURY CONTROL CENTER
              </span>
              <span style={{ background: "rgba(16, 185, 129, 0.12)", color: "#065f46", fontSize: "0.75rem", fontWeight: 700, padding: "4px 10px", borderRadius: "6px" }}>
                {items.length} Active Specimens
              </span>
            </div>
            <h1 style={{ fontSize: "2.4rem", fontWeight: 900, margin: "0.5rem 0 0.2rem", color: "#1E1E1E" }}>
              🛍️ Shop &amp; Specimen CMS
            </h1>
            <p style={{ color: "#555555", fontSize: "0.95rem", margin: 0 }}>
              Full administrative control of the live /shop tab: manage curated architectural specimens, quotes, pricing, and header specifications.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <Link
              href="/shop"
              target="_blank"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "10px 16px",
                background: "#FAF8F5",
                color: "#81663F",
                border: "1px solid #D5CEBF",
                borderRadius: "8px",
                fontWeight: 700,
                fontSize: "0.88rem",
                textDecoration: "none",
              }}
            >
              🌐 View Live Shop <ExternalLink size={14} />
            </Link>

            <button
              onClick={() =>
                setEditingItem({
                  name: "",
                  category: "Veneers",
                  code: "SP",
                  num: String(items.length + 1).padStart(2, "0"),
                  price: "₹1,500 / sqm",
                  image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80",
                  spec: "",
                  sequenceNumber: items.length + 1,
                  available: true,
                })
              }
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                background: "#81663F",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "8px",
                fontWeight: 800,
                fontSize: "0.9rem",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(129, 102, 63, 0.25)",
              }}
            >
              <Plus size={16} /> + Add New Specimen
            </button>
          </div>
        </div>

        {/* Section 1: Shop Page Header & Branding Customization */}
        <div style={{ background: "#FFFFFF", border: "1px solid #E2DCD2", borderRadius: "16px", padding: "1.8rem 2rem", marginBottom: "2.5rem", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.4rem", borderBottom: "1px solid #EAE4D8", paddingBottom: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "38px", height: "38px", borderRadius: "8px", background: "rgba(129, 102, 63, 0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Sparkles size={20} color="#81663F" />
              </div>
              <div>
                <h2 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0, color: "#1E1E1E" }}>
                  Shop Page Header &amp; Catalog Link Settings
                </h2>
                <p style={{ color: "#6A6359", fontSize: "0.85rem", margin: "2px 0 0" }}>
                  Customize the headline, meta banner, description paragraph, and exploration button on the public Shop page.
                </p>
              </div>
            </div>

            <button
              onClick={handleSaveSettings}
              disabled={savingSettings}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 18px",
                background: "#1E1E1E",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "8px",
                fontWeight: 700,
                fontSize: "0.85rem",
                cursor: savingSettings ? "wait" : "pointer",
              }}
            >
              <Save size={15} />
              {savingSettings ? "Saving..." : "Save Header Settings"}
            </button>
          </div>

          <form onSubmit={handleSaveSettings} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.2rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, textTransform: "uppercase", color: "#1E1E1E", marginBottom: "0.4rem" }}>
                Top Meta Text
              </label>
              <input
                type="text"
                value={settings.metaText || ""}
                onChange={(e) => setSettings({ ...settings, metaText: e.target.value })}
                placeholder="ARCHITECTURAL SPECIFICATION & SOURCING — SAMPLE SPECIMENS"
                style={{ width: "100%", padding: "10px 14px", border: "1px solid #D5CEBF", borderRadius: "8px", fontSize: "0.9rem" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, textTransform: "uppercase", color: "#1E1E1E", marginBottom: "0.4rem" }}>
                Shop Main Heading (H1)
              </label>
              <input
                type="text"
                value={settings.title || ""}
                onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                placeholder="SHOP"
                style={{ width: "100%", padding: "10px 14px", border: "1px solid #D5CEBF", borderRadius: "8px", fontSize: "0.9rem" }}
              />
            </div>

            <div style={{ gridColumn: "span 2" }}>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, textTransform: "uppercase", color: "#1E1E1E", marginBottom: "0.4rem" }}>
                Shop Description Subtitle
              </label>
              <textarea
                rows={2}
                value={settings.description || ""}
                onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                placeholder="Direct access to material specifications, sample sets, fixtures, and custom components curated for luxury architectural projects across India."
                style={{ width: "100%", padding: "10px 14px", border: "1px solid #D5CEBF", borderRadius: "8px", fontSize: "0.9rem" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, textTransform: "uppercase", color: "#1E1E1E", marginBottom: "0.4rem" }}>
                Explore Catalog Button Label
              </label>
              <input
                type="text"
                value={settings.exploreCatalogText || ""}
                onChange={(e) => setSettings({ ...settings, exploreCatalogText: e.target.value })}
                placeholder="Explore All 1,000+ Materials in Full Catalog"
                style={{ width: "100%", padding: "10px 14px", border: "1px solid #D5CEBF", borderRadius: "8px", fontSize: "0.9rem" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, textTransform: "uppercase", color: "#1E1E1E", marginBottom: "0.4rem" }}>
                Explore Catalog Target Link
              </label>
              <input
                type="text"
                value={settings.exploreCatalogLink || ""}
                onChange={(e) => setSettings({ ...settings, exploreCatalogLink: e.target.value })}
                placeholder="/products"
                style={{ width: "100%", padding: "10px 14px", border: "1px solid #D5CEBF", borderRadius: "8px", fontSize: "0.9rem" }}
              />
            </div>
          </form>
        </div>

        {/* Section 2: Items Catalog Management */}
        <div style={{ background: "#FFFFFF", border: "1px solid #E2DCD2", borderRadius: "16px", padding: "1.8rem 2rem", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
          {/* Controls Bar: Search & Category Filter */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.8rem", borderBottom: "1px solid #EAE4D8", paddingBottom: "1.2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: "260px" }}>
              <div style={{ position: "relative", width: "100%", maxWidth: "340px" }}>
                <Search size={16} color="#8A8279" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                <input
                  type="text"
                  placeholder="Search specimens, codes, or specs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px 8px 36px", border: "1px solid #D5CEBF", borderRadius: "8px", fontSize: "0.88rem" }}
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "6px",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      border: "none",
                      cursor: "pointer",
                      background: selectedCategory === cat ? "#81663F" : "#F4EFE6",
                      color: selectedCategory === cat ? "#FFFFFF" : "#5E5852",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ color: "#6A6359", fontSize: "0.85rem", fontWeight: 600 }}>
              Showing <strong>{filteredItems.length}</strong> of <strong>{items.length}</strong> specimens
            </div>
          </div>

          {/* Items Grid */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "4rem 2rem", color: "#8A8279" }}>
              ⏳ Loading Shop specimens...
            </div>
          ) : filteredItems.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem 2rem", color: "#8A8279" }}>
              <ShoppingBag size={42} color="#81663F" style={{ margin: "0 auto 1rem", opacity: 0.4 }} />
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#1E1E1E" }}>No specimens found</h3>
              <p style={{ fontSize: "0.9rem", margin: "0.4rem 0 1.2rem" }}>
                {searchQuery ? "Try refining your search or selected category filter." : "Get started by adding your first architectural specimen to the Shop."}
              </p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1.5rem" }}>
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: "#FAF8F5",
                    border: "1px solid #DCD5C6",
                    borderRadius: "12px",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "box-shadow 0.2s ease, transform 0.2s ease",
                  }}
                >
                  <div>
                    {/* Card Image with Code Badge */}
                    <div style={{ position: "relative", width: "100%", height: "200px", background: "#EAE4D8" }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          bottom: "10px",
                          right: "10px",
                          background: "#1E1E1E",
                          color: "#FFFFFF",
                          padding: "4px 10px",
                          borderRadius: "6px",
                          fontSize: "0.82rem",
                          fontWeight: 800,
                        }}
                      >
                        {item.price}
                      </div>

                      <div
                        style={{
                          position: "absolute",
                          top: "10px",
                          left: "10px",
                          background: "rgba(255,255,255,0.92)",
                          color: "#81663F",
                          padding: "3px 8px",
                          borderRadius: "4px",
                          fontSize: "0.75rem",
                          fontWeight: 800,
                          letterSpacing: "0.05em",
                        }}
                      >
                        {item.code}-{item.num}
                      </div>
                    </div>

                    {/* Content Details */}
                    <div style={{ padding: "1.2rem 1.4rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                        <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#81663F", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                          {item.category}
                        </span>
                        <span style={{ fontSize: "0.75rem", color: item.available !== false ? "#059669" : "#DC2626", fontWeight: 700 }}>
                          {item.available !== false ? "● Active in Shop" : "○ Hidden"}
                        </span>
                      </div>

                      <h3 style={{ fontSize: "1.18rem", fontWeight: 800, color: "#1E1E1E", margin: "0 0 0.5rem" }}>
                        {item.name}
                      </h3>

                      <p style={{ fontSize: "0.85rem", color: "#5E5852", lineHeight: 1.5, margin: 0, minHeight: "2.6rem" }}>
                        {item.spec || "No technical specification provided."}
                      </p>

                      <div style={{ marginTop: "0.8rem", display: "flex", alignItems: "center", gap: "6px" }}>
                        {item.shopifyUrl ? (
                          <span style={{ fontSize: "0.74rem", background: "rgba(16, 185, 129, 0.12)", color: "#065f46", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "2px 8px", borderRadius: "4px", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                            🛍️ Shopify Buy Now Active
                          </span>
                        ) : (
                          <span style={{ fontSize: "0.74rem", background: "#EAE4D8", color: "#6A6359", padding: "2px 8px", borderRadius: "4px", fontWeight: 600 }}>
                            📋 Quote Request Only (No Shopify link)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div
                    style={{
                      borderTop: "1px solid #E8E2D6",
                      padding: "0.8rem 1.4rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      background: "#F4EFE6",
                    }}
                  >
                    <div style={{ fontSize: "0.75rem", color: "#8A8279", fontWeight: 600 }}>
                      Order: #{item.sequenceNumber || 1}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <button
                        onClick={() => handleDuplicateItem(item)}
                        title="Duplicate Specimen"
                        style={{
                          background: "#FFFFFF",
                          border: "1px solid #D5CEBF",
                          borderRadius: "6px",
                          padding: "6px 9px",
                          cursor: "pointer",
                          color: "#5E5852",
                          fontSize: "0.78rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <Copy size={13} />
                      </button>

                      <button
                        onClick={() => setEditingItem(item)}
                        title="Edit Specimen"
                        style={{
                          background: "#FFFFFF",
                          border: "1px solid #D5CEBF",
                          borderRadius: "6px",
                          padding: "6px 12px",
                          cursor: "pointer",
                          color: "#1E1E1E",
                          fontSize: "0.82rem",
                          fontWeight: 700,
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <Edit2 size={13} color="#81663F" /> Edit
                      </button>

                      <button
                        onClick={() => handleDeleteItem(item.id, item.name)}
                        title="Delete Specimen"
                        style={{
                          background: "#FEE2E2",
                          border: "1px solid #FCA5A5",
                          borderRadius: "6px",
                          padding: "6px 10px",
                          cursor: "pointer",
                          color: "#DC2626",
                          fontSize: "0.82rem",
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal: Add or Edit Specimen */}
        {editingItem && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 99999,
              background: "rgba(0,0,0,0.65)",
              backdropFilter: "blur(6px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1.5rem",
            }}
            onClick={() => setEditingItem(null)}
          >
            <div
              style={{
                background: "#FAF8F5",
                borderRadius: "16px",
                maxWidth: "640px",
                width: "100%",
                maxHeight: "90vh",
                overflowY: "auto",
                boxShadow: "0 24px 60px rgba(0,0,0,0.3)",
                border: "1px solid #DCD5C6",
                color: "#1E1E1E",
                position: "relative",
                padding: "2rem 2.2rem",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", borderBottom: "1px solid #EAE4D8", paddingBottom: "0.8rem" }}>
                <div>
                  <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#81663F", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                    {editingItem.id ? "EDIT SPECIMEN" : "NEW SPECIMEN"}
                  </span>
                  <h2 style={{ fontSize: "1.5rem", fontWeight: 900, margin: "0.2rem 0 0", color: "#1E1E1E" }}>
                    {editingItem.id ? `Edit: ${editingItem.name}` : "Add New Material Specimen"}
                  </h2>
                </div>

                <button
                  onClick={() => setEditingItem(null)}
                  style={{
                    background: "#EAE4D8",
                    border: "none",
                    borderRadius: "50%",
                    width: "32px",
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSaveItem} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#1E1E1E", marginBottom: "0.3rem" }}>
                    Specimen Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Premium European Oak Veneer"
                    value={editingItem.name || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    style={{ width: "100%", padding: "10px 12px", border: "1px solid #D5CEBF", borderRadius: "8px", fontSize: "0.95rem" }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#1E1E1E", marginBottom: "0.3rem" }}>
                      Category *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Veneers, Tiles, Doors"
                      value={editingItem.category || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                      style={{ width: "100%", padding: "10px 12px", border: "1px solid #D5CEBF", borderRadius: "8px", fontSize: "0.9rem" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#1E1E1E", marginBottom: "0.3rem" }}>
                      Price Estimate *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ₹1,400 / sqm"
                      value={editingItem.price || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value })}
                      style={{ width: "100%", padding: "10px 12px", border: "1px solid #D5CEBF", borderRadius: "8px", fontSize: "0.9rem" }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#1E1E1E", marginBottom: "0.3rem" }}>
                      Short Code
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. OV"
                      value={editingItem.code || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, code: e.target.value.toUpperCase() })}
                      style={{ width: "100%", padding: "10px 12px", border: "1px solid #D5CEBF", borderRadius: "8px", fontSize: "0.9rem" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#1E1E1E", marginBottom: "0.3rem" }}>
                      Specimen Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 01"
                      value={editingItem.num || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, num: e.target.value })}
                      style={{ width: "100%", padding: "10px 12px", border: "1px solid #D5CEBF", borderRadius: "8px", fontSize: "0.9rem" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#1E1E1E", marginBottom: "0.3rem" }}>
                      Display Order #
                    </label>
                    <input
                      type="number"
                      value={editingItem.sequenceNumber ?? 1}
                      onChange={(e) => setEditingItem({ ...editingItem, sequenceNumber: Number(e.target.value) })}
                      style={{ width: "100%", padding: "10px 12px", border: "1px solid #D5CEBF", borderRadius: "8px", fontSize: "0.9rem" }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#1E1E1E", marginBottom: "0.3rem" }}>
                    Image URL *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="https://... or /categories/cat_1.jpg"
                    value={editingItem.image || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                    style={{ width: "100%", padding: "10px 12px", border: "1px solid #D5CEBF", borderRadius: "8px", fontSize: "0.9rem" }}
                  />
                  {editingItem.image && (
                    <div style={{ marginTop: "0.6rem", display: "flex", alignItems: "center", gap: "10px" }}>
                      <img
                        src={editingItem.image}
                        alt="Preview"
                        style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "6px", border: "1px solid #D5CEBF" }}
                        onError={(e) => {
                          (e.target as any).src = "https://via.placeholder.com/60?text=Invalid";
                        }}
                      />
                      <span style={{ fontSize: "0.78rem", color: "#6A6359" }}>Image preview from URL</span>
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#1E1E1E", marginBottom: "0.3rem" }}>
                    Architectural Specification / Technical Details
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Natural European White Oak grain, 0.6mm thickness, FSC certified."
                    value={editingItem.spec || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, spec: e.target.value })}
                    style={{ width: "100%", padding: "10px 12px", border: "1px solid #D5CEBF", borderRadius: "8px", fontSize: "0.9rem" }}
                  />
                </div>

                {/* Shopify Direct Product Connection */}
                <div style={{ background: "#F4EFE6", border: "1px solid #D5CEBF", borderRadius: "10px", padding: "1.2rem", marginTop: "0.2rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.6rem" }}>
                    <ShoppingBag size={18} color="#81663F" />
                    <span style={{ fontSize: "0.88rem", fontWeight: 800, color: "#1E1E1E" }}>
                      Shopify Direct Checkout / Buy Now Connection
                    </span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "0.8rem", alignItems: "flex-end" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#1E1E1E", marginBottom: "0.3rem" }}>
                        Shopify Product URL / Buy Link
                      </label>
                      <input
                        type="url"
                        placeholder="https://yourstore.myshopify.com/products/oak-veneer"
                        value={editingItem.shopifyUrl || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, shopifyUrl: e.target.value })}
                        style={{ width: "100%", padding: "10px 12px", border: "1px solid #D5CEBF", borderRadius: "8px", fontSize: "0.9rem", background: "#FFFFFF" }}
                      />
                    </div>

                    <div style={{ width: "150px" }}>
                      <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#1E1E1E", marginBottom: "0.3rem" }}>
                        Button Label
                      </label>
                      <input
                        type="text"
                        placeholder="Buy on Shopify"
                        value={editingItem.buyNowText || "Buy on Shopify"}
                        onChange={(e) => setEditingItem({ ...editingItem, buyNowText: e.target.value })}
                        style={{ width: "100%", padding: "10px 12px", border: "1px solid #D5CEBF", borderRadius: "8px", fontSize: "0.9rem", background: "#FFFFFF" }}
                      />
                    </div>
                  </div>

                  <p style={{ fontSize: "0.78rem", color: "#6A6359", margin: "0.5rem 0 0" }}>
                    ℹ️ When configured, customers on the live Shop page can click <strong>Buy Now</strong> to jump directly into your Shopify product checkout.
                  </p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "0.4rem 0" }}>
                  <input
                    type="checkbox"
                    id="itemAvailable"
                    checked={editingItem.available !== false}
                    onChange={(e) => setEditingItem({ ...editingItem, available: e.target.checked })}
                    style={{ width: "18px", height: "18px", accentColor: "#81663F", cursor: "pointer" }}
                  />
                  <label htmlFor="itemAvailable" style={{ fontSize: "0.88rem", fontWeight: 600, color: "#1E1E1E", cursor: "pointer" }}>
                    Display this specimen publicly on /shop
                  </label>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "1rem", borderTop: "1px solid #EAE4D8", paddingTop: "1.2rem" }}>
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    style={{
                      padding: "10px 18px",
                      background: "#EAE4D8",
                      color: "#1E1E1E",
                      border: "none",
                      borderRadius: "8px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSavingItem}
                    style={{
                      padding: "10px 24px",
                      background: "#81663F",
                      color: "#FFFFFF",
                      border: "none",
                      borderRadius: "8px",
                      fontWeight: 800,
                      cursor: isSavingItem ? "wait" : "pointer",
                      boxShadow: "0 4px 14px rgba(129, 102, 63, 0.25)",
                    }}
                  >
                    {isSavingItem ? "Saving..." : editingItem.id ? "Save Changes" : "Create Specimen"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Floating Toast Notification */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            background: "#1E1E1E",
            color: "#FFFFFF",
            padding: "12px 20px",
            borderRadius: "8px",
            fontWeight: 800,
            fontSize: "0.9rem",
            boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
            zIndex: 999999,
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}

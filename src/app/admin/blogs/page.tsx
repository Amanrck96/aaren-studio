"use client";

import { useEffect, useState, useRef } from "react";
import AdminNav from "@/components/AdminNav";
import { BlogItem } from "@/lib/types";
import { uploadFileWithCompression } from "@/lib/uploadHelper";

// WORD-STYLE RICH TEXT EDITOR TOOLBAR COMPONENT WITH WORD PICTURE FORMATTING TOOLBAR
function BlogRichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showRawHtml, setShowRawHtml] = useState(false);
  const [fontFamily, setFontFamily] = useState("Calibri, sans-serif");
  const [fontSize, setFontSize] = useState("14px");
  const [textColor, setTextColor] = useState("#80673f");
  const [highlightColor, setHighlightColor] = useState("#fef08a");

  // Picture Formatting State for Selected Image
  const [selectedImg, setSelectedImg] = useState<HTMLImageElement | null>(null);
  const [showInsertImgModal, setShowInsertImgModal] = useState(false);
  const [imgInput, setImgInput] = useState({
    url: "",
    style: "pic-style-rounded",
    width: "100%",
    height: "auto",
    align: "img-center",
    caption: "",
  });
  const [uploadingImg, setUploadingImg] = useState(false);

  // Sync initial content to contentEditable on load or change if out of sync
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  // Click handler to detect selected images inside editor
  const handleEditorClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target && target.tagName === "IMG") {
      setSelectedImg(target as HTMLImageElement);
    } else {
      setSelectedImg(null);
    }
  };

  const syncContent = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCmd = (command: string, arg: string | undefined = undefined) => {
    document.execCommand(command, false, arg);
    syncContent();
  };

  const handleApplyFontFamily = (family: string) => {
    setFontFamily(family);
    execCmd("fontName", family);
  };

  const handleApplyFontSize = (sizePx: string) => {
    setFontSize(sizePx);
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
      const range = selection.getRangeAt(0);
      const span = document.createElement("span");
      span.style.fontSize = sizePx;
      range.surroundContents(span);
      syncContent();
    } else {
      execCmd("fontSize", "4");
    }
  };

  const handleApplyTextColor = (color: string) => {
    setTextColor(color);
    execCmd("foreColor", color);
  };

  const handleApplyHighlightColor = (color: string) => {
    setHighlightColor(color);
    execCmd("hiliteColor", color);
  };

  // Picture Formatting Actions on Selected Image
  const handleSetPictureStyle = (styleClass: string) => {
    if (!selectedImg) return;
    selectedImg.classList.remove("pic-style-frame", "pic-style-rounded", "pic-style-gold", "pic-style-shadow");
    if (styleClass) selectedImg.classList.add(styleClass);
    syncContent();
  };

  const handleSetPictureAlign = (alignClass: string) => {
    if (!selectedImg) return;
    selectedImg.classList.remove("img-float-left", "img-float-right", "img-center");
    selectedImg.classList.add(alignClass);
    syncContent();
  };

  const handleSetPictureWidth = (widthVal: string) => {
    if (!selectedImg) return;
    selectedImg.style.width = widthVal;
    syncContent();
  };

  const handleSetPictureHeight = (heightVal: string) => {
    if (!selectedImg) return;
    selectedImg.style.height = heightVal;
    syncContent();
  };

  const handleDeleteSelectedPicture = () => {
    if (!selectedImg) return;
    selectedImg.remove();
    setSelectedImg(null);
    syncContent();
  };

  // Insert New Image Modal Action
  const handleInsertNewPicture = () => {
    if (!imgInput.url) return alert("Please enter or upload an image URL.");
    
    const safeUrl = imgInput.url.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const safeCaption = imgInput.caption.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const figHtml = `
      <figure class="article-figure" style="text-align: center; margin: 1.5rem 0;">
        <img src="${safeUrl}" class="${imgInput.style} ${imgInput.align}" style="width: ${imgInput.width}; height: ${imgInput.height};" alt="${safeCaption || 'Article Image'}" />
        ${safeCaption ? `<figcaption style="font-size: 0.825rem; color: #80673f; font-style: italic; margin-top: 0.4rem;">${safeCaption}</figcaption>` : ""}
      </figure><p></p>
    `;

    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand("insertHTML", false, figHtml);
      syncContent();
    }
    setShowInsertImgModal(false);
    setImgInput({ url: "", style: "pic-style-rounded", width: "100%", height: "auto", align: "img-center", caption: "" });
  };

  const handleUploadInlineImg = async (file: File) => {
    setUploadingImg(true);
    try {
      const res = await uploadFileWithCompression(file, "BlogBodyImages");
      if (res.success && res.url) {
        setImgInput({ ...imgInput, url: res.url });
        alert("✅ Content image uploaded successfully!");
      } else {
        alert("❌ Image upload failed: " + (res.error || "Unknown error"));
      }
    } catch (e: any) {
      alert("❌ Upload error: " + e.message);
    } finally {
      setUploadingImg(false);
    }
  };

  return (
    <div style={{ border: "1px solid #D5CEBF", borderRadius: "12px", overflow: "hidden", background: "#FAF8F5" }}>
      {/* MAIN WORD-STYLE TEXT TOOLBAR */}
      <div
        style={{
          background: "#F4EFE6",
          borderBottom: "1px solid #D5CEBF",
          padding: "0.6rem 0.8rem",
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
          alignItems: "center",
        }}
      >
        {/* Font Family Selector */}
        <select
          value={fontFamily}
          onChange={(e) => handleApplyFontFamily(e.target.value)}
          style={{ padding: "0.35rem 0.6rem", background: "#FFFFFF", color: "#1E1E1E", border: "1px solid #D5CEBF", borderRadius: "6px", fontSize: "0.8rem" }}
        >
          <option value="Calibri, sans-serif">Calibri (Body)</option>
          <option value="Inter, sans-serif">Inter</option>
          <option value="Georgia, serif">Georgia (Serif)</option>
          <option value="Montserrat, sans-serif">Montserrat</option>
          <option value="Playfair Display, serif">Playfair Display</option>
          <option value="Arial, sans-serif">Arial</option>
        </select>

        {/* Font Size Selector */}
        <select
          value={fontSize}
          onChange={(e) => handleApplyFontSize(e.target.value)}
          style={{ padding: "0.35rem 0.6rem", background: "#FFFFFF", color: "#1E1E1E", border: "1px solid #D5CEBF", borderRadius: "6px", fontSize: "0.8rem" }}
        >
          <option value="12px">12px (Small)</option>
          <option value="14px">14px (Standard)</option>
          <option value="16px">16px (Medium)</option>
          <option value="18px">18px (H3 Subtitle)</option>
          <option value="22px">22px (H2 Heading)</option>
          <option value="28px">28px (H1 Title)</option>
          <option value="36px">36px (Extra Large)</option>
        </select>

        <span style={{ color: "#D5CEBF" }}>|</span>

        {/* Text Formatting Buttons */}
        <button type="button" onClick={() => execCmd("bold")} title="Bold (Ctrl+B)" style={{ padding: "0.35rem 0.6rem", background: "#FFFFFF", color: "#1E1E1E", border: "1px solid #D5CEBF", borderRadius: "6px", fontWeight: 900, cursor: "pointer" }}>B</button>
        <button type="button" onClick={() => execCmd("italic")} title="Italic (Ctrl+I)" style={{ padding: "0.35rem 0.6rem", background: "#FFFFFF", color: "#1E1E1E", border: "1px solid #D5CEBF", borderRadius: "6px", fontStyle: "italic", cursor: "pointer" }}>I</button>
        <button type="button" onClick={() => execCmd("underline")} title="Underline (Ctrl+U)" style={{ padding: "0.35rem 0.6rem", background: "#FFFFFF", color: "#1E1E1E", border: "1px solid #D5CEBF", borderRadius: "6px", textDecoration: "underline", cursor: "pointer" }}>U</button>
        <button type="button" onClick={() => execCmd("strikeThrough")} title="Strikethrough" style={{ padding: "0.35rem 0.6rem", background: "#FFFFFF", color: "#1E1E1E", border: "1px solid #D5CEBF", borderRadius: "6px", textDecoration: "line-through", cursor: "pointer" }}>S</button>

        <span style={{ color: "#D5CEBF" }}>|</span>

        {/* Text Color Picker */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.2rem" }} title="Text Color">
          <span style={{ fontSize: "0.75rem", color: "#1E1E1E", fontWeight: 700 }}>A</span>
          <input type="color" value={textColor} onChange={(e) => handleApplyTextColor(e.target.value)} style={{ width: "24px", height: "24px", padding: 0, border: "none", borderRadius: "4px", background: "none", cursor: "pointer" }} />
        </div>

        {/* Highlight Color Picker */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.2rem" }} title="Highlight Text Color">
          <span style={{ fontSize: "0.75rem", color: "#1E1E1E", fontWeight: 700 }}>🖍️</span>
          <input type="color" value={highlightColor} onChange={(e) => handleApplyHighlightColor(e.target.value)} style={{ width: "24px", height: "24px", padding: 0, border: "none", borderRadius: "4px", background: "none", cursor: "pointer" }} />
        </div>

        <span style={{ color: "#D5CEBF" }}>|</span>

        {/* List Formatting */}
        <button type="button" onClick={() => execCmd("insertUnorderedList")} title="Bullet List" style={{ padding: "0.35rem 0.6rem", background: "#FFFFFF", color: "#1E1E1E", border: "1px solid #D5CEBF", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600 }}>• Bullet List</button>
        <button type="button" onClick={() => execCmd("insertOrderedList")} title="Numbered List" style={{ padding: "0.35rem 0.6rem", background: "#FFFFFF", color: "#1E1E1E", border: "1px solid #D5CEBF", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600 }}>1. Numbered List</button>

        <span style={{ color: "#D5CEBF" }}>|</span>

        {/* Alignments */}
        <button type="button" onClick={() => execCmd("justifyLeft")} title="Align Left" style={{ padding: "0.35rem 0.6rem", background: "#FFFFFF", color: "#1E1E1E", border: "1px solid #D5CEBF", borderRadius: "6px", cursor: "pointer" }}>⫷ Left</button>
        <button type="button" onClick={() => execCmd("justifyCenter")} title="Align Center" style={{ padding: "0.35rem 0.6rem", background: "#FFFFFF", color: "#1E1E1E", border: "1px solid #D5CEBF", borderRadius: "6px", cursor: "pointer" }}>≡ Center</button>
        <button type="button" onClick={() => execCmd("justifyRight")} title="Align Right" style={{ padding: "0.35rem 0.6rem", background: "#FFFFFF", color: "#1E1E1E", border: "1px solid #D5CEBF", borderRadius: "6px", cursor: "pointer" }}>⫸ Right</button>
        <button type="button" onClick={() => execCmd("justifyFull")} title="Justify" style={{ padding: "0.35rem 0.6rem", background: "#FFFFFF", color: "#1E1E1E", border: "1px solid #D5CEBF", borderRadius: "6px", cursor: "pointer" }}>≣ Justify</button>

        <span style={{ color: "#D5CEBF" }}>|</span>

        {/* WORD PICTURE INSERT BUTTON */}
        <button
          type="button"
          onClick={() => setShowInsertImgModal(true)}
          style={{ padding: "0.35rem 0.8rem", background: "#1E1E1E", color: "#FFFFFF", border: "none", borderRadius: "6px", fontWeight: 800, cursor: "pointer", fontSize: "0.8rem" }}
        >
          🖼️ + Insert Picture
        </button>

        {/* Code / Visual View Toggle */}
        <button
          type="button"
          onClick={() => setShowRawHtml(!showRawHtml)}
          style={{ padding: "0.35rem 0.8rem", background: showRawHtml ? "#81663F" : "#F4EFE6", color: showRawHtml ? "#FFFFFF" : "#1E1E1E", border: "1px solid #D5CEBF", borderRadius: "6px", fontWeight: 800, cursor: "pointer", fontSize: "0.8rem" }}
        >
          {showRawHtml ? "📝 Visual Editor" : "💻 Edit HTML Code"}
        </button>
      </div>

      {/* MICROSOFT WORD PICTURE FORMAT TOOLBAR (Appears when any image inside article is clicked!) */}
      {selectedImg && (
        <div
          style={{
            background: "linear-gradient(90deg, #1e293b 0%, #0f172a 100%)",
            borderBottom: "2px solid #38bdf8",
            padding: "0.6rem 1rem",
            display: "flex",
            flexWrap: "wrap",
            gap: "0.8rem",
            alignItems: "center",
            boxShadow: "inset 0 -2px 10px rgba(0,0,0,0.5)",
          }}
        >
          <span style={{ fontSize: "0.8rem", fontWeight: 900, color: "#38bdf8", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "0.3rem" }}>
            📷 Picture Format:
          </span>

          {/* Picture Frame / Border Style */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Style:</span>
            {[
              { label: "Clean", value: "" },
              { label: "Frame", value: "pic-style-frame" },
              { label: "Rounded", value: "pic-style-rounded" },
              { label: "Gold Frame", value: "pic-style-gold" },
              { label: "Shadow Card", value: "pic-style-shadow" },
            ].map((st) => (
              <button
                key={st.value}
                type="button"
                onClick={() => handleSetPictureStyle(st.value)}
                style={{
                  padding: "0.25rem 0.5rem",
                  fontSize: "0.75rem",
                  background: selectedImg.classList.contains(st.value) ? "#0284c7" : "#1e293b",
                  color: "#fff",
                  border: "1px solid #475569",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                {st.label}
              </button>
            ))}
          </div>

          <span style={{ color: "#475569" }}>|</span>

          {/* Picture Wrap & Alignment */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Position:</span>
            <button type="button" onClick={() => handleSetPictureAlign("img-float-left")} style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem", background: "#1e293b", color: "#fff", border: "1px solid #475569", borderRadius: "4px", cursor: "pointer" }}>
              ⫷ Float Left (Text Wraps)
            </button>
            <button type="button" onClick={() => handleSetPictureAlign("img-center")} style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem", background: "#1e293b", color: "#fff", border: "1px solid #475569", borderRadius: "4px", cursor: "pointer" }}>
              ≡ Center
            </button>
            <button type="button" onClick={() => handleSetPictureAlign("img-float-right")} style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem", background: "#1e293b", color: "#fff", border: "1px solid #475569", borderRadius: "4px", cursor: "pointer" }}>
              ⫸ Float Right (Text Wraps)
            </button>
          </div>

          <span style={{ color: "#475569" }}>|</span>

          {/* Picture Width & Height Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Width:</span>
            <select
              value={selectedImg.style.width || "100%"}
              onChange={(e) => handleSetPictureWidth(e.target.value)}
              style={{ padding: "0.2rem 0.4rem", background: "#0f172a", color: "#fff", border: "1px solid #475569", borderRadius: "4px", fontSize: "0.75rem" }}
            >
              <option value="100%">100% (Full Width)</option>
              <option value="75%">75%</option>
              <option value="50%">50% (Half Width)</option>
              <option value="300px">300px</option>
              <option value="400px">400px</option>
            </select>

            <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Height:</span>
            <select
              value={selectedImg.style.height || "auto"}
              onChange={(e) => handleSetPictureHeight(e.target.value)}
              style={{ padding: "0.2rem 0.4rem", background: "#0f172a", color: "#fff", border: "1px solid #475569", borderRadius: "4px", fontSize: "0.75rem" }}
            >
              <option value="auto">Auto</option>
              <option value="200px">200px</option>
              <option value="300px">300px</option>
              <option value="400px">400px</option>
            </select>
          </div>

          <span style={{ color: "#475569" }}>|</span>

          {/* Delete Picture Button */}
          <button
            type="button"
            onClick={handleDeleteSelectedPicture}
            style={{ padding: "0.25rem 0.6rem", background: "rgba(239,68,68,0.2)", color: "#f87171", border: "1px solid rgba(239,68,68,0.4)", borderRadius: "4px", cursor: "pointer", fontSize: "0.75rem", fontWeight: 700 }}
          >
            🗑️ Remove Picture
          </button>
        </div>
      )}

      {/* INSERT NEW PICTURE MODAL */}
      {showInsertImgModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000, padding: "1rem" }}>
          <div style={{ background: "#141418", border: "1px solid #38bdf8", borderRadius: "12px", width: "100%", maxWidth: "520px", padding: "1.8rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: 0, color: "#38bdf8" }}>🖼️ Insert Picture into Article</h3>
              <button onClick={() => setShowInsertImgModal(false)} style={{ background: "none", border: "none", color: "#aaa", fontSize: "1.4rem", cursor: "pointer" }}>✕</button>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontSize: "0.8rem", color: "#aaa", marginBottom: "0.3rem" }}>Image URL</label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input
                  type="text"
                  placeholder="https://..."
                  value={imgInput.url}
                  onChange={(e) => setImgInput({ ...imgInput, url: e.target.value })}
                  style={{ flex: 1, padding: "0.6rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px", fontSize: "0.85rem" }}
                />
                <input
                  type="file"
                  accept="image/*"
                  id="inlineImgFile"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) handleUploadInlineImg(e.target.files[0]);
                  }}
                />
                <label
                  htmlFor="inlineImgFile"
                  style={{ padding: "0.6rem 0.9rem", background: "#2563eb", color: "#fff", borderRadius: "6px", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}
                >
                  {uploadingImg ? "⏳ Uploading..." : "💻 Pick File"}
                </label>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "#aaa", marginBottom: "0.3rem" }}>Picture Style / Frame</label>
                <select
                  value={imgInput.style}
                  onChange={(e) => setImgInput({ ...imgInput, style: e.target.value })}
                  style={{ width: "100%", padding: "0.6rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px", fontSize: "0.85rem" }}
                >
                  <option value="">Clean Standard</option>
                  <option value="pic-style-frame">Simple Frame (Border)</option>
                  <option value="pic-style-rounded">Rounded Corners</option>
                  <option value="pic-style-gold">Gold Luxury Border</option>
                  <option value="pic-style-shadow">Shadow Card</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "#aaa", marginBottom: "0.3rem" }}>Position & Text Wrap</label>
                <select
                  value={imgInput.align}
                  onChange={(e) => setImgInput({ ...imgInput, align: e.target.value })}
                  style={{ width: "100%", padding: "0.6rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px", fontSize: "0.85rem" }}
                >
                  <option value="img-center">Center Inline</option>
                  <option value="img-float-left">Float Left (Text Wraps Right)</option>
                  <option value="img-float-right">Float Right (Text Wraps Left)</option>
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "#aaa", marginBottom: "0.3rem" }}>Initial Width</label>
                <select
                  value={imgInput.width}
                  onChange={(e) => setImgInput({ ...imgInput, width: e.target.value })}
                  style={{ width: "100%", padding: "0.6rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px", fontSize: "0.85rem" }}
                >
                  <option value="100%">100% (Full Width)</option>
                  <option value="75%">75%</option>
                  <option value="50%">50% (Half Width)</option>
                  <option value="300px">300px</option>
                  <option value="400px">400px</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "#aaa", marginBottom: "0.3rem" }}>Image Caption (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. NewTechWood Terrace Deck Mysore Road"
                  value={imgInput.caption}
                  onChange={(e) => setImgInput({ ...imgInput, caption: e.target.value })}
                  style={{ width: "100%", padding: "0.6rem", background: "#0a0a0c", border: "1px solid #333", color: "#fff", borderRadius: "6px", fontSize: "0.85rem" }}
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.8rem", marginTop: "1.2rem" }}>
              <button type="button" onClick={() => setShowInsertImgModal(false)} style={{ padding: "0.6rem 1.2rem", background: "#222", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>Cancel</button>
              <button type="button" onClick={handleInsertNewPicture} style={{ padding: "0.6rem 1.4rem", background: "#059669", color: "#fff", border: "none", borderRadius: "6px", fontWeight: 800, cursor: "pointer" }}>🖼️ Insert Picture</button>
            </div>
          </div>
        </div>
      )}

      {/* EDITING AREA */}
      {showRawHtml ? (
        <textarea
          rows={12}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ width: "100%", padding: "1rem", background: "#0a0a0c", color: "#4ade80", fontFamily: "monospace", fontSize: "0.85rem", border: "none", outline: "none", lineHeight: 1.6 }}
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          onClick={handleEditorClick}
          onInput={() => {
            if (editorRef.current) onChange(editorRef.current.innerHTML);
          }}
          style={{
            background: "#ffffff",
            color: "#111111",
            padding: "1.5rem 2rem",
            minHeight: "350px",
            maxHeight: "600px",
            overflowY: "auto",
            outline: "none",
            fontSize: "14px",
            lineHeight: "1.7",
            fontFamily: fontFamily,
          }}
        />
      )}
    </div>
  );
}

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [editing, setEditing] = useState<Partial<BlogItem> | null>(null);
  const [uploading, setUploading] = useState(false);

  // Global Blog Font Settings Modal State
  const [showTypographyModal, setShowTypographyModal] = useState(false);
  const [fontSettings, setFontSettings] = useState<any>({
    articleTitleSize: "1.75rem",
    articleBodySize: "0.9rem",
    cardTitleSize: "1.05rem",
    cardBodySize: "0.85rem",
    articleImageHeight: "320px",
    cardImageHeight: "200px",
  });

  // Blog Rearrange Modal State
  const [showRearrangeModal, setShowRearrangeModal] = useState(false);
  const [reorderingList, setReorderingList] = useState<BlogItem[]>([]);

  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/blogs");
      const json = await res.json();
      if (json.success) {
        setBlogs(json.data);
        setReorderingList(json.data);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to fetch blogs");
    }
  };

  const fetchFontSettings = () => {
    fetch("/api/blog-settings")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) setFontSettings(json.data);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchBlogs();
    fetchFontSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing?.title || !editing?.content) return alert("Title and Content are required.");

    const generatedSlug = (editing.slug || editing.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")).replace(/-+$/g, '');

    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editing,
          slug: generatedSlug,
          category: editing.category || "Surfaces",
          tags: typeof editing.tags === "string" ? (editing.tags as string).split(",").map((t) => t.trim()) : editing.tags || [],
          status: editing.status || "Published",
          author: editing.author || "Aaren Studio",
          featuredImage: editing.featuredImage || "",
        }),
      });
      const json = await res.json();
      if (json.success) {
        alert("✅ Blog article saved successfully to database!");
        setEditing(null);
        fetchBlogs();
      } else alert("❌ Error saving blog: " + json.error);
    } catch (err) {
      console.error(err);
      alert("❌ Error saving blog.");
    }
  };

  const handleSaveFontSettings = async () => {
    try {
      const res = await fetch("/api/blog-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fontSettings),
      });
      const json = await res.json();
      if (json.success) {
        alert("✅ Font & Image Settings Saved System-Wide & Synced to Firebase!");
        setShowTypographyModal(false);
      } else alert("❌ Failed to save settings.");
    } catch (e: any) {
      alert("❌ Error: " + e.message);
    }
  };

  const handleMoveArticle = async (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= blogs.length) return;

    const newList = [...blogs];
    const [moved] = newList.splice(index, 1);
    newList.splice(targetIdx, 0, moved);

    setBlogs(newList);
    setReorderingList(newList);

    // Save reordered list to backend
    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "reorder", blogs: newList }),
      });
      const json = await res.json();
      if (!json.success) {
        alert("❌ Failed to reorder articles server-side.");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error connecting to server to reorder articles.");
    }
  };

  const handleSaveReorder = async () => {
    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "reorder", blogs: reorderingList }),
      });
      const json = await res.json();
      if (json.success) {
        alert("✅ Article Display Order Rearranged & Saved Live!");
        setShowRearrangeModal(false);
        fetchBlogs();
      } else alert("❌ Failed to reorder articles.");
    } catch (e: any) {
      alert("❌ Error: " + e.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    try {
      await fetch(`/api/blogs?id=${id}`, { method: "DELETE" });
      fetchBlogs();
    } catch (err) {
      console.error(err);
      alert("❌ Error deleting blog.");
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!file || !editing) return;
    setUploading(true);
    try {
      const res = await uploadFileWithCompression(file, "Blogs");
      if (res.success && res.url) {
        setEditing({ ...editing, featuredImage: res.url });
        alert("✅ Cover photo uploaded successfully: " + res.url);
      } else {
        alert("❌ Image upload failed: " + (res.error || "Unknown error"));
      }
    } catch (e: any) {
      alert("❌ Upload error: " + e.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ background: "#FAF8F5", color: "#1E1E1E", minHeight: "100vh" }}>
      <AdminNav />

      <main className="admin-main-content" style={{ flex: 1, padding: "2.5rem 3rem", background: "#FAF8F5" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", borderBottom: "1px solid #DCD5C6", paddingBottom: "1.2rem" }}>
          <div>
            <span style={{ color: "#81663F", fontSize: "0.85rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 800 }}>JOURNAL & EDITORIAL</span>
            <h1 style={{ fontSize: "2.2rem", fontWeight: 900, color: "#1E1E1E", margin: "0.2rem 0" }}>✍️ Blog Articles & Journal CMS</h1>
            <p style={{ color: "#555555", fontSize: "0.95rem" }}>Create, edit, format individual text/images with Word toolbar, rearrange order, and manage blog media.</p>
          </div>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <button
              onClick={() => { setReorderingList([...blogs]); setShowRearrangeModal(true); }}
              style={{ padding: "0.75rem 1.4rem", background: "#F4EFE6", color: "#1E1E1E", border: "1px solid #D5CEBF", borderRadius: "8px", fontWeight: 800, cursor: "pointer", fontSize: "0.9rem" }}
            >
              🔀 Rearrange Blog Order ({blogs.length})
            </button>
            <button
              onClick={() => setShowTypographyModal(true)}
              style={{ padding: "0.75rem 1.4rem", background: "#81663F", color: "#FFFFFF", border: "none", borderRadius: "8px", fontWeight: 800, cursor: "pointer", fontSize: "0.9rem", boxShadow: "0 4px 14px rgba(129,102,63,0.2)" }}
            >
              🎨 Global Font & Image Size Settings
            </button>
            <button
              onClick={() => setEditing({ title: "", slug: "", content: "", category: "Surfaces & Architecture", author: "Aaren Studio", status: "Published" })}
              style={{ padding: "0.75rem 1.6rem", background: "#1E1E1E", color: "#FFFFFF", border: "none", borderRadius: "8px", fontWeight: 800, cursor: "pointer", fontSize: "0.9rem", boxShadow: "0 4px 14px rgba(0,0,0,0.12)" }}
            >
              + Create New Blog Post
            </button>
          </div>
        </div>

        {/* ARTICLE REARRANGE MODAL */}
        {showRearrangeModal && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
            <div style={{ background: "#FFFFFF", border: "1px solid #DCD5C6", borderRadius: "16px", width: "100%", maxWidth: "650px", padding: "2rem", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", borderBottom: "1px solid #EAE4D8", paddingBottom: "1rem" }}>
                <div>
                  <h2 style={{ fontSize: "1.4rem", fontWeight: 800, margin: 0, color: "#81663F" }}>🔀 Rearrange Blog Display Order</h2>
                  <p style={{ color: "#555555", fontSize: "0.85rem", margin: "0.2rem 0 0" }}>Move articles up or down to set their exact sequence on the public blog page.</p>
                </div>
                <button onClick={() => setShowRearrangeModal(false)} style={{ background: "none", border: "none", color: "#6A6359", fontSize: "1.5rem", cursor: "pointer" }}>✕</button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", marginBottom: "1.5rem" }}>
                {reorderingList.map((item, idx) => (
                  <div key={item.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#FAF8F5", padding: "0.9rem 1.2rem", borderRadius: "10px", border: "1px solid #E2DCD2" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <span style={{ fontSize: "0.85rem", fontWeight: 900, color: "#81663F", background: "rgba(129,102,63,0.12)", border: "1px solid rgba(129,102,63,0.25)", padding: "0.2rem 0.6rem", borderRadius: "6px" }}>#{idx + 1}</span>
                      <div>
                        <h4 style={{ fontSize: "0.95rem", fontWeight: 800, margin: 0, color: "#1E1E1E" }}>{item.title}</h4>
                        <span style={{ fontSize: "0.75rem", color: "#6A6359" }}>{item.category}</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "0.4rem" }}>
                      <button
                        disabled={idx === 0}
                        onClick={() => {
                          const copy = [...reorderingList];
                          const [m] = copy.splice(idx, 1);
                          copy.splice(idx - 1, 0, m);
                          setReorderingList(copy);
                        }}
                        style={{ padding: "0.4rem 0.8rem", background: idx === 0 ? "#EAE4D8" : "#1E1E1E", color: idx === 0 ? "#888" : "#FFFFFF", border: "none", borderRadius: "6px", cursor: idx === 0 ? "not-allowed" : "pointer", fontSize: "0.8rem", fontWeight: 700 }}
                      >
                        ⬆️ Up
                      </button>
                      <button
                        disabled={idx === reorderingList.length - 1}
                        onClick={() => {
                          const copy = [...reorderingList];
                          const [m] = copy.splice(idx, 1);
                          copy.splice(idx + 1, 0, m);
                          setReorderingList(copy);
                        }}
                        style={{ padding: "0.4rem 0.8rem", background: idx === reorderingList.length - 1 ? "#EAE4D8" : "#1E1E1E", color: idx === reorderingList.length - 1 ? "#888" : "#FFFFFF", border: "none", borderRadius: "6px", cursor: idx === reorderingList.length - 1 ? "not-allowed" : "pointer", fontSize: "0.8rem", fontWeight: 700 }}
                      >
                        ⬇️ Down
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                <button onClick={() => setShowRearrangeModal(false)} style={{ padding: "0.7rem 1.2rem", background: "#FAF8F5", color: "#1E1E1E", border: "1px solid #D5CEBF", borderRadius: "8px", cursor: "pointer", fontWeight: 700 }}>Cancel</button>
                <button onClick={handleSaveReorder} style={{ padding: "0.7rem 1.5rem", background: "#1E1E1E", color: "#FFFFFF", border: "none", borderRadius: "8px", fontWeight: 800, cursor: "pointer", boxShadow: "0 4px 14px rgba(0,0,0,0.12)" }}>💾 Save Rearranged Order</button>
              </div>
            </div>
          </div>
        )}

        {/* GLOBAL TYPOGRAPHY SETTINGS MODAL */}
        {showTypographyModal && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
            <div style={{ background: "#FFFFFF", border: "1px solid #DCD5C6", borderRadius: "16px", width: "100%", maxWidth: "600px", padding: "2rem", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", borderBottom: "1px solid #EAE4D8", paddingBottom: "1rem" }}>
                <div>
                  <h2 style={{ fontSize: "1.4rem", fontWeight: 800, margin: 0, color: "#81663F" }}>🎨 Global Font & Image Size Manager</h2>
                  <p style={{ color: "#555555", fontSize: "0.85rem", margin: "0.2rem 0 0" }}>Adjust default text sizes and image heights across all blog pages live!</p>
                </div>
                <button onClick={() => setShowTypographyModal(false)} style={{ background: "none", border: "none", color: "#6A6359", fontSize: "1.5rem", cursor: "pointer" }}>✕</button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem", marginBottom: "1.5rem" }}>
                {/* Article Title Font Size */}
                <div style={{ background: "#FAF8F5", padding: "1rem", borderRadius: "10px", border: "1px solid #E2DCD2" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#1E1E1E", fontWeight: 700, marginBottom: "0.5rem" }}>
                    📰 Default Article Title Font Size (Default: 1.75rem / 28px)
                  </label>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
                    {[
                      { label: "Compact (1.4rem / 22px)", value: "1.4rem" },
                      { label: "Small (1.6rem / 25px)", value: "1.6rem" },
                      { label: "Standard (1.75rem / 28px)", value: "1.75rem" },
                      { label: "Medium (2.1rem / 33px)", value: "2.1rem" },
                      { label: "Large (2.5rem / 40px)", value: "2.5rem" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setFontSettings({ ...fontSettings, articleTitleSize: opt.value })}
                        style={{
                          padding: "0.4rem 0.8rem",
                          borderRadius: "6px",
                          border: fontSettings.articleTitleSize === opt.value ? "2px solid #81663F" : "1px solid #D5CEBF",
                          background: fontSettings.articleTitleSize === opt.value ? "#81663F" : "#FFFFFF",
                          color: fontSettings.articleTitleSize === opt.value ? "#FFFFFF" : "#1E1E1E",
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={fontSettings.articleTitleSize}
                    onChange={(e) => setFontSettings({ ...fontSettings, articleTitleSize: e.target.value })}
                    style={{ width: "100%", padding: "0.6rem", background: "#FFFFFF", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "6px", fontSize: "0.85rem" }}
                  />
                </div>

                {/* Article Content Body Text Size */}
                <div style={{ background: "#FAF8F5", padding: "1rem", borderRadius: "10px", border: "1px solid #E2DCD2" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#1E1E1E", fontWeight: 700, marginBottom: "0.5rem" }}>
                    📖 Default Article Body Paragraph Text Size (Default: 0.9rem / 14.4px)
                  </label>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
                    {[
                      { label: "Very Small (0.8rem / 12.8px)", value: "0.8rem" },
                      { label: "Compact (0.875rem / 14px)", value: "0.875rem" },
                      { label: "Small / Standard (0.925rem / 14.8px)", value: "0.925rem" },
                      { label: "Medium (1.05rem / 16.8px)", value: "1.05rem" },
                      { label: "Large (1.2rem / 19px)", value: "1.2rem" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setFontSettings({ ...fontSettings, articleBodySize: opt.value })}
                        style={{
                          padding: "0.4rem 0.8rem",
                          borderRadius: "6px",
                          border: fontSettings.articleBodySize === opt.value ? "2px solid #81663F" : "1px solid #D5CEBF",
                          background: fontSettings.articleBodySize === opt.value ? "#81663F" : "#FFFFFF",
                          color: fontSettings.articleBodySize === opt.value ? "#FFFFFF" : "#1E1E1E",
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={fontSettings.articleBodySize}
                    onChange={(e) => setFontSettings({ ...fontSettings, articleBodySize: e.target.value })}
                    style={{ width: "100%", padding: "0.6rem", background: "#FFFFFF", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "6px", fontSize: "0.85rem" }}
                  />
                </div>

                {/* Article Cover Image Height */}
                <div style={{ background: "#FAF8F5", padding: "1rem", borderRadius: "10px", border: "1px solid #E2DCD2" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#1E1E1E", fontWeight: 700, marginBottom: "0.5rem" }}>
                    🖼️ Default Article Cover Banner Image Height (Default: 320px)
                  </label>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
                    {[
                      { label: "Compact (240px)", value: "240px" },
                      { label: "Standard (320px)", value: "320px" },
                      { label: "Tall (380px)", value: "380px" },
                      { label: "Cinematic (460px)", value: "460px" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setFontSettings({ ...fontSettings, articleImageHeight: opt.value })}
                        style={{
                          padding: "0.4rem 0.8rem",
                          borderRadius: "6px",
                          border: fontSettings.articleImageHeight === opt.value ? "2px solid #81663F" : "1px solid #D5CEBF",
                          background: fontSettings.articleImageHeight === opt.value ? "#81663F" : "#FFFFFF",
                          color: fontSettings.articleImageHeight === opt.value ? "#FFFFFF" : "#1E1E1E",
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. 320px or 250px"
                    value={fontSettings.articleImageHeight || "320px"}
                    onChange={(e) => setFontSettings({ ...fontSettings, articleImageHeight: e.target.value })}
                    style={{ width: "100%", padding: "0.6rem", background: "#FFFFFF", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "6px", fontSize: "0.85rem" }}
                  />
                </div>

                {/* Blog Card Image Height */}
                <div style={{ background: "#FAF8F5", padding: "1rem", borderRadius: "10px", border: "1px solid #E2DCD2" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#1E1E1E", fontWeight: 700, marginBottom: "0.5rem" }}>
                    🃏 Blog Grid Cards Image Height (Default: 200px)
                  </label>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
                    {[
                      { label: "Compact (160px)", value: "160px" },
                      { label: "Standard (200px)", value: "200px" },
                      { label: "Tall (250px)", value: "250px" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setFontSettings({ ...fontSettings, cardImageHeight: opt.value })}
                        style={{
                          padding: "0.4rem 0.8rem",
                          borderRadius: "6px",
                          border: fontSettings.cardImageHeight === opt.value ? "2px solid #81663F" : "1px solid #D5CEBF",
                          background: fontSettings.cardImageHeight === opt.value ? "#81663F" : "#FFFFFF",
                          color: fontSettings.cardImageHeight === opt.value ? "#FFFFFF" : "#1E1E1E",
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. 200px or 180px"
                    value={fontSettings.cardImageHeight || "200px"}
                    onChange={(e) => setFontSettings({ ...fontSettings, cardImageHeight: e.target.value })}
                    style={{ width: "100%", padding: "0.6rem", background: "#FFFFFF", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "6px", fontSize: "0.85rem" }}
                  />
                </div>

                {/* LIVE PREVIEW BOX */}
                <div style={{ background: "#FAF8F5", padding: "1.2rem", borderRadius: "10px", border: "1px solid #E2DCD2", color: "#1E1E1E" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#81663F", textTransform: "uppercase" }}>Live Text & Image Preview</span>
                  <h3 style={{ fontSize: fontSettings.articleTitleSize, fontWeight: 800, color: "#1E1E1E", margin: "0.4rem 0 0.6rem", lineHeight: 1.25 }}>
                    NewTechWood Decking: Creating Beautiful Outdoor Living Spaces
                  </h3>
                  <div style={{ height: fontSettings.articleImageHeight || "180px", background: "#eee", borderRadius: "6px", overflow: "hidden", marginBottom: "0.8rem", position: "relative" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80" alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <p style={{ fontSize: fontSettings.articleBodySize, lineHeight: 1.6, color: "#555555", margin: 0 }}>
                    NewTechWood represents the pinnacle of composite wood technology for luxury outdoor living spaces. Engineered with an advanced Ultrashield co-extrusion technology.
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                <button type="button" onClick={() => setShowTypographyModal(false)} style={{ padding: "0.7rem 1.2rem", background: "#FAF8F5", color: "#1E1E1E", border: "1px solid #D5CEBF", borderRadius: "8px", cursor: "pointer", fontWeight: 700 }}>
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveFontSettings}
                  style={{ padding: "0.7rem 1.5rem", background: "#1E1E1E", color: "#FFFFFF", border: "none", borderRadius: "8px", fontWeight: 800, cursor: "pointer", boxShadow: "0 4px 14px rgba(0,0,0,0.12)" }}
                >
                  💾 Save & Apply System-Wide
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CREATE / EDIT BLOG FORM WITH WORD-STYLE RICH TEXT & WORD PICTURE FORMATTING TOOLBAR */}
        {editing && (
          <form onSubmit={handleSave} style={{ background: "#FFFFFF", padding: "2rem", borderRadius: "16px", border: "1px solid #E2DCD2", marginBottom: "2rem", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#81663F", marginBottom: "1.2rem" }}>
              {editing.id ? "✏️ Edit Blog Article Text, Image Size & Content" : "✨ Create New Blog Article"}
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#1E1E1E", fontWeight: 700, marginBottom: "0.4rem" }}>Article Title *</label>
                <input
                  type="text"
                  required
                  value={editing.title || ""}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  style={{ width: "100%", padding: "0.8rem", background: "#FAF8F5", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "8px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#1E1E1E", fontWeight: 700, marginBottom: "0.4rem" }}>URL Slug (e.g. newtechwood-decking-creating-beautiful-outdoor-living-spaces)</label>
                <input
                  type="text"
                  placeholder="auto-generated-from-title"
                  value={editing.slug || ""}
                  onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                  style={{ width: "100%", padding: "0.8rem", background: "#FAF8F5", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "8px" }}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#1E1E1E", fontWeight: 700, marginBottom: "0.4rem" }}>Category</label>
                <input
                  type="text"
                  value={editing.category || "Surfaces & Architecture"}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                  style={{ width: "100%", padding: "0.8rem", background: "#FAF8F5", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "8px" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#1E1E1E", fontWeight: 700, marginBottom: "0.4rem" }}>Author</label>
                <input
                  type="text"
                  value={editing.author || "Aaren Studio"}
                  onChange={(e) => setEditing({ ...editing, author: e.target.value })}
                  style={{ width: "100%", padding: "0.8rem", background: "#FAF8F5", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "8px" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#1E1E1E", fontWeight: 700, marginBottom: "0.4rem" }}>Publish Date</label>
                <input
                  type="text"
                  placeholder="e.g. August 8, 2026"
                  value={editing.publishDate || ""}
                  onChange={(e) => setEditing({ ...editing, publishDate: e.target.value })}
                  style={{ width: "100%", padding: "0.8rem", background: "#FAF8F5", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "8px" }}
                />
              </div>
            </div>

            {/* PER-ARTICLE CUSTOM TEXT & IMAGE SIZE OVERRIDES */}
            <div style={{ background: "#FAF8F5", border: "1px solid #E2DCD2", borderRadius: "10px", padding: "1.2rem", marginBottom: "1.2rem" }}>
              <h4 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#81663F", margin: "0 0 0.8rem" }}>
                🎨 Custom Font & Image Size Overrides for THIS Article Only (Optional)
              </h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "#1E1E1E", fontWeight: 700, marginBottom: "0.3rem" }}>Title Font Size Override</label>
                  <input
                    type="text"
                    placeholder="e.g. 1.6rem or default"
                    value={editing.titleSize || ""}
                    onChange={(e) => setEditing({ ...editing, titleSize: e.target.value })}
                    style={{ width: "100%", padding: "0.6rem", background: "#FFFFFF", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "6px", fontSize: "0.85rem" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "#1E1E1E", fontWeight: 700, marginBottom: "0.3rem" }}>Body Text Size Override</label>
                  <input
                    type="text"
                    placeholder="e.g. 0.85rem or default"
                    value={editing.bodySize || ""}
                    onChange={(e) => setEditing({ ...editing, bodySize: e.target.value })}
                    style={{ width: "100%", padding: "0.6rem", background: "#FFFFFF", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "6px", fontSize: "0.85rem" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "#1E1E1E", fontWeight: 700, marginBottom: "0.3rem" }}>Cover Image Height Override</label>
                  <input
                    type="text"
                    placeholder="e.g. 260px or default"
                    value={editing.imageHeight || ""}
                    onChange={(e) => setEditing({ ...editing, imageHeight: e.target.value })}
                    style={{ width: "100%", padding: "0.6rem", background: "#FFFFFF", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "6px", fontSize: "0.85rem" }}
                  />
                </div>
              </div>
            </div>

            <div style={{ marginBottom: "1.2rem" }}>
              <label style={{ display: "block", fontSize: "0.85rem", color: "#1E1E1E", fontWeight: 700, marginBottom: "0.4rem" }}>Featured Cover Image URL</label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input
                  type="text"
                  value={editing.featuredImage || ""}
                  onChange={(e) => setEditing({ ...editing, featuredImage: e.target.value })}
                  style={{ flex: 1, padding: "0.8rem", background: "#FAF8F5", border: "1px solid #D5CEBF", color: "#1E1E1E", borderRadius: "8px" }}
                />
                <input
                  type="file"
                  accept="image/*"
                  id="blogCoverUpload"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) handleImageUpload(e.target.files[0]);
                  }}
                />
                <label
                  htmlFor="blogCoverUpload"
                  style={{
                    padding: "0.75rem 1.4rem",
                    background: "#1E1E1E",
                    color: "#fff",
                    borderRadius: "8px",
                    fontSize: "0.85rem",
                    fontWeight: 800,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
                  }}
                >
                  {uploading ? "⏳ Uploading..." : "💻 Upload Cover Image"}
                </label>
              </div>
            </div>

            {/* WORD-STYLE RICH TEXT EDITOR & PICTURE FORMATTING TOOLBAR */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", fontSize: "0.9rem", color: "#81663F", fontWeight: 800, marginBottom: "0.4rem" }}>
                📝 Article Text & Word Picture Formatting Toolbar *
              </label>
              <BlogRichTextEditor
                value={editing.content || ""}
                onChange={(newHtml) => setEditing({ ...editing, content: newHtml })}
              />
            </div>

            <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
              <button type="submit" style={{ padding: "0.75rem 1.8rem", background: "#1E1E1E", color: "#FFFFFF", border: "none", borderRadius: "8px", fontWeight: 800, cursor: "pointer", boxShadow: "0 4px 14px rgba(0,0,0,0.12)" }}>
                💾 Save & Publish Article
              </button>
              <button type="button" onClick={() => setEditing(null)} style={{ padding: "0.75rem 1.5rem", background: "#FAF8F5", color: "#1E1E1E", border: "1px solid #D5CEBF", borderRadius: "8px", cursor: "pointer", fontWeight: 700 }}>
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* BLOG CARDS GRID WITH QUICK REARRANGE BUTTONS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
          {blogs.map((b, index) => (
            <div key={b.id} style={{ background: "#FFFFFF", border: "1px solid #E2DCD2", borderRadius: "16px", padding: "1.8rem", boxShadow: "0 4px 20px rgba(0,0,0,0.04)", position: "relative" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem" }}>
                <span style={{ fontSize: "0.78rem", background: "rgba(129, 102, 63, 0.12)", color: "#81663F", border: "1px solid rgba(129, 102, 63, 0.25)", padding: "0.25rem 0.7rem", borderRadius: "6px", fontWeight: 800 }}>{b.category || "General"}</span>
                <span style={{ fontSize: "0.75rem", color: "#81663F", fontWeight: 800 }}>Sequence #{index + 1}</span>
              </div>
              {b.featuredImage && (
                <div style={{ width: "100%", height: "140px", marginBottom: "0.8rem", borderRadius: "8px", overflow: "hidden" }}>
                  <img src={b.featuredImage} alt={b.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              )}
              <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#1E1E1E", margin: "0.4rem 0 0.5rem" }}>{b.title}</h3>
              <div style={{ color: "#555555", fontSize: "0.88rem", margin: "0.5rem 0 1.4rem", lineHeight: 1.6, maxHeight: "70px", overflow: "hidden" }}>
                {b.content ? b.content.replace(/<[^>]*>/g, "") : ""}
              </div>
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #EAE4D8", paddingTop: "1rem" }}>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button onClick={() => setEditing(b)} style={{ padding: "0.45rem 1rem", background: "#1E1E1E", color: "#FFFFFF", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "0.82rem", fontWeight: 700 }}>
                    ✏️ Edit & Format
                  </button>
                  <button onClick={() => handleDelete(b.id)} style={{ padding: "0.45rem 1rem", background: "#FEE2E2", color: "#DC2626", border: "1px solid #FCA5A5", borderRadius: "6px", cursor: "pointer", fontSize: "0.82rem", fontWeight: 700 }}>
                    🗑️ Delete
                  </button>
                </div>
                <div style={{ display: "flex", gap: "0.3rem" }}>
                  <button
                    disabled={index === 0}
                    onClick={() => handleMoveArticle(index, "up")}
                    style={{ padding: "0.35rem 0.6rem", background: index === 0 ? "#FAF8F5" : "#F4EFE6", color: index === 0 ? "#aaa" : "#1E1E1E", border: "1px solid #D5CEBF", borderRadius: "4px", cursor: index === 0 ? "not-allowed" : "pointer", fontSize: "0.78rem", fontWeight: 700 }}
                  >
                    ⬆️ Up
                  </button>
                  <button
                    disabled={index === blogs.length - 1}
                    onClick={() => handleMoveArticle(index, "down")}
                    style={{ padding: "0.35rem 0.6rem", background: index === blogs.length - 1 ? "#FAF8F5" : "#F4EFE6", color: index === blogs.length - 1 ? "#aaa" : "#1E1E1E", border: "1px solid #D5CEBF", borderRadius: "4px", cursor: index === blogs.length - 1 ? "not-allowed" : "pointer", fontSize: "0.78rem", fontWeight: 700 }}
                  >
                    ⬇️ Down
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

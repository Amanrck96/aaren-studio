import os
import json
import fitz

pdf_dir = r"C:\Users\amanr\Downloads\New folder (2)"
summary = []

for filename in sorted(os.listdir(pdf_dir)):
    if not filename.lower().endswith(".pdf"):
        continue
    filepath = os.path.join(pdf_dir, filename)
    doc = fitz.open(filepath)
    title = doc.metadata.get("title") or ""
    first_page_text = doc[0].get_text("text").strip().replace("\n", " ") if len(doc) > 0 else ""
    summary.append({
        "filename": filename,
        "size_mb": round(os.path.getsize(filepath) / (1024 * 1024), 2),
        "pages": len(doc),
        "title_meta": title,
        "first_page": first_page_text[:200]
    })
    doc.close()

for item in summary:
    print(f"File: {item['filename']}")
    print(f"  Pages: {item['pages']} | Size: {item['size_mb']}MB")
    print(f"  First Page Snippet: {item['first_page']}")
    print("-" * 50)

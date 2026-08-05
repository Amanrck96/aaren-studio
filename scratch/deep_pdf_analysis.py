import os
import sys
import json
import fitz

sys.stdout.reconfigure(encoding='utf-8')

pdf_dir = r"C:\Users\amanr\Downloads\New folder (2)"

unique_files = [
    "AQUARELLE.pdf",
    "BITS.pdf",
    "CATALOGO_MATERIAPRIMA_2026_2a_compressed.pdf",
    "Catalogo-Nouvelle-baja.pdf",
    "Catalogo-Sabil-baja.pdf",
    "Catalogo-Terre.pdf",
    "Catalogo-Vestige-baja.pdf",
    "arpa-vis-brochure_250122.pdf",
    "catalogo60Grados.pdf",
    "catalogoBejmat.pdf",
    "catalogue-clay-pdf.pdf"
]

catalog_data = []

for filename in unique_files:
    filepath = os.path.join(pdf_dir, filename)
    doc = fitz.open(filepath)
    full_text = ""
    for page in doc:
        t = page.get_text("text").strip()
        if t:
            full_text += " " + t.replace("\n", " ")
    
    catalog_data.append({
        "fileName": filename,
        "sizeBytes": os.path.getsize(filepath),
        "sizeMB": round(os.path.getsize(filepath) / (1024 * 1024), 2),
        "pageCount": len(doc),
        "textSnippet": full_text[:1200]
    })
    doc.close()

print(json.dumps(catalog_data, indent=2, ensure_ascii=False))

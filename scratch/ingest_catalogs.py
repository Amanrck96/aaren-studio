import os
import sys
import json
import shutil
import fitz  # PyMuPDF

sys.stdout.reconfigure(encoding='utf-8')

SOURCE_DIR = r"C:\Users\amanr\Downloads\New folder (2)"
PUBLIC_DIR = r"C:\Users\amanr\.gemini\antigravity\worktrees\aaren studio\automate_pdf_catalog_ingestion\public"
CATALOGS_DIR = os.path.join(PUBLIC_DIR, "catalogs")
THUMBNAILS_DIR = os.path.join(CATALOGS_DIR, "thumbnails")
DATA_DIR = r"C:\Users\amanr\.gemini\antigravity\worktrees\aaren studio\automate_pdf_catalog_ingestion\data"
MASTER_STORE_PATH = os.path.join(DATA_DIR, "master_store.json")

os.makedirs(CATALOGS_DIR, exist_ok=True)
os.makedirs(THUMBNAILS_DIR, exist_ok=True)
os.makedirs(DATA_DIR, exist_ok=True)

# Define exact catalog mapping (Brand & Category) for each unique PDF file
CATALOG_MAPPINGS = {
    "AQUARELLE.pdf": {
        "title": "AQUARELLE Collection",
        "brand": "WOW Design",
        "category": "Tiles & Ceramics",
        "subcategory": "Glazed Wall Tiles",
        "description": "Translucent water-color effect ceramic tiles in fluid translucent layers (7.5x30 cm).",
        "tags": ["Ceramic", "Glazed Tile", "Watercolor", "WOW Design"]
    },
    "BITS.pdf": {
        "title": "BITS Architectural Fragment Collection",
        "brand": "WOW Design",
        "category": "Tiles & Ceramics",
        "subcategory": "Geometric Tiles",
        "description": "Minimalist geometric ceramic construction units with vibrant colors in matte and gloss finishes.",
        "tags": ["Geometric", "Minimalist", "Matte & Gloss", "WOW Design"]
    },
    "CATALOGO_MATERIAPRIMA_2026_2a_compressed.pdf": {
        "title": "MATERIA PRIMA 2026 Collection",
        "brand": "Inkiostro Bianco",
        "category": "Wallcoverings & Murals",
        "subcategory": "Decorative Wallpaper",
        "description": "Master collection featuring Geometric Line-Art, Neo Heritage Botanica, and Wabi Sabi tactile surfaces.",
        "tags": ["Wallpaper", "Murals", "Wabi Sabi", "Inkiostro Bianco"]
    },
    "Catalogo-Nouvelle-baja.pdf": {
        "title": "NOUVELLE Art Deco Collection",
        "brand": "WOW Design",
        "category": "Tiles & Ceramics",
        "subcategory": "Art Deco Tiles",
        "description": "Art Deco inspired elongated ornamental ceramic tiles with precious stone color palettes.",
        "tags": ["Art Deco", "Precious Stone", "Ornamental", "WOW Design"]
    },
    "Catalogo-Sabil-baja.pdf": {
        "title": "SABIL Artisanal Collection",
        "brand": "WOW Design",
        "category": "Terracotta & Zellige",
        "subcategory": "Handcrafted Tiles",
        "description": "Artisanal hand-crafted textured ceramic tiles with natural earthy tones and tactile surfaces.",
        "tags": ["Terracotta", "Handcrafted", "Tactile", "WOW Design"]
    },
    "Catalogo-Terre.pdf": {
        "title": "TERRE Geological Clay Collection",
        "brand": "WOW Design",
        "category": "Terracotta & Zellige",
        "subcategory": "Clay & Mineral Tiles",
        "description": "Geological clay and mineral strata ceramics with reactive glaze granules and crystalline depth.",
        "tags": ["Clay", "Mineral Strata", "Reactive Glaze", "WOW Design"]
    },
    "Catalogo-Vestige-baja.pdf": {
        "title": "VESTIGE Antiqued Marble Collection",
        "brand": "WOW Design",
        "category": "Marble & Stone Porcelain",
        "subcategory": "Antiqued Marble",
        "description": "Reinterpreted vision of marble with time-worn textures, rounded irregular contours, and matte patina.",
        "tags": ["Marble", "Antiqued", "Porcelain", "WOW Design"]
    },
    "arpa-vis-brochure_250122.pdf": {
        "title": "ARPA VIS Technology High-Wear Surfaces",
        "brand": "Arpa / FENIX",
        "category": "High-Pressure Laminates & Surfaces",
        "subcategory": "Engineered HPL Surfaces",
        "description": "High-wear mineral engineered HPL surface for interior design with 20x wear resistance.",
        "tags": ["HPL", "Nano-Tech", "Engineered Surface", "Arpa"]
    },
    "catalogo60Grados.pdf": {
        "title": "60º Chevron & Wood-Stone Hybrid",
        "brand": "WOW Design",
        "category": "Wood & Chevron Flooring",
        "subcategory": "Chevron & Trapezoid Tiles",
        "description": "Fluid dialogue between natural wood and Calacatta stone with 60-degree chevron and trapezoid tile shapes.",
        "tags": ["Chevron", "Wood Effect", "Calacatta", "WOW Design"]
    },
    "catalogoBejmat.pdf": {
        "title": "BEJMAT Moorish Zellige Collection",
        "brand": "WOW Design",
        "category": "Terracotta & Zellige",
        "subcategory": "Moorish Zellige",
        "description": "Traditional 10th-century Moorish Zellige rectangular paving stones in shaded colors for indoor & outdoor spaces.",
        "tags": ["Zellige", "Moorish", "Terracotta", "WOW Design"]
    },
    "catalogue-clay-pdf.pdf": {
        "title": "CLAY Resin Effect Porcelain Slabs",
        "brand": "Mirage Ceramic",
        "category": "Resin & Large Slabs",
        "subcategory": "Resin Slabs",
        "description": "Resin spread effect porcelain tiles with subtle gloss contrast on matte finish in large architectural formats (1200x2780mm).",
        "tags": ["Resin Slabs", "Porcelain", "Large Format", "Mirage"]
    }
}

# Unique files list (mapping duplicate downloads to primary file)
FILE_ALIASES = {
    "Catalogo-Vestige-baja (1).pdf": "Catalogo-Vestige-baja.pdf",
    "Catalogo-Vestige-baja (2).pdf": "Catalogo-Vestige-baja.pdf",
    "arpa-vis-brochure_250122 (1).pdf": "arpa-vis-brochure_250122.pdf",
    "catalogo60Grados (1).pdf": "catalogo60Grados.pdf"
}

ingested_catalogs = []

for filename in sorted(os.listdir(SOURCE_DIR)):
    if not filename.lower().endswith(".pdf"):
        continue

    src_filepath = os.path.join(SOURCE_DIR, filename)
    primary_filename = FILE_ALIASES.get(filename, filename)
    mapping = CATALOG_MAPPINGS.get(primary_filename)
    if not mapping:
        continue

    # Create safe base name for files
    slug = primary_filename.lower().replace(" (1)", "").replace(" (2)", "").replace("_compressed", "").replace("-baja", "").replace(".pdf", "")
    pdf_dest_filename = f"{slug}.pdf"
    pdf_dest_path = os.path.join(CATALOGS_DIR, pdf_dest_filename)
    pdf_public_url = f"/catalogs/{pdf_dest_filename}"

    thumb_dest_filename = f"{slug}_thumb.jpg"
    thumb_dest_path = os.path.join(THUMBNAILS_DIR, thumb_dest_filename)
    thumb_public_url = f"/catalogs/thumbnails/{thumb_dest_filename}"

    # Copy PDF if not already copied
    if not os.path.exists(pdf_dest_path):
        shutil.copy2(src_filepath, pdf_dest_path)

    # Render First Page Thumbnail using PyMuPDF (fitz)
    doc = fitz.open(src_filepath)
    page_count = len(doc)
    
    if len(doc) > 0:
        page = doc[0]
        # Render at 150 DPI for sharp crisp luxury thumbnail
        zoom = 150 / 72
        mat = fitz.Matrix(zoom, zoom)
        pix = page.get_pixmap(matrix=mat, alpha=False)
        pix.save(thumb_dest_path)
    
    doc.close()

    size_bytes = os.path.getsize(src_filepath)
    size_mb = round(size_bytes / (1024 * 1024), 2)

    catalog_item = {
        "id": f"cat-pdf-{slug}",
        "title": mapping["title"],
        "fileName": filename,
        "primaryFileName": primary_filename,
        "fileUrl": pdf_public_url,
        "thumbnailUrl": thumb_public_url,
        "brand": mapping["brand"],
        "category": mapping["category"],
        "subcategory": mapping["subcategory"],
        "description": mapping["description"],
        "tags": mapping["tags"],
        "fileSize": f"{size_mb} MB",
        "sizeBytes": size_bytes,
        "pageCount": page_count,
        "isLocked": True,
        "downloadCount": 0,
        "createdAt": "2026-08-05T16:00:00.000Z"
    }

    # Avoid duplicate catalog entries in JSON list if alias
    if not any(c["id"] == catalog_item["id"] for c in ingested_catalogs):
        ingested_catalogs.append(catalog_item)
        print(f"✅ Ingested: {mapping['title']} | Brand: {mapping['brand']} | Category: {mapping['category']} | Thumbnail: {thumb_public_url}")

# Save catalogs to data/catalogs.json
catalogs_json_path = os.path.join(DATA_DIR, "catalogs.json")
with open(catalogs_json_path, "w", encoding="utf-8") as f:
    json.dump(ingested_catalogs, f, indent=2, ensure_ascii=False)

# Sync into master_store.json
if os.path.exists(MASTER_STORE_PATH):
    try:
        with open(MASTER_STORE_PATH, "r", encoding="utf-8") as f:
            master = json.load(f)
    except Exception:
        master = {}
else:
    master = {}

master["pdfCatalogs"] = ingested_catalogs
with open(MASTER_STORE_PATH, "w", encoding="utf-8") as f:
    json.dump(master, f, indent=2, ensure_ascii=False)

print(f"\n🎉 Successfully ingested {len(ingested_catalogs)} unique PDF catalogs with cover thumbnails, brand tags, and categories!")

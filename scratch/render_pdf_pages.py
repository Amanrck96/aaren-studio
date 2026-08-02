import fitz
import os

os.makedirs('public/pdf_pages', exist_ok=True)
doc = fitz.open('C:/Users/amanr/Downloads/Aaren Brand PDF.pdf')

for i, page in enumerate(doc):
    pix = page.get_pixmap(dpi=150)
    out_path = f"public/pdf_pages/page_{i+1}.png"
    pix.save(out_path)
    print(f"Rendered Page {i+1} -> {out_path} (size: {pix.width}x{pix.height})")

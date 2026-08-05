import os
import json
import fitz # PyMuPDF

pdf_dir = r"C:\Users\amanr\Downloads\New folder (2)"
results = []

for filename in sorted(os.listdir(pdf_dir)):
    if not filename.lower().endswith(".pdf"):
        continue
    filepath = os.path.join(pdf_dir, filename)
    try:
        doc = fitz.open(filepath)
        page_count = len(doc)
        text_samples = []
        for i in range(min(5, page_count)):
            text = doc[i].get_text("text").strip()
            if text:
                text_samples.append(text[:300])
        
        full_sample = "\n---\n".join(text_samples)
        
        results.append({
            "filename": filename,
            "size_mb": round(os.path.getsize(filepath) / (1024 * 1024), 2),
            "pages": page_count,
            "sample_text": full_sample[:1000]
        })
        doc.close()
    except Exception as e:
        results.append({
            "filename": filename,
            "error": str(e)
        })

print(json.dumps(results, indent=2))

import fitz

doc = fitz.open('C:/Users/amanr/Downloads/Aaren Brand PDF.pdf')
print("Total pages:", len(doc))

for i, page in enumerate(doc):
    text = page.get_text().strip().replace('\n', ' ')
    images = page.get_images()
    print(f"=== Page {i+1} (Images: {len(images)}) ===")
    print("Text snippet:", text[:200])
    print("-" * 50)

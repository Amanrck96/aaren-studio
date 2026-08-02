import re

brands_path = 'src/lib/brands.ts'
with open(brands_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace any non-existent PDF paths with exact files on disk
content = content.replace(
    'file: "Mirage/catalogue-elysian-pdf.pdf"',
    'file: "Mirage/catalogue-elysian-travertini-pdf.pdf"'
)

with open(brands_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated src/lib/brands.ts with exact existing PDF paths!")

brands_path = 'src/lib/brands.ts'

with open(brands_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'file: "Inkiastro Bianco/CATALOGO_MATERIAPRIMA_2026_2a.pdf"',
    'file: "Formica/Formica-Global-Catalogue-V2.pdf"'
)
content = content.replace(
    'file: "Mirage/catalogue-elysian-pdf.pdf"',
    'file: "Mirage/catalogue-elysian-travertini-pdf.pdf"'
)

with open(brands_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated src/lib/brands.ts with tracked PDF files!")

import json
import re

with open('scratch/excel_catalogs_parsed.json', 'r') as f:
    excel_cats = json.load(f)

# Normalize keys
normalized_cats = {}
for bname, cats in excel_cats.items():
    norm_key = bname.lower().replace(' ', '-')
    normalized_cats[norm_key] = cats
    if norm_key == 'newtechwood':
        normalized_cats['newtech-wood'] = cats

# Let's inspect brands/page.tsx
page_path = 'src/app/brands/page.tsx'
with open(page_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace CatalogThumb type definition
type_def = """export type CatalogThumb = {
  title: string;
  pdfUrl?: string;
  pdfDownloadUrl?: string;
  coverImage?: string;
  fileId?: string;
  themeStyle?: React.CSSProperties;
  themeClass?: string;
};"""

content = re.sub(r'export type CatalogThumb = \{[^}]+\};', type_def, content)

# Write updated brands/page.tsx
with open(page_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated CatalogThumb definition in src/app/brands/page.tsx!")

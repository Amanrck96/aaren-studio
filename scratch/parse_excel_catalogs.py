import pandas as pd
import json
import re

excel_path = 'C:/Users/amanr/Downloads/Brand Catalog.xlsx'
df = pd.read_excel(excel_path)

brands_catalogs = {}

for idx, row in df.iterrows():
    brand_name = str(row['Brand Name']).strip()
    if not brand_name or brand_name == 'nan':
        continue
    
    catalogs_list = []
    cat_idx = 1
    
    for col, val in row.items():
        if col == 'Brand Name' or pd.isna(val):
            continue
        
        val_str = str(val).strip()
        match = re.search(r'/file/d/([^/]+)', val_str)
        if match:
            file_id = match.group(1)
            pdf_view_url = f"https://drive.google.com/file/d/{file_id}/view?usp=drive_link"
            pdf_download_url = f"https://drive.google.com/uc?export=download&id={file_id}"
            thumb_url = f"https://lh3.googleusercontent.com/d/{file_id}=s800"
            
            catalogs_list.append({
                "id": f"{brand_name.lower().replace(' ', '-')}-cat-{cat_idx}",
                "title": f"CATALOG 0{cat_idx}",
                "pdfUrl": pdf_view_url,
                "pdfDownloadUrl": pdf_download_url,
                "coverImage": thumb_url,
                "fileId": file_id
            })
            cat_idx += 1
            
    brands_catalogs[brand_name] = catalogs_list

print("Parsed Brands & Catalog Counts:")
for bname, cats in brands_catalogs.items():
    print(f"  {bname}: {len(cats)} PDF catalogs")

with open('scratch/excel_catalogs_parsed.json', 'w') as f:
    json.dump(brands_catalogs, f, indent=2)

print("\nSaved parsed brand catalogs to scratch/excel_catalogs_parsed.json!")

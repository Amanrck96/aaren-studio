import json

with open("data/master_store.json", "r", encoding="utf-8") as f:
    data = json.load(f)

brands = data.get("brands", [])
print(f"Total Brands in master_store.json: {len(brands)}")
for idx, b in enumerate(brands):
    print(f"{idx+1}. ID: {b.get('id')} | Name: {b.get('name')} | Code: {b.get('shortCode')} | PDF: {b.get('catalogPdfUrl')}")

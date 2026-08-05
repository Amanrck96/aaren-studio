import json

with open("data/master_store.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Filter out duplicate brand IDs
duplicate_ids = {"brand-1785617427424-4", "brand-1785617427424-8", "brand-1785617427424-9"}

if "brands" in data:
    original_count = len(data["brands"])
    data["brands"] = [b for b in data["brands"] if b.get("id") not in duplicate_ids]
    print(f"Cleaned brands: {original_count} -> {len(data['brands'])}")

with open("data/master_store.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("✅ Successfully removed duplicate brand entries from master_store.json!")

import json, os

primary_path = "data/master_store.json"
tmp_path = "/tmp/master_store.json"

for p in [primary_path, tmp_path]:
    if os.path.exists(p):
        print(f"File exists: {p}")
        with open(p, "r", encoding="utf-8") as f:
            data = json.load(f)
            brands = data.get("brands", [])
            print(f"Total brands in {p}: {len(brands)}")
            for b in brands:
                print("  -", b.get("id"), "|", b.get("name"), "|", b.get("shortCode"))

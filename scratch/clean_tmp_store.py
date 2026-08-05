import json, os, sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

duplicate_ids = {"brand-1785617427424-4", "brand-1785617427424-8", "brand-1785617427424-9"}

paths = [
    os.path.abspath("data/master_store.json"),
    "/tmp/master_store.json"
]

for p in paths:
    if os.path.exists(p):
        with open(p, "r", encoding="utf-8") as f:
            data = json.load(f)
        
        if "brands" in data:
            orig = len(data["brands"])
            data["brands"] = [b for b in data["brands"] if b.get("id") not in duplicate_ids]
            print(f"Cleaned {p}: {orig} -> {len(data['brands'])}")
        
        with open(p, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

print("Successfully cleaned all store files!")

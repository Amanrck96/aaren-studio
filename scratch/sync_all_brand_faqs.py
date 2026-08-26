import os
import re
import json
import urllib.request
import pandas as pd

f1 = r"C:\Users\amanr\Downloads\New folder (2)\faq brandwise (1).xlsx"
f2 = r"C:\Users\amanr\Downloads\New folder (2)\Aaren FAQ (1).xlsx"

FIREBASE_RTDB_URL = "https://aarenintpro-1c09f-default-rtdb.firebaseio.com"

BRAND_MAP = {
    "fima": { "id": "fima", "name": "Fima Carlo Frattini", "category": "Bathroom Fittings" },
    "falper": { "id": "falper", "name": "Falper", "category": "Bathroom & Kitchen" },
    "newtechwood": { "id": "newtech-wood", "name": "Newtech Wood", "category": "WPC & Facade" },
    "thermory": { "id": "thermory", "name": "Thermory", "category": "Thermal Wood" },
    "mafi": { "id": "mafi", "name": "Mafi", "category": "Natural Wood Floors" },
    "freedom screens": { "id": "freedom-screens", "name": "Freedom Screens", "category": "Retractable Screens" },
    "slashform": { "id": "slashform", "name": "Slashform", "category": "Doors, Windows & Kitchens" },
    "jb glass": { "id": "waltz", "name": "Waltz by JB Glass", "category": "Glass & Mirrors" },
    "waltz": { "id": "waltz", "name": "Waltz by JB Glass", "category": "Glass & Mirrors" },
    "madheke": { "id": "madheke", "name": "Madheke", "category": "Luxury Bespoke" },
    "loco design": { "id": "loco", "name": "Loco", "category": "Furniture & Millwork" },
    "loco": { "id": "loco", "name": "Loco", "category": "Furniture & Millwork" },
    "tempesta": { "id": "tempesta", "name": "Tempesta", "category": "Luxury Surfaces" },
    "wow design": { "id": "wow", "name": "WOW", "category": "3D Ceramic Tiles" },
    "wow": { "id": "wow", "name": "WOW", "category": "3D Ceramic Tiles" },
    "iw": { "id": "iww", "name": "IWW", "category": "Stone & Joinery" },
    "iww": { "id": "iww", "name": "IWW", "category": "Stone & Joinery" },
    "ceramica flaminia": { "id": "falper", "name": "Ceramica Flaminia", "category": "Sanitary Ware" },
    "flaminia": { "id": "falper", "name": "Ceramica Flaminia", "category": "Sanitary Ware" },
    "bullfrog spas": { "id": "bullfrog-spas", "name": "Bullfrog Spas", "category": "Wellness & Spas" },
    "bullfrog": { "id": "bullfrog-spas", "name": "Bullfrog Spas", "category": "Wellness & Spas" },
}

def clean_text(s: str) -> str:
    if not s:
        return ""
    # Fix common encoding artifacts
    s = s.replace("dcor", "décor").replace("dcor", "décor")
    s = s.replace("\u2018", "'").replace("\u2019", "'")
    s = s.replace("\u201c", '"').replace("\u201d", '"')
    s = s.replace("\u2013", "-").replace("\u2014", "-")
    s = re.sub(r'[ \t]+', ' ', s).strip()
    return s

def parse_brandwise_file(filepath):
    df = pd.read_excel(filepath, header=None)
    items = []
    
    current_brand_key = "fima"
    current_q = None
    current_a_lines = []
    
    for idx, r in df.iterrows():
        val = r.values[0]
        if pd.isna(val):
            continue
        text = clean_text(str(val))
        if not text:
            continue
        
        # Check if question
        q_match = re.match(r'^(\d+)[\.\)]\s*(.+)$', text)
        if q_match:
            if current_q and current_a_lines:
                b_info = BRAND_MAP.get(current_brand_key, { "id": current_brand_key, "name": current_brand_key.title(), "category": "Brand" })
                items.append({
                    "brand": b_info["name"],
                    "brandId": b_info["id"],
                    "category": b_info["name"],
                    "question": clean_text(current_q),
                    "answer": clean_text("\n".join(current_a_lines))
                })
                current_q = None
                current_a_lines = []
            
            num = int(q_match.group(1))
            q_text = q_match.group(2).strip()
            
            # Check if this defines a brand
            for kw in sorted(BRAND_MAP.keys(), key=len, reverse=True):
                if kw in q_text.lower():
                    current_brand_key = kw
                    break
            
            current_q = q_text
        else:
            if current_q:
                current_a_lines.append(text)

    if current_q and current_a_lines:
        b_info = BRAND_MAP.get(current_brand_key, { "id": current_brand_key, "name": current_brand_key.title(), "category": "Brand" })
        items.append({
            "brand": b_info["name"],
            "brandId": b_info["id"],
            "category": b_info["name"],
            "question": clean_text(current_q),
            "answer": clean_text("\n".join(current_a_lines))
        })
        
    return items

def categorize_general_faq(q: str) -> str:
    ql = q.lower()
    if any(w in ql for w in ["kitchen", "modular"]):
        return "Kitchens & Wardrobes"
    if any(w in ql for w in ["wardrobe"]):
        return "Kitchens & Wardrobes"
    if any(w in ql for w in ["laminate", "veneer", "surface", "material", "panel"]):
        return "Surfaces & Materials"
    if any(w in ql for w in ["hardware", "fittings", "accessories"]):
        return "Hardware & Accessories"
    if any(w in ql for w in ["bathroom", "sanitary"]):
        return "Bathroom & Wellness"
    if any(w in ql for w in ["flooring", "wood", "floor"]):
        return "Flooring Solutions"
    if any(w in ql for w in ["architect", "designer", "builder", "developer", "commercial"]):
        return "Architects & Projects"
    if any(w in ql for w in ["showroom", "location", "bangalore", "mysore road", "visit", "contact"]):
        return "General & Showroom"
    return "General & Showroom"

def parse_aaren_general_faq(filepath):
    df = pd.read_excel(filepath, header=None)
    items = []
    
    current_q = None
    current_a_lines = []
    
    for idx, r in df.iterrows():
        val = r.values[0]
        if pd.isna(val):
            continue
        text = clean_text(str(val))
        if not text:
            continue
        
        is_q = text.endswith("?") or re.match(r'^(What|Where|How|Does|Can|Why|Are|Which|Do|Is|Who)\b', text, re.I)
        
        if is_q and len(text) < 160 and not text.startswith("•") and not text.startswith("-"):
            if current_q and current_a_lines:
                items.append({
                    "brand": "Aaren Intpro",
                    "brandId": "aaren",
                    "category": categorize_general_faq(current_q),
                    "question": clean_text(current_q),
                    "answer": clean_text("\n".join(current_a_lines))
                })
                current_q = None
                current_a_lines = []
            current_q = text
        else:
            if current_q:
                current_a_lines.append(text)
                
    if current_q and current_a_lines:
        items.append({
            "brand": "Aaren Intpro",
            "brandId": "aaren",
            "category": categorize_general_faq(current_q),
            "question": clean_text(current_q),
            "answer": clean_text("\n".join(current_a_lines))
        })
        
    return items

def main():
    b_faqs = parse_brandwise_file(f1)
    g_faqs = parse_aaren_general_faq(f2)
    
    print(f"Total Brandwise FAQs parsed: {len(b_faqs)}")
    print(f"Total Aaren General FAQs parsed: {len(g_faqs)}")
    
    all_faqs = []
    
    # 1. Add General FAQs first
    for i, item in enumerate(g_faqs, start=1):
        all_faqs.append({
            "id": f"faq-gen-{i}",
            "category": item["category"],
            "question": item["question"],
            "answer": item["answer"],
            "brand": item["brand"],
            "brandId": item["brandId"],
            "sequenceNumber": i
        })
        
    # 2. Add Brandwise FAQs
    for i, item in enumerate(b_faqs, start=1):
        all_faqs.append({
            "id": f"faq-brand-{i}",
            "category": item["category"],
            "question": item["question"],
            "answer": item["answer"],
            "brand": item["brand"],
            "brandId": item["brandId"],
            "sequenceNumber": len(g_faqs) + i
        })
        
    print(f"Total Combined FAQs: {len(all_faqs)}")
    
    # Save to src/lib/brandwise_faqs.json
    out_json_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "src", "lib", "brandwise_faqs.json"))
    with open(out_json_path, "w", encoding="utf-8") as f:
        json.dump(all_faqs, f, indent=2, ensure_ascii=False)
    print(f"Saved to {out_json_path}")
    
    # Update local data/master_store.json
    master_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data", "master_store.json"))
    if os.path.exists(master_path):
        with open(master_path, "r", encoding="utf-8") as f:
            master = json.load(f)
        master["faqs"] = all_faqs
        with open(master_path, "w", encoding="utf-8") as f:
            json.dump(master, f, indent=2, ensure_ascii=False)
        print("Updated master_store.json")
        
    # Push directly to Firebase Realtime Database (/store/faqs.json and /faqs.json)
    try:
        data_bytes = json.dumps(all_faqs, ensure_ascii=False).encode("utf-8")
        req1 = urllib.request.Request(f"{FIREBASE_RTDB_URL}/store/faqs.json", data=data_bytes, headers={"Content-Type": "application/json"}, method="PUT")
        res1 = urllib.request.urlopen(req1)
        print(f"Pushed to Firebase /store/faqs.json: Status {res1.status}")
        
        req2 = urllib.request.Request(f"{FIREBASE_RTDB_URL}/faqs.json", data=data_bytes, headers={"Content-Type": "application/json"}, method="PUT")
        res2 = urllib.request.urlopen(req2)
        print(f"Pushed to Firebase /faqs.json: Status {res2.status}")
    except Exception as e:
        print(f"Firebase push error: {e}")

if __name__ == "__main__":
    main()

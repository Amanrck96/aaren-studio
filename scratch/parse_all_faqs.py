import os
import re
import json
import pandas as pd

f1 = r"C:\Users\amanr\Downloads\New folder (2)\faq brandwise (1).xlsx"
f2 = r"C:\Users\amanr\Downloads\New folder (2)\Aaren FAQ (1).xlsx"

def parse_brandwise_file(filepath):
    df = pd.read_excel(filepath, header=None)
    items = []
    
    current_brand = "General"
    current_q = None
    current_a_lines = []
    
    brand_keywords = [
        ("FIMA", "Fima Carlo Frattini"),
        ("Falper", "Falper"),
        ("Inkiostro Bianco", "Inkiostro Bianco"),
        ("Loco", "Loco"),
        ("Mafi", "Mafi"),
        ("Mirage", "Mirage"),
        ("Newtech", "Newtechwood"),
        ("Slashform", "Slashform"),
        ("Waltz", "Waltz"),
        ("Formica", "Formica"),
        ("Freedom", "Freedom Screens"),
        ("Peelply", "Peelply"),
        ("Inclass", "Inclass"),
        ("WOW", "WOW"),
        ("IWW", "IWW"),
    ]
    
    for idx, r in df.iterrows():
        val = r.values[0]
        if pd.isna(val):
            continue
        text = str(val).strip()
        if not text:
            continue
        
        # Check if text is a question (starts with a number like "1.", "2.", "10." or ends with "?")
        q_match = re.match(r'^(\d+)[\.\)]\s*(.+)$', text)
        if q_match:
            # Save previous Q&A
            if current_q and current_a_lines:
                items.append({
                    "brand": current_brand,
                    "category": current_brand,
                    "question": current_q,
                    "answer": "\n".join(current_a_lines).strip()
                })
                current_q = None
                current_a_lines = []
            
            num = int(q_match.group(1))
            q_text = q_match.group(2).strip()
            
            # If num == 1, check if this starts a new brand
            if num == 1:
                # Detect brand from question text
                for kw, bname in brand_keywords:
                    if kw.lower() in q_text.lower():
                        current_brand = bname
                        break
            else:
                # Also check if another brand is explicitly mentioned in question
                for kw, bname in brand_keywords:
                    if kw.lower() in q_text.lower():
                        current_brand = bname
                        break
            
            current_q = q_text
        else:
            if current_q:
                current_a_lines.append(text)
            else:
                # Header or unattached text
                pass

    if current_q and current_a_lines:
        items.append({
            "brand": current_brand,
            "category": current_brand,
            "question": current_q,
            "answer": "\n".join(current_a_lines).strip()
        })
        
    return items

def parse_aaren_general_faq(filepath):
    df = pd.read_excel(filepath, header=None)
    items = []
    
    current_q = None
    current_a_lines = []
    
    for idx, r in df.iterrows():
        val = r.values[0]
        if pd.isna(val):
            continue
        text = str(val).strip()
        if not text:
            continue
        
        # In Aaren FAQ, questions end with "?" or start with "What", "Where", "How", "Does", "Can", "Why", "Are", "Which", "Do", "Is"
        is_q = text.endswith("?") or re.match(r'^(What|Where|How|Does|Can|Why|Are|Which|Do|Is|Who)\b', text, re.I)
        
        # But bullet points or multi-line answers shouldn't be questions
        if is_q and len(text) < 150 and not text.startswith("•") and not text.startswith("-"):
            if current_q and current_a_lines:
                items.append({
                    "brand": "Aaren Intpro",
                    "category": "General & Showroom",
                    "question": current_q,
                    "answer": "\n".join(current_a_lines).strip()
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
            "category": "General & Showroom",
            "question": current_q,
            "answer": "\n".join(current_a_lines).strip()
        })
        
    return items

if __name__ == "__main__":
    b_faqs = parse_brandwise_file(f1)
    print(f"Parsed Brandwise FAQs: {len(b_faqs)}")
    brands_found = {}
    for item in b_faqs:
        brands_found[item['brand']] = brands_found.get(item['brand'], 0) + 1
    for b, c in brands_found.items():
        print(f"  Brand [{b}]: {c} FAQs")
        
    g_faqs = parse_aaren_general_faq(f2)
    print(f"\nParsed Aaren General FAQs: {len(g_faqs)}")
    for i in range(min(5, len(g_faqs))):
        print(f"  Q: {g_faqs[i]['question']}")
        print(f"  A: {g_faqs[i]['answer'][:80]}...\n")

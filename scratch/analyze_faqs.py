import os
import re
import pandas as pd

f1 = r"C:\Users\amanr\Downloads\New folder (2)\faq brandwise (1).xlsx"
f2 = r"C:\Users\amanr\Downloads\New folder (2)\Aaren FAQ (1).xlsx"

def analyze_file(filepath):
    print("=" * 60)
    print("ANALYZING:", filepath)
    df = pd.read_excel(filepath, header=None)
    print(f"Total rows: {len(df)}")
    
    rows = []
    for idx, r in df.iterrows():
        val = r.values[0]
        if pd.notna(val):
            text = str(val).strip()
            if text:
                rows.append((idx, text))

    print(f"Non-empty rows: {len(rows)}")
    
    # Print sample and structure
    for i in range(min(25, len(rows))):
        print(f"[{rows[i][0]}] {rows[i][1][:100]}")

if __name__ == "__main__":
    analyze_file(f1)
    analyze_file(f2)

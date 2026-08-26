import os
import re

SRC_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "src"))

# Regex to match /brands/brand_<1-10>_1.png
BRAND_PATTERN = re.compile(r'/brands/brand_(10|[1-9])_1\.png')
# Regex to match /categories/cat_<1-15>.png
CAT_PATTERN = re.compile(r'/categories/cat_(1[0-5]|[1-9])\.png')

def brand_repl(match):
    num = match.group(1)
    return f'/brands/brand_{num}_1.jpg'

def cat_repl(match):
    num = match.group(1)
    return f'/categories/cat_{num}.jpg'

total_files_modified = 0
total_replacements = 0

for root, _, files in os.walk(SRC_DIR):
    for file in files:
        if not (file.endswith(".ts") or file.endswith(".tsx") or file.endswith(".js") or file.endswith(".jsx") or file.endswith(".json")):
            continue
        
        filepath = os.path.join(root, file)
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()

        new_content, count1 = BRAND_PATTERN.subn(brand_repl, content)
        new_content, count2 = CAT_PATTERN.subn(cat_repl, new_content)

        count = count1 + count2
        if count > 0:
            total_files_modified += 1
            total_replacements += count
            rel_path = os.path.relpath(filepath, SRC_DIR)
            print(f"File: src/{rel_path} -> {count} replacements (Brands: {count1}, Categories: {count2})")
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(new_content)

print(f"\nTotal: {total_replacements} replacements across {total_files_modified} files.")

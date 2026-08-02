import json
import os

with open('scratch/excel_catalogs_parsed.json', 'r') as f:
    parsed_catalogs = json.load(f)

# Update data/master_store.json
store_path = 'data/master_store.json'
with open(store_path, 'r') as f:
    store = json.load(f)

# Normalize brand key lookup
brand_key_map = {
    'mirage': 'Mirage',
    'mafi': 'Mafi',
    'inkiostro-bianco': 'Inkiostro Bianco',
    'fima': 'Fima',
    'falper': 'Falper',
    'loco': 'Loco',
    'formica': 'Formica',
    'newtech-wood': 'Newtechwood',
    'newtechwood': 'Newtechwood',
    'waltz': 'Waltz',
    'slashform': 'Slashform',
    'wow': 'WOW',
    'agape': 'agape',
    'iww': 'IWW',
    'bodaq': 'Bodaq',
    'inclass': 'Inclass'
}

store_brands = store.get('brands', [])

for b in store_brands:
    b_name = b.get('name', '')
    b_id = b.get('id', '').lower().replace(' ', '-')
    
    # Match in parsed_catalogs
    matched_key = None
    for key in parsed_catalogs.keys():
        if key.lower().replace(' ', '-') == b_id or key.lower() == b_name.lower():
            matched_key = key
            break
            
    if matched_key and parsed_catalogs[matched_key]:
        cats = parsed_catalogs[matched_key]
        b['catalogs'] = cats
        b['catalogCount'] = f"{len(cats)} catalogs"
        print(f"Updated brand {b_name} with {len(cats)} PDF catalogs from Excel!")

store['brands'] = store_brands

with open(store_path, 'w') as f:
    json.dump(store, f, indent=2)

print("\nSuccessfully updated master_store.json with Excel PDF catalogs & 1st page preview images!")

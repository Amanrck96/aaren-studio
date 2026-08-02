import json

with open('scratch/excel_catalogs_parsed.json', 'r') as f:
    excel_cats = json.load(f)

def get_cats(brand_key):
    for key, cats in excel_cats.items():
        if key.lower().replace(' ', '-') == brand_key.lower() or key.lower() == brand_key.lower():
            return cats
    return []

brands_data = [
  {
    "id": "mirage",
    "name": "MIRAGE",
    "category": "Tiles & Surfaces · Italy",
    "origin": "Italy",
    "estYear": "EST. 1976",
    "catalogCount": f"{len(get_cats('Mirage'))} catalogs",
    "filterTag": "Surfaces",
    "catalogs": get_cats('Mirage')
  },
  {
    "id": "mafi",
    "name": "mafi",
    "category": "Wood Flooring · Austria",
    "origin": "Austria",
    "estYear": "EST. 1997",
    "catalogCount": f"{len(get_cats('Mafi'))} catalogs",
    "filterTag": "Flooring",
    "catalogs": get_cats('Mafi')
  },
  {
    "id": "inkiostro-bianco",
    "name": "Inkiostro Bianco",
    "category": "Wallcovering · Italy",
    "origin": "Italy",
    "estYear": "EST. 2013",
    "catalogCount": f"{len(get_cats('Inkiostro Bianco'))} catalogs",
    "filterTag": "Surfaces",
    "catalogs": get_cats('Inkiostro Bianco')
  },
  {
    "id": "fima",
    "name": "fima Carlo Frattini",
    "category": "Bathroom · Italy",
    "origin": "Italy",
    "estYear": "EST. 1945",
    "catalogCount": f"{len(get_cats('Fima'))} catalogs",
    "filterTag": "Bathroom",
    "catalogs": get_cats('Fima')
  },
  {
    "id": "formica",
    "name": "FORMICA®",
    "category": "Laminates & Surfaces · Global",
    "origin": "Global",
    "estYear": "EST. 1913",
    "catalogCount": f"{len(get_cats('Formica'))} catalogs",
    "filterTag": "Surfaces",
    "catalogs": get_cats('Formica')
  },
  {
    "id": "newtech-wood",
    "name": "NewTechWood",
    "category": "Cladding & Decking · USA",
    "origin": "USA",
    "estYear": "EST. 2005",
    "catalogCount": f"{len(get_cats('Newtechwood'))} catalogs",
    "filterTag": "Cladding",
    "catalogs": get_cats('Newtechwood')
  },
  {
    "id": "waltz",
    "name": "Waltz",
    "category": "Door & Partition · Italy",
    "origin": "Italy",
    "estYear": "EST. 2005",
    "catalogCount": f"{len(get_cats('Waltz'))} catalogs",
    "filterTag": "Doors",
    "catalogs": get_cats('Waltz')
  },
  {
    "id": "slashform",
    "name": "slashform™",
    "category": "Surfaces · Italy",
    "origin": "Italy",
    "estYear": "EST. 2012",
    "catalogCount": f"{len(get_cats('Slashform'))} catalogs",
    "filterTag": "Surfaces",
    "catalogs": get_cats('Slashform')
  },
  {
    "id": "wow",
    "name": "WOW",
    "category": "Decorative Tiles · Spain",
    "origin": "Spain",
    "estYear": "EST. 2010",
    "catalogCount": f"{len(get_cats('WOW'))} catalogs",
    "filterTag": "Surfaces",
    "catalogs": get_cats('WOW')
  },
  {
    "id": "agape",
    "name": "agape",
    "category": "Bathroom Fittings · Italy",
    "origin": "Italy",
    "estYear": "EST. 1973",
    "catalogCount": f"{len(get_cats('agape'))} catalogs",
    "filterTag": "Bathroom",
    "catalogs": get_cats('agape')
  },
  {
    "id": "iww",
    "name": "IWW",
    "category": "Architectural Wood · Germany",
    "origin": "Germany",
    "estYear": "EST. 1995",
    "catalogCount": f"{len(get_cats('IWW'))} catalogs",
    "filterTag": "Flooring",
    "catalogs": get_cats('IWW')
  },
  {
    "id": "bodaq",
    "name": "Bodaq",
    "category": "Interior Film · Korea",
    "origin": "Korea",
    "estYear": "EST. 2002",
    "catalogCount": f"{len(get_cats('Bodaq'))} catalogs",
    "filterTag": "Surfaces",
    "catalogs": get_cats('Bodaq')
  },
  {
    "id": "inclass",
    "name": "Inclass",
    "category": "Design Furniture · Spain",
    "origin": "Spain",
    "estYear": "EST. 1998",
    "catalogCount": f"{len(get_cats('Inclass'))} catalogs",
    "filterTag": "Furniture",
    "catalogs": get_cats('Inclass')
  }
]

with open('scratch/brands_data_generated.json', 'w') as f:
    json.dump(brands_data, f, indent=2)

print(f"Generated DEFAULT_BRANDS with {len(brands_data)} brands!")

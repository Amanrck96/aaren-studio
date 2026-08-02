import pandas as pd

df = pd.read_excel('C:/Users/amanr/Downloads/Brand Catalog.xlsx')
print("Shape:", df.shape)

for idx, row in df.iterrows():
    non_nulls = {col: val for col, val in row.items() if pd.notna(val)}
    print(f"Row {idx}: {non_nulls}")

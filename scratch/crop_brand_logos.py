from PIL import Image
import os

os.makedirs('public/brand_logos', exist_ok=True)
page1 = Image.open('public/pdf_pages/page_1.png')
w, h = page1.size

# Let's inspect the page layout and save crops
# 3x4 or 4x3 grid of logos
grid_w = w / 4
grid_h = h / 3

brand_names = [
    ["mirage", "mafi", "fima", "waltz"],
    ["newtechwood", "slashform", "wow", "formica"],
    ["inkiostro-bianco", "falper", "loco", "fenix"]
]

for row in range(3):
    for col in range(4):
        brand_id = brand_names[row][col]
        box = (
            int(col * grid_w),
            int(row * grid_h),
            int((col + 1) * grid_w),
            int((row + 1) * grid_h)
        )
        crop_img = page1.crop(box)
        out_path = f"public/brand_logos/{brand_id}.png"
        crop_img.save(out_path)
        print(f"Saved brand logo: {brand_id} -> {out_path}")

import os
from PIL import Image

page1_imgs = [f for f in os.listdir('public/brand_logos_pdf') if f.startswith('img_0_')]
print("Page 1 Images Count:", len(page1_imgs))

for img_name in sorted(page1_imgs):
    path = os.path.join('public/brand_logos_pdf', img_name)
    im = Image.open(path)
    print(f"{img_name} -> size: {im.size}, mode: {im.mode}")

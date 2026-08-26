import os
from PIL import Image

def compress_images_in_dir(directory, max_width=1920, quality=85):
    print(f"Processing directory: {directory}")
    for filename in os.listdir(directory):
        filepath = os.path.join(directory, filename)
        if not os.path.isfile(filepath):
            continue
        
        lower = filename.lower()
        if not (lower.endswith(".png") or lower.endswith(".jpg") or lower.endswith(".jpeg")):
            continue

        orig_size = os.path.getsize(filepath)
        # Skip small icons/logos under 100KB unless it's a huge dimension
        if orig_size < 100 * 1024:
            continue

        try:
            with Image.open(filepath) as img:
                # Convert RGBA to RGB if saving as JPEG
                if img.mode in ("RGBA", "P"):
                    rgb_img = img.convert("RGB")
                else:
                    rgb_img = img

                # Resize if exceeding max_width
                w, h = rgb_img.size
                if w > max_width:
                    new_h = int(h * (max_width / w))
                    rgb_img = rgb_img.resize((max_width, new_h), Image.Resampling.LANCZOS)
                
                # Save both optimized PNG and JPG version
                base_name, _ = os.path.splitext(filename)
                jpg_path = os.path.join(directory, f"{base_name}.jpg")
                rgb_img.save(jpg_path, "JPEG", quality=quality, optimize=True, progressive=True)

                # Overwrite original png with optimized RGB/PNG to prevent broken links
                if lower.endswith(".png"):
                    rgb_img.save(filepath, "PNG", optimize=True)

                new_size_png = os.path.getsize(filepath)
                new_size_jpg = os.path.getsize(jpg_path)
                print(f"  OK {filename}: {orig_size / (1024*1024):.2f}MB -> PNG: {new_size_png / 1024:.1f}KB, JPG: {new_size_jpg / 1024:.1f}KB")
        except Exception as e:
            print(f"  ERR processing {filename}: {e}")

if __name__ == "__main__":
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "public"))
    compress_images_in_dir(os.path.join(base_dir, "brands"))
    compress_images_in_dir(os.path.join(base_dir, "categories"))

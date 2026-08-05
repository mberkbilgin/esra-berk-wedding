import os
import requests
from PIL import Image, ImageDraw, ImageFont

def download_font(url, save_path):
    if not os.path.exists(save_path):
        r = requests.get(url)
        with open(save_path, 'wb') as f:
            f.write(r.content)

def create_og_image():
    print("Downloading fonts...")
    great_vibes_url = "https://github.com/google/fonts/raw/main/ofl/greatvibes/GreatVibes-Regular.ttf"
    cinzel_url = "https://github.com/google/fonts/raw/main/ofl/cinzel/Cinzel%5Bwght%5D.ttf"
    
    download_font(great_vibes_url, "GreatVibes.ttf")
    download_font(cinzel_url, "Cinzel.ttf")
    
    print("Loading base image...")
    base_img = Image.open("images/floral_embossed_frame.jpg").convert("RGB")
    width, height = base_img.size
    
    print("Cropping and resizing...")
    # Create a square crop from the center
    new_size = min(width, height)
    left = (width - new_size) / 2
    top = (height - new_size) / 2
    right = (width + new_size) / 2
    bottom = (height + new_size) / 2
    
    img = base_img.crop((left, top, right, bottom))
    img = img.resize((1080, 1080), Image.Resampling.LANCZOS)
    
    draw = ImageDraw.Draw(img)
    
    # Text colors
    gold_dark = (140, 115, 80)
    
    # Fonts
    font_names = ImageFont.truetype("GreatVibes.ttf", 130)
    font_date = ImageFont.truetype("Cinzel.ttf", 45)
    font_small = ImageFont.truetype("Cinzel.ttf", 35)
    
    # Texts
    text_names = "Esra & Berk"
    text_date = "12 EYLÜL 2026"
    text_time = "SAAT: 19:00"
    text_venue = "PYLAI CONCEPT"
    
    def draw_centered_text(text, font, y_pos, color, spacing=0):
        bbox = draw.textbbox((0, 0), text, font=font)
        text_w = bbox[2] - bbox[0]
        x_pos = (1080 - text_w) / 2
        draw.text((x_pos, y_pos), text, font=font, fill=color)

    print("Drawing text...")
    # Place text perfectly inside the arch
    draw_centered_text(text_names, font_names, 370, gold_dark)
    draw_centered_text(text_date, font_date, 570, gold_dark)
    draw_centered_text(text_time, font_small, 640, gold_dark)
    draw_centered_text(text_venue, font_small, 690, gold_dark)
    
    print("Saving optimized image...")
    # Save optimized for WhatsApp (< 300KB)
    img.save("images/og_preview.jpg", format="JPEG", quality=75, optimize=True)
    print("Done! Saved as images/og_preview.jpg")

if __name__ == "__main__":
    create_og_image()

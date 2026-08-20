import os
from PIL import Image, ImageDraw, ImageFont

def create_eps_sura_monochrome_logo():
    # Target resolution: 320 x 70 (Retina 2x: 640 x 140)
    SCALE = 2
    W, H = 320 * SCALE, 70 * SCALE
    img = Image.new('RGBA', (W, H), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)

    # Load system fonts
    font_eps = None
    font_sura = None
    
    fonts_eps = [
        "C:\\Windows\\Fonts\\segoeuib.ttf",
        "C:\\Windows\\Fonts\\arialbd.ttf",
        "C:\\Windows\\Fonts\\tahomabd.ttf"
    ]
    fonts_sura = [
        "C:\\Windows\\Fonts\\segoeui.ttf",
        "C:\\Windows\\Fonts\\arial.ttf",
        "C:\\Windows\\Fonts\\tahoma.ttf"
    ]

    for f in fonts_eps:
        if os.path.exists(f):
            try:
                font_eps = ImageFont.truetype(f, 32 * SCALE)
                break
            except:
                pass

    for f in fonts_sura:
        if os.path.exists(f):
            try:
                font_sura = ImageFont.truetype(f, 32 * SCALE)
                break
            except:
                pass

    if font_eps is None: font_eps = ImageFont.load_default()
    if font_sura is None: font_sura = ImageFont.load_default()

    # Dark Charcoal Color #44484D
    TEXT_COLOR = (68, 72, 77, 255)
    LINE_COLOR = (170, 175, 180, 255)

    # 1. Draw "EPS"
    eps_x = 8 * SCALE
    eps_y = 15 * SCALE
    draw.text((eps_x, eps_y), "EPS", fill=TEXT_COLOR, font=font_eps)

    # Calculate EPS width
    eps_bbox = draw.textbbox((eps_x, eps_y), "EPS", font=font_eps)
    eps_w = eps_bbox[2] - eps_bbox[0]

    # 2. Draw Vertical Separator Line |
    line_x = eps_x + eps_w + 14 * SCALE
    line_top = 16 * SCALE
    line_bottom = line_top + 38 * SCALE
    draw.line([(line_x, line_top), (line_x, line_bottom)], fill=LINE_COLOR, width=2 * SCALE)

    # 3. Draw "sura"
    sura_x = line_x + 14 * SCALE
    sura_y = eps_y
    draw.text((sura_x, sura_y), "sura", fill=TEXT_COLOR, font=font_sura)

    sura_bbox = draw.textbbox((sura_x, sura_y), "sura", font=font_sura)
    sura_w = sura_bbox[2] - sura_bbox[0]

    # 4. Draw Wing Icon next to "sura"
    wing_x = sura_x + sura_w + 6 * SCALE
    wing_y = 16 * SCALE
    wing_w, wing_h = 38 * SCALE, 38 * SCALE

    ala_path = os.path.join('imagenes', 'ala.png')
    if os.path.exists(ala_path):
        wing = Image.open(ala_path).convert('RGBA')
        
        # Convert white wing pixels to dark charcoal #44484D
        pixels = wing.load()
        wing_recolored = Image.new('RGBA', wing.size, (0, 0, 0, 0))
        recolored_pixels = wing_recolored.load()
        for x in range(wing.width):
            for y in range(wing.height):
                pr, pg, pb, pa = pixels[x, y]
                if pr > 200 and pg > 200 and pb > 200:
                    recolored_pixels[x, y] = (68, 72, 77, 255)
                elif pr > 140 and pg > 140 and pb > 140:
                    alpha = int((pr / 255.0) * 255)
                    recolored_pixels[x, y] = (68, 72, 77, alpha)

        wing_resized = wing_recolored.resize((wing_w, wing_h), Image.Resampling.LANCZOS)
        img.paste(wing_resized, (wing_x, wing_y), wing_resized)
    
    # Tight Crop to content
    bbox = img.getbbox()
    if bbox:
        right_crop = min(W, bbox[2] + 6 * SCALE)
        img = img.crop((0, 0, right_crop, H))

    out_path = os.path.join('imagenes', 'logo-sura.png')
    img.save(out_path, 'PNG')
    print("Successfully created crisp EPS | sura logo:", out_path, "Size:", img.size)

if __name__ == '__main__':
    create_eps_sura_monochrome_logo()

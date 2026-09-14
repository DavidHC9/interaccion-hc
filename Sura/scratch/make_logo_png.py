import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def create_sura_logo():
    # Tight bounding box resolution: 310 x 72 (Retina 2x: 620 x 144)
    SCALE = 2
    W, H = 310 * SCALE, 72 * SCALE
    img = Image.new('RGBA', (W, H), (255, 255, 255, 0))

    # Badge size: 58x58 (scaled: 116x116)
    badge_size = 58 * SCALE
    badge_x = 4 * SCALE
    badge_y = (H - badge_size) // 2

    # Draw soft cyan glow behind badge
    glow_pad = 12 * SCALE
    glow_img = Image.new('RGBA', (badge_size + glow_pad * 2, badge_size + glow_pad * 2), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow_img)
    glow_draw.rounded_rectangle(
        [glow_pad, glow_pad, glow_pad + badge_size, glow_pad + badge_size],
        radius=18 * SCALE,
        fill=(0, 163, 224, 120)
    )
    glow_blurred = glow_img.filter(ImageFilter.GaussianBlur(radius=6 * SCALE))
    img.paste(glow_blurred, (badge_x - glow_pad, badge_y - glow_pad + 2 * SCALE), glow_blurred)

    # Draw cyan rounded rectangle badge
    badge = Image.new('RGBA', (badge_size, badge_size), (0, 0, 0, 0))
    b_draw = ImageDraw.Draw(badge)
    b_draw.rounded_rectangle([0, 0, badge_size, badge_size], radius=18 * SCALE, fill=(0, 163, 224, 255))

    # Load ala.png wing
    ala_path = os.path.join('imagenes', 'ala.png')
    if os.path.exists(ala_path):
        wing = Image.open(ala_path).convert('RGBA')
        wing_fit_size = (48 * SCALE, 48 * SCALE)
        wing_resized = wing.resize(wing_fit_size, Image.Resampling.LANCZOS)
        
        wing_x = (badge_size - wing_fit_size[0]) // 2
        wing_y = (badge_size - wing_fit_size[1]) // 2
        
        badge_mask = Image.new('L', (badge_size, badge_size), 0)
        m_draw = ImageDraw.Draw(badge_mask)
        m_draw.rounded_rectangle([0, 0, badge_size, badge_size], radius=18 * SCALE, fill=255)
        
        badge.paste(wing_resized, (wing_x, wing_y), wing_resized)
        badge.putalpha(badge_mask)

    img.paste(badge, (badge_x, badge_y), badge)

    # Text Setup
    draw = ImageDraw.Draw(img)
    
    font_large = None
    font_small = None
    possible_fonts = [
        "C:\\Windows\\Fonts\\arialbd.ttf",
        "C:\\Windows\\Fonts\\segoeuib.ttf",
        "C:\\Windows\\Fonts\\tahomabd.ttf"
    ]
    possible_small = [
        "C:\\Windows\\Fonts\\arialbd.ttf",
        "C:\\Windows\\Fonts\\segoeui.ttf"
    ]
    
    for f in possible_fonts:
        if os.path.exists(f):
            try:
                font_large = ImageFont.truetype(f, 29 * SCALE)
                break
            except:
                pass
                
    for f in possible_small:
        if os.path.exists(f):
            try:
                font_small = ImageFont.truetype(f, 13 * SCALE)
                break
            except:
                pass
                
    if font_large is None:
        font_large = ImageFont.load_default()
    if font_small is None:
        font_small = ImageFont.load_default()

    text_x = badge_x + badge_size + 14 * SCALE
    
    # EPS SURA in Navy #002B49
    draw.text((text_x, 11 * SCALE), "EPS SURA", fill=(0, 43, 73, 255), font=font_large)
    
    # SERVICIOS EN LÍNEA in Slate #5C6F84
    draw.text((text_x, 43 * SCALE), "SERVICIOS EN LÍNEA", fill=(92, 111, 132, 255), font=font_small)

    # Crop tightly to content
    bbox = img.getbbox()
    if bbox:
        # add a small padding on right
        right_crop = min(W, bbox[2] + 8 * SCALE)
        img = img.crop((0, 0, right_crop, H))

    # Resize down for 1x standard display or save crisp high-dpi PNG
    out_path = os.path.join('imagenes', 'logo-sura.png')
    img.save(out_path, 'PNG')
    print("Successfully created cropped logo:", out_path, "Size:", img.size)

if __name__ == '__main__':
    create_sura_logo()

import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

def create_og_image():
    W, H = 1200, 630
    
    # 1. Base image or create rich gradient canvas
    hero_path = 'apps/web/public/images/70th-jalsa-hero.jpg'
    if os.path.exists(hero_path):
        bg = Image.open(hero_path).convert('RGBA')
        # Resize/crop to 1200x630
        bg_ratio = bg.width / bg.height
        target_ratio = W / H
        if bg_ratio > target_ratio:
            new_w = int(bg.height * target_ratio)
            left = (bg.width - new_w) // 2
            bg = bg.crop((left, 0, left + new_w, bg.height))
        else:
            new_h = int(bg.width / target_ratio)
            top = (bg.height - new_h) // 2
            bg = bg.crop((0, top, bg.width, top + new_h))
        bg = bg.resize((W, H), Image.Resampling.LANCZOS)
        bg = bg.filter(ImageFilter.GaussianBlur(radius=3))
    else:
        bg = Image.new('RGBA', (W, H), (10, 42, 33, 255))

    # 2. Dark forest green gradient overlay for contrast and luxury
    overlay = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    draw_overlay = ImageDraw.Draw(overlay)
    
    # Gradient from dark emerald top-left to deep dark navy-green bottom-right
    for y in range(H):
        alpha = int(190 + (y / H) * 45) # 190 to 235
        # Deep forest green (10, 38, 30) with rich vignette
        r = int(6 + (y / H) * 4)
        g = int(32 + (y / H) * 8)
        b = int(24 + (y / H) * 8)
        draw_overlay.line([(0, y), (W, y)], fill=(r, g, b, alpha))

    # Radial vignette shadow
    combined = Image.alpha_composite(bg, overlay)
    
    # Create final drawing canvas
    draw = ImageDraw.Draw(combined)

    # 3. Decorative Gold Borders (Inner subtle border)
    gold_border = (212, 175, 55, 140)
    draw.rectangle([24, 24, W - 25, H - 25], outline=gold_border, width=2)
    draw.rectangle([28, 28, W - 29, H - 29], outline=(212, 175, 55, 50), width=1)

    # 4. Corner accents
    corner_size = 28
    # Top-left
    draw.line([(24, 24 + corner_size), (24, 24), (24 + corner_size, 24)], fill=(212, 175, 55, 255), width=4)
    # Top-right
    draw.line([(W - 25 - corner_size, 24), (W - 25, 24), (W - 25, 24 + corner_size)], fill=(212, 175, 55, 255), width=4)
    # Bottom-left
    draw.line([(24, H - 25 - corner_size), (24, H - 25), (24 + corner_size, H - 25)], fill=(212, 175, 55, 255), width=4)
    # Bottom-right
    draw.line([(W - 25 - corner_size, H - 25), (W - 25, H - 25), (W - 25, H - 25 - corner_size)], fill=(212, 175, 55, 255), width=4)

    # 5. Place Emblem / Crest on Left
    emblem_path = 'apps/web/public/images/jalsa-emblem.png'
    if os.path.exists(emblem_path):
        emblem = Image.open(emblem_path).convert('RGBA')
        emblem = emblem.resize((150, 150), Image.Resampling.LANCZOS)
        # Give emblem a subtle circular gold badge background
        badge_bg = Image.new('RGBA', (164, 164), (0, 0, 0, 0))
        badge_draw = ImageDraw.Draw(badge_bg)
        badge_draw.ellipse([2, 2, 161, 161], fill=(13, 61, 46, 230), outline=(212, 175, 55, 220), width=3)
        combined.paste(badge_bg, (58, 68), badge_bg)
        combined.paste(emblem, (65, 75), emblem)

    # 6. Load Fonts
    font_badge = ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf', 16)
    font_title = ImageFont.truetype('C:/Windows/Fonts/georgiab.ttf', 52)
    font_sub = ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf', 23)
    font_date = ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf', 26)
    font_theme = ImageFont.truetype('C:/Windows/Fonts/georgia.ttf', 22)
    font_theme_bold = ImageFont.truetype('C:/Windows/Fonts/georgiab.ttf', 22)
    font_footer = ImageFont.truetype('C:/Windows/Fonts/arial.ttf', 18)

    # 7. Official Badge pill
    text_badge = "OFFICIAL DIGITAL PLATFORM • AHMADIYYA MUSLIM JAMA'AT NIGERIA"
    badge_x = 245
    badge_y = 65
    draw.rounded_rectangle([badge_x, badge_y, badge_x + 645, badge_y + 34], radius=8, fill=(18, 77, 58, 220), outline=(212, 175, 55, 180), width=1)
    draw.text((badge_x + 18, badge_y + 8), text_badge, font=font_badge, fill=(245, 218, 126))

    # 8. Main Title
    draw.text((245, 114), "72ND JALSA SALANA NIGERIA", font=font_title, fill=(255, 255, 255))

    # 9. Dates & Venue with gold calendar highlight
    date_venue_text = "DECEMBER 18 – 20, 2026   |   JAMIA AHMADIYYA ILARO, OGUN STATE"
    draw.text((245, 182), date_venue_text, font=font_date, fill=(230, 184, 76))

    # Divider bar
    draw.line([(60, 240), (W - 60, 240)], fill=(212, 175, 55, 100), width=1)

    # 10. Convention Theme Box
    theme_box_y = 265
    draw.rounded_rectangle([60, theme_box_y, W - 60, theme_box_y + 145], radius=16, fill=(12, 50, 39, 210), outline=(212, 175, 55, 90), width=2)
    
    # Theme Header
    draw.text((95, theme_box_y + 20), "CONVENTION THEME:", font=font_theme_bold, fill=(212, 175, 55))
    theme_quote = '"Justice and Equality: Indispensable Prerequisites for Global Peace and National Harmony"'
    draw.text((95, theme_box_y + 55), theme_quote, font=font_theme, fill=(245, 245, 245))
    
    # Quranic Reference tag
    draw.text((95, theme_box_y + 95), "Surah An-Nahl (Holy Quran, 16:91)  •  Motto: Love for All, Hatred for None", font=font_footer, fill=(180, 210, 195))

    # 11. Bottom Information Footer Bar
    footer_y = 450
    draw.rounded_rectangle([60, footer_y, W - 60, footer_y + 120], radius=16, fill=(8, 33, 26, 230), outline=(212, 175, 55, 70), width=1)
    
    # 3 info columns in footer
    # Col 1: Registration
    draw.text((95, footer_y + 22), "DIGITAL REGISTRATION", font=font_sub, fill=(255, 255, 255))
    draw.text((95, footer_y + 55), "Pre-register household passes & verified badges", font=font_footer, fill=(190, 205, 200))
    draw.text((95, footer_y + 82), "jalsasalana.ng/registration", font=font_badge, fill=(230, 184, 76))

    # Col 2: Live Guidance & Map
    draw.text((490, footer_y + 22), "PROGRAMME & MAP", font=font_sub, fill=(255, 255, 255))
    draw.text((490, footer_y + 55), "Crowd updates, itinerary, prayer sessions", font=font_footer, fill=(190, 205, 200))
    draw.text((490, footer_y + 82), "Jamia Ahmadiyya Ilaro Complex", font=font_badge, fill=(230, 184, 76))

    # Col 3: Domain & Official Hub
    draw.text((885, footer_y + 22), "OFFICIAL PORTAL", font=font_sub, fill=(255, 255, 255))
    draw.text((885, footer_y + 55), "Speeches, articles, and live broadcast", font=font_footer, fill=(190, 205, 200))
    draw.text((885, footer_y + 82), "https://jalsasalana.ng", font=font_badge, fill=(230, 184, 76))

    # Convert to RGB and save JPEG with high quality and size < 250KB
    final_img = combined.convert('RGB')
    out_dir = 'apps/web/public/images'
    os.makedirs(out_dir, exist_ok=True)
    out_file = os.path.join(out_dir, 'og-share-jalsa.jpg')
    final_img.save(out_file, 'JPEG', quality=88, optimize=True)
    
    # Also save as apps/web/public/og-image.jpg
    final_img.save('apps/web/public/og-image.jpg', 'JPEG', quality=88, optimize=True)

    size_kb = os.path.getsize(out_file) / 1024
    print(f"Generated {out_file} ({size_kb:.1f} KB, dimensions: {W}x{H})")

if __name__ == '__main__':
    create_og_image()

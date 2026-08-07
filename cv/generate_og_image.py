import os
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "og.png"
W, H = 1200, 630
BG = (245, 243, 237)
INK = (26, 29, 24)
ACCENT = (83, 97, 65)


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    win = os.environ.get("WINDIR", r"C:\Windows")
    candidates = [
        os.path.join(win, "Fonts", "segoeuib.ttf" if bold else "segoeui.ttf"),
        os.path.join(win, "Fonts", "arialbd.ttf" if bold else "arial.ttf"),
    ]
    for path in candidates:
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


img = Image.new("RGB", (W, H), BG)
draw = ImageDraw.Draw(img)
draw.text(
    (80, 84),
    "SYSTEMS ADMINISTRATOR · CLOUD INFRASTRUCTURE & AUTOMATION",
    font=font(26, bold=True),
    fill=ACCENT,
)
draw.text((80, 320), "Mohamed Senator", font=font(92, bold=True), fill=INK)
draw.rectangle([80, 508, 1120, 512], fill=ACCENT)
draw.text((80, 548), "Reliable systems. Clear operations.", font=font(36), fill=INK)
img.save(OUT, "PNG")
print(f"wrote {OUT} ({W}x{H})")

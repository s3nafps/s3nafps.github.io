"""Build the lightweight media the portfolio page loads.

Sources in public/media/** are left untouched: Apify Store READMEs link to them.
Outputs go to public/previews/**.

Usage (needs ffmpeg and Pillow):
    python scripts/make-previews.py [--trackr PATH_TO_TRACKR_REPO] [--adhc PATH_TO_ADHEALTHCHECK_REPO]

The two optional repo paths are only needed to refresh the Trackr screenshots
and the ADHealthCheck report image.
"""

from __future__ import annotations

import argparse
import io
import json
import subprocess
import urllib.request
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
MEDIA = ROOT / "public" / "media"
OUT = ROOT / "public" / "previews"

# Apify Actor icons (public store images). Only the podcast Actor has no promo media.
ICON_SIZE = 96
APIFY_STORE = "https://api.apify.com/v2/store?username=s3nafps&limit=100"


def webp(src: Path | Image.Image, dest: Path, width: int, quality: int = 80) -> None:
    image = src if isinstance(src, Image.Image) else Image.open(src)
    image = image.convert("RGB")
    if image.width > width:
        height = round(image.height * width / image.width)
        image = image.resize((width, height), Image.LANCZOS)
    dest.parent.mkdir(parents=True, exist_ok=True)
    image.save(dest, "WEBP", quality=quality, method=6)
    print(f"  {dest.relative_to(ROOT)}  {dest.stat().st_size // 1024} KB")


def preview_loop(src: Path, dest: Path) -> None:
    """A muted, 2.2x speed, 640px H.264 loop for card hover previews."""
    dest.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(
        [
            "ffmpeg", "-v", "error", "-y", "-i", str(src),
            "-an",
            "-vf", "setpts=PTS/2.2,scale=640:-2:flags=lanczos,fps=24",
            "-c:v", "libx264", "-preset", "slow", "-crf", "30",
            "-pix_fmt", "yuv420p", "-movflags", "+faststart",
            str(dest),
        ],
        check=True,
    )
    print(f"  {dest.relative_to(ROOT)}  {dest.stat().st_size // 1024} KB")


def actor_media() -> None:
    print("Actor posters and preview loops")
    for folder in sorted(p for p in MEDIA.iterdir() if p.is_dir()):
        slug = folder.name
        poster = folder / "promo-thumbnail.png"
        promo = folder / "promo.mp4"
        if poster.exists():
            webp(poster, OUT / "actors" / f"{slug}.webp", 960, 78)
        if promo.exists():
            preview_loop(promo, OUT / "actors" / f"{slug}.mp4")


def actor_icons() -> None:
    print("Actor icons")
    with urllib.request.urlopen(APIFY_STORE, timeout=30) as response:
        items = json.load(response)["data"]["items"]
    names = {item["name"]: item["pictureUrl"] for item in items}
    # The podcast Actor is public but not listed by the store search yet.
    names.setdefault(
        "podcast-rss-episode-extractor",
        "https://apify-image-uploads-prod.s3.us-east-1.amazonaws.com/"
        "mmzn9VF30bAgUcK6Q-actor-1Yrq3sFigS3FV6SHS-7SULXqmpej-podcast-rss-episode-extractor.png",
    )
    for slug, url in sorted(names.items()):
        with urllib.request.urlopen(url, timeout=30) as response:
            image = Image.open(io.BytesIO(response.read()))
        image = image.convert("RGB").resize((ICON_SIZE, ICON_SIZE), Image.LANCZOS)
        webp(image, OUT / "actors" / f"{slug}-icon.webp", ICON_SIZE, 85)


def trackr(repo: Path) -> None:
    print("Trackr screenshots")
    for shot in sorted((repo / "docs" / "screenshots").glob("*.png")):
        webp(shot, OUT / "trackr" / f"{shot.stem}.webp", 540, 80)


def adhealthcheck(repo: Path) -> None:
    print("ADHealthCheck report")
    webp(repo / "docs" / "images" / "report.png", OUT / "projects" / "adhealthcheck-report.webp", 1200, 80)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--trackr", type=Path)
    parser.add_argument("--adhc", type=Path)
    parser.add_argument("--skip-video", action="store_true")
    args = parser.parse_args()

    if not args.skip_video:
        actor_media()
    actor_icons()
    if args.trackr:
        trackr(args.trackr)
    if args.adhc:
        adhealthcheck(args.adhc)


if __name__ == "__main__":
    main()

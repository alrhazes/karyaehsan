"""Extract embedded images from KESB Company Profile PDF."""
import fitz
from pathlib import Path

PDF_PATH = Path(r"c:\Users\excal\OneDrive\Desktop\Company Profile KESB 2024.pdf")
OUTPUT_DIR = Path(__file__).resolve().parent.parent / "assets" / "images" / "pdf"

def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    doc = fitz.open(PDF_PATH)
    count = 0

    for page_num in range(2, len(doc)):  # pages 3-26 (0-indexed from 2)
        page = doc[page_num]
        images = page.get_images(full=True)
        for img_index, img in enumerate(images):
            xref = img[0]
            base = doc.extract_image(xref)
            ext = base["ext"]
            out_path = OUTPUT_DIR / f"page-{page_num + 1:02d}-{img_index:02d}.{ext}"
            out_path.write_bytes(base["image"])
            count += 1
            print(f"Saved {out_path.name}")

    # Also render full pages as PNG for diagrams/org charts
    pages_dir = OUTPUT_DIR / "pages"
    pages_dir.mkdir(exist_ok=True)
    for page_num in range(2, len(doc)):
        page = doc[page_num]
        pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))
        out_path = pages_dir / f"page-{page_num + 1:02d}.png"
        pix.save(out_path)
        print(f"Rendered {out_path.name}")

    doc.close()
    print(f"Done. Extracted {count} embedded images.")

if __name__ == "__main__":
    main()

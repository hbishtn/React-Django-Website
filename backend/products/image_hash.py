"""
Photo ka chhota sa "fingerprint" (perceptual hash / dHash) banane ke liye.

Yeh poori image save nahi karta — sirf uska visual pattern ek chhote se
16-character code mein convert karta hai. Do photos ka fingerprint jitna
kareeb hoga, woh utni hi milti-julti dikhti hain.

Sirf Pillow use karta hai (jo already project mein hai) — koi naya heavy
package (numpy/scipy) install nahi karna padta.
"""

from PIL import Image


def compute_image_hash(image_file):
    """Diye gaye image file ka 16-character fingerprint (dHash) return karta hai."""
    image_file.seek(0)
    img = Image.open(image_file).convert('L').resize((9, 8), Image.LANCZOS)
    pixels = list(img.getdata())

    bits = ''
    for row in range(8):
        row_pixels = pixels[row * 9:(row + 1) * 9]
        for col in range(8):
            bits += '1' if row_pixels[col] < row_pixels[col + 1] else '0'

    return f'{int(bits, 2):016x}'


def hash_distance(hash1, hash2):
    """
    Do fingerprints kitne 'alag' hain (Hamming distance).
    0 = bilkul same photo, 64 = poori tarah alag.
    Jitna kam number, utni zyada similar images.
    """
    if not hash1 or not hash2:
        return 64
    try:
        return bin(int(hash1, 16) ^ int(hash2, 16)).count('1')
    except (ValueError, TypeError):
        return 64
"""
Semantic search ke liye — text ko "meaning fingerprint" (embedding) mein
convert karta hai Google Gemini API se, aur do embeddings compare karne
ke liye cosine similarity.
"""

import json
import math
import requests
from decouple import config

GEMINI_API_KEY = config('GEMINI_API_KEY', default='')
EMBED_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent"


def get_embedding(text):
    """Text ka embedding (list of numbers) return karta hai. Fail hone par None."""
    if not GEMINI_API_KEY or not text:
        return None
    try:
        response = requests.post(
            f"{EMBED_URL}?key={GEMINI_API_KEY}",
            json={
                "model": "models/gemini-embedding-001",
                "content": {"parts": [{"text": text}]},
                "outputDimensionality": 768,
            },
            timeout=10,
        )
        if response.status_code == 200:
            return response.json()['embedding']['values']
    except Exception:
        pass
    return None


def save_product_embedding(product):
    """Product ke naam+description se embedding banake save karta hai."""
    text = f"{product.name}. {product.description}"
    vector = get_embedding(text)
    if vector:
        product.embedding = json.dumps(vector)
        product.save(update_fields=['embedding'])


def cosine_similarity(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(y * y for y in b))
    if norm_a == 0 or norm_b == 0:
        return 0
    return dot / (norm_a * norm_b)
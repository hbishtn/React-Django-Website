from django.core.management.base import BaseCommand
from products.models import Product
from products.embeddings import save_product_embedding


class Command(BaseCommand):
    help = 'Saare purane products ke liye embedding generate karta hai (ek baar chalane wala script)'

    def handle(self, *args, **kwargs):
        products = Product.objects.all()
        total = products.count()
        self.stdout.write(f'{total} products mile, embedding generate ho raha hai...')

        for i, product in enumerate(products, 1):
            save_product_embedding(product)
            self.stdout.write(f'{i}/{total} — {product.name}')

        self.stdout.write(self.style.SUCCESS('Sab products ka embedding ban gaya!'))
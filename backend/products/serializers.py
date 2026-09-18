import re
import random
from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Category, Product, ProductImage, Order, OrderItem, Cart, CartItem, Review


def generate_unique_username(email, name=''):
    """Real site jaisa username generate karta hai — email ke pehle hisse se,
    aur agar wo already liya hua hai to ek random number jod deta hai
    (jaise Instagram/Gmail karte hain)."""
    base = re.sub(r'[^a-zA-Z0-9]', '', email.split('@')[0]).lower()
    if not base:
        base = re.sub(r'[^a-zA-Z0-9]', '', name).lower() or 'user'

    username = base
    while User.objects.filter(username=username).exists():
        username = f"{base}{random.randint(100, 9999)}"
    return username


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'is_primary']


class ReviewSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'username', 'rating', 'comment', 'created_at']


# Grid/list views (product list, cart, featured products) — reviews chhod dete hain
# yahan, kyunki wahan sirf card dikhana hai, poori review list nahi chahiye.
# Isse category switch karte waqt response bahut halka aur fast rehta hai.
class ProductListSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price', 'stock',
            'category', 'category_name', 'images', 'created_at',
            'color_group', 'color_name', 'color_hex',
            'is_featured', 'featured_order',
            'discount_price', 'discount_ends_at',
        ]


# Single product page ke liye — yahan reviews bhi chahiye.
class ProductDetailSerializer(ProductListSerializer):
    reviews = ReviewSerializer(many=True, read_only=True)

    class Meta(ProductListSerializer.Meta):
        fields = ProductListSerializer.Meta.fields + ['reviews']


# Purane naam se import karne wali jagahon ke liye backward-compatible alias,
# taaki kahin bhi import error na aaye.
ProductSerializer = ProductDetailSerializer


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'image']

class RegisterSerializer(serializers.ModelSerializer):
    name = serializers.CharField(write_only=True, required=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['name', 'email', 'password']

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Is email se pehle se account bana hua hai.")
        return value

    def create(self, validated_data):
        name = validated_data.get('name', '').strip()
        email = validated_data['email']
        username = generate_unique_username(email, name)

        name_parts = name.split(' ', 1)
        first_name = name_parts[0] if name_parts else ''
        last_name = name_parts[1] if len(name_parts) > 1 else ''

        user = User.objects.create_user(
            username=username,
            email=email,
            password=validated_data['password'],
            first_name=first_name,
            last_name=last_name,
        )
        return user


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = OrderItem
        fields = ['product', 'product_name', 'quantity', 'price']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = ['id', 'full_name', 'address', 'phone', 'total_price', 'status', 'items', 'created_at']
        read_only_fields = ['status', 'created_at']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        user = self.context['request'].user
        order = Order.objects.create(user=user, **validated_data)

        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)

        return order


class CartItemSerializer(serializers.ModelSerializer):
    product_detail = ProductListSerializer(source='product', read_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_detail', 'quantity']


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = ['id', 'items']
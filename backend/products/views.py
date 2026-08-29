from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth import authenticate
from django.db.models import Q
from .models import Category, Product, Order, Cart, CartItem, ProductImage
from .serializers import CategorySerializer, ProductSerializer, RegisterSerializer, OrderSerializer, CartSerializer, ReviewSerializer
from rest_framework.permissions import IsAuthenticated
from groq import Groq
from decouple import config
from .models import Product, Review
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from django.contrib.auth.models import User
import base64
from django.core.files.base import ContentFile
from django.utils.text import slugify
import requests as http_requests


GOOGLE_CLIENT_ID = "949882360226-2rtash8ms56ps5kvess4crp3v1ji5krs.apps.googleusercontent.com"
client = Groq(api_key=config('GROQ_API_KEY'))

SYSTEM_PROMPT = """Tum "Shop Assistant" ho — is cosmetic shop ke liye ek friendly, helpful chatbot.

RULES (strictly follow karo):
1. Jawab HAMESHA short rakho — maximum 3-4 lines, bullet points ka use kam se kam karo.
2. Sirf skincare, makeup, aur cosmetic products ke baare mein baat karo.
3. Agar sawal unrelated hai (coding, politics, general knowledge), politely bolo "Main sirf skincare/makeup products mein help kar sakta hu" aur wapas topic pe le aao.
4. Hinglish mein baat karo — casual aur friendly, jaise ek dost salah de raha ho.
5. Agar specific product recommend karna ho, generic suggestion do (brand names mat lo jab tak specifically na pucha jaye), aur customer ko bolo "hamare shop mein [category] section check karo."
6. Kabhi bhi lambi list ya paragraph mat do — seedha, to-the-point jawab do.
"""

@api_view(['POST'])
@permission_classes([AllowAny])
def chat_view(request):
    user_message = request.data.get('message', '')

    if not user_message:
        return Response({'error': 'Message is required'}, status=400)

    import re
    words = [w for w in re.findall(r'\w+', user_message.lower()) if len(w) > 2]

    search_query = Q()
    for word in words:
        search_query |= (
            Q(name__icontains=word) |
            Q(category__name__icontains=word) |
            Q(description__icontains=word) |
            Q(color_name__icontains=word)
        )

    if words:
        products = Product.objects.filter(search_query).distinct().order_by('-created_at')[:30]
    else:
        products = Product.objects.none()

    if not products.exists():
        products = Product.objects.all().order_by('-created_at')[:20]

    all_categories = ", ".join(Category.objects.values_list('name', flat=True))

    product_list = "\n".join([
        f"- {p.name} (₹{p.price}, category: {p.category.name}, stock: {p.stock})"
        for p in products
    ])

    system_prompt_with_data = SYSTEM_PROMPT + f"""

    Hamari shop ki categories: {all_categories}

    Yaha user ke sawaal se related products hain (agar user kisi specific cheez ke baare mein na poochhe, to ye humare latest products hain) — SIRF inhi products ki baat karo, koi naya product mat banao. Agar in mein se koi match na mile, to user ko bolo ki wo product filhaal available nahi hai ya category browse karne ko bolo:
    {product_list}
    """

    try:
        response = client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[
                {"role": "system", "content": system_prompt_with_data},
                {"role": "user", "content": user_message},
            ],
            max_tokens=300,
        )
        ai_reply = response.choices[0].message.content

        mentioned_products = []
        for p in products:
            if p.name.lower() in ai_reply.lower():
                primary_image = p.images.filter(is_primary=True).first() or p.images.first()
                mentioned_products.append({
                    'id': p.id,
                    'name': p.name,
                    'price': str(p.price),
                    'image': primary_image.image.url if primary_image else None,
                })

        return Response({'reply': ai_reply, 'products': mentioned_products})
    except Exception as e:
        return Response({'error': str(e)}, status=500)

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token, created = Token.objects.get_or_create(user=user)
        return Response({'token': token.key, 'username': user.username, 'is_staff': user.is_staff})
    return Response(serializer.errors, status=400)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)

    if user:
        token, created = Token.objects.get_or_create(user=user)
        return Response({'token': token.key, 'username': user.username, 'is_staff': user.is_staff})
    return Response({'error': 'Invalid credentials'}, status=400)


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save()
        

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_cart(request):
    cart, created = Cart.objects.get_or_create(user=request.user)
    serializer = CartSerializer(cart)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    cart, created = Cart.objects.get_or_create(user=request.user)
    product_id = request.data.get('product_id')

    cart_item, created = CartItem.objects.get_or_create(
        cart=cart, product_id=product_id,
        defaults={'quantity': 1}
    )

    if not created:
        cart_item.quantity += 1
        cart_item.save()

    serializer = CartSerializer(cart)
    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_from_cart(request, item_id):
    CartItem.objects.filter(id=item_id, cart__user=request.user).delete()
    cart = Cart.objects.get(user=request.user)
    serializer = CartSerializer(cart)
    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def clear_cart_view(request):
    cart, created = Cart.objects.get_or_create(user=request.user)
    cart.items.all().delete()
    serializer = CartSerializer(cart)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_review(request, product_id):
    rating = request.data.get('rating')
    comment = request.data.get('comment', '')

    review, created = Review.objects.update_or_create(
        product_id=product_id,
        user=request.user,
        defaults={'rating': rating, 'comment': comment}
    )
    serializer = ReviewSerializer(review)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([AllowAny])
def google_login_view(request):
    token = request.data.get('credential')

    try:
        idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), GOOGLE_CLIENT_ID)
        email = idinfo['email']
        name = idinfo.get('name', email.split('@')[0])

        user, created = User.objects.get_or_create(
            username=email,
            defaults={'email': email, 'first_name': name}
        )

        auth_token, _ = Token.objects.get_or_create(user=user)
        return Response({'token': auth_token.key, 'username': user.username})

    except ValueError:
        return Response({'error': 'Invalid Google token'}, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def analyze_product_image(request):
    if not request.user.is_staff:
        return Response({'error': 'Not authorized'}, status=403)

    image_file = request.FILES.get('image')
    if not image_file:
        return Response({'error': 'Image required'}, status=400)

    image_data = base64.b64encode(image_file.read()).decode('utf-8')

    try:
        response = client.chat.completions.create(
            model="qwen/qwen3.6-27b",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "Ye ek jewelry/cosmetic product ki photo hai jo ek chhoti Indian dukaan (jaise jhumka, mangalsutra, bracelet, kundan set) ke liye hai. Ek attractive product naam (Hindi-English mix mein) aur 2-line description do. Sirf JSON format mein jawab do: {\"name\": \"...\", \"description\": \"...\"}"
                        },
                        {
                            "type": "image_url",
                            "image_url": {"url": f"data:image/jpeg;base64,{image_data}"}
                        }
                    ]
                }
            ],
            max_tokens=1500,
        )
        ai_text = response.choices[0].message.content
        import re

        if '</think>' in ai_text:
            cleaned_text = ai_text.split('</think>')[-1]
        else:
            cleaned_text = ai_text

        return Response({'suggestion': cleaned_text.strip()})
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def quick_add_product(request):
    if not request.user.is_staff:
        return Response({'error': 'Not authorized'}, status=403)

    name = request.data.get('name')
    description = request.data.get('description')
    price = request.data.get('price')
    stock = request.data.get('stock', 10)
    category_slug = request.data.get('category_slug')
    image_file = request.FILES.get('image')
    second_image_file = request.FILES.get('second_image')

    try:
        category = Category.objects.get(slug=category_slug)
    except Category.DoesNotExist:
        return Response({'error': f'Category "{category_slug}" not found'}, status=400)

    product = Product.objects.create(
        name=name,
        description=description,
        price=price,
        stock=stock,
        category=category,
    )

    if image_file:
        ProductImage.objects.create(product=product, image=image_file, is_primary=True)

    if second_image_file:
        ProductImage.objects.create(product=product, image=second_image_file, is_primary=False)

    serializer = ProductSerializer(product)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_category(request):
    if not request.user.is_staff:
        return Response({'error': 'Not authorized'}, status=403)

    name = request.data.get('name')
    if not name:
        return Response({'error': 'Name is required'}, status=400)

    slug = slugify(name)

    category, created = Category.objects.get_or_create(
        slug=slug,
        defaults={'name': name}
    )

    serializer = CategorySerializer(category)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def remove_background(request):
    if not request.user.is_staff:
        return Response({'error': 'Not authorized'}, status=403)

    image_file = request.FILES.get('image')
    if not image_file:
        return Response({'error': 'Image required'}, status=400)

    response = http_requests.post(
        'https://api.remove.bg/v1.0/removebg',
        files={'image_file': image_file.read()},
        data={'size': 'auto'},
        headers={'X-Api-Key': config('REMOVEBG_API_KEY')},
    )

    if response.status_code == 200:
        result = base64.b64encode(response.content).decode('utf-8')
        return Response({'image': f'data:image/png;base64,{result}'})
    else:
        return Response({'error': 'Background removal failed'}, status=500)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def edit_product(request, product_id):
    if not request.user.is_staff:
        return Response({'error': 'Not authorized'}, status=403)

    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=404)

    name = request.data.get('name')
    description = request.data.get('description')
    price = request.data.get('price')
    stock = request.data.get('stock')
    category_slug = request.data.get('category_slug')
    new_image = request.FILES.get('image')

    if name: product.name = name
    if description: product.description = description
    if price: product.price = price
    if stock: product.stock = stock
    if category_slug:
        try:
            product.category = Category.objects.get(slug=category_slug)
        except Category.DoesNotExist:
            pass

    product.save()

    if new_image:
        ProductImage.objects.create(product=product, image=new_image, is_primary=False)

    serializer = ProductSerializer(product)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def featured_products(request):
    products = Product.objects.filter(is_featured=True).order_by('featured_order')[:6]
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def set_featured_products(request):
    if not request.user.is_staff:
        return Response({'error': 'Not authorized'}, status=403)

    product_ids = request.data.get('product_ids', [])

    if len(product_ids) > 6:
        return Response({'error': 'Max 6 products allowed'}, status=400)

    Product.objects.filter(is_featured=True).update(is_featured=False, featured_order=None)

    for index, product_id in enumerate(product_ids):
        Product.objects.filter(id=product_id).update(is_featured=True, featured_order=index + 1)

    products = Product.objects.filter(is_featured=True).order_by('featured_order')
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)
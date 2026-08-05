from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth import authenticate
from .models import Category, Product, Order, Cart, CartItem
from .serializers import CategorySerializer, ProductSerializer, RegisterSerializer, OrderSerializer, CartSerializer
from rest_framework.permissions import IsAuthenticated
from groq import Groq
from decouple import config
from .models import Product

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

    products = Product.objects.all()[:30]
    product_list = "\n".join([
        f"- {p.name} (₹{p.price}, category: {p.category.name}, stock: {p.stock})"
        for p in products
    ])

    system_prompt_with_data = SYSTEM_PROMPT + f"""

Yaha hamare shop ke actual products hain — SIRF inhi products ki baat karo, koi naya product mat banao:
{product_list}
"""

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": system_prompt_with_data},
                {"role": "user", "content": user_message},
            ],
            max_tokens=120,
        )
        ai_reply = response.choices[0].message.content
        return Response({'reply': ai_reply})
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
        return Response({'token': token.key, 'username': user.username})
    return Response(serializer.errors, status=400)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)

    if user:
        token, created = Token.objects.get_or_create(user=user)
        return Response({'token': token.key, 'username': user.username})
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
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, ProductViewSet, register_view, login_view, OrderViewSet, get_cart, add_to_cart, remove_from_cart, clear_cart_view, chat_view, add_review, analyze_product_image
from .views import google_login_view, quick_add_product, create_category

router = DefaultRouter()
router.register('categories', CategoryViewSet)
router.register('products', ProductViewSet)
router.register('order', OrderViewSet, basename='order')

urlpatterns = [
    path('', include(router.urls)),
    path('login/', login_view, name='login'),
    path('register/', register_view, name='register'),
    path('cart/', get_cart, name='get_cart'),
    path('cart/add/', add_to_cart, name='add_to_cart'),
    path('cart/remove/<int:item_id>/', remove_from_cart, name='remove_from_cart'),
    path('cart/clear/', clear_cart_view, name='clear_cart'),
    path('chat/', chat_view, name='chat'),
    path('products/<int:product_id>/review/', add_review, name='add_review'),
    path('google-login/', google_login_view, name='google_login'),
    path('analyze-image/', analyze_product_image, name='analyze_image'),
    path('quick-add-product/', quick_add_product, name='quick_add_product'),
    path('create-category/', create_category, name='create_category'),
]
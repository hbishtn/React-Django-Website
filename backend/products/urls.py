from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, ProductViewSet, register_view, login_view, OrderViewSet, get_cart, add_to_cart, remove_from_cart, clear_cart_view, chat_view

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
    path('chat/', chat_view, name='chat')

]
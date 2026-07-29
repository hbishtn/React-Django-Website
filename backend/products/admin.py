from django.contrib import admin
from .models import Category, Product, ProductImage, Order, OrderItem
# Register your models here.

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)} 

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price', 'stock', 'created_at']
    list_filter = ['category']
    search_fields = ['name', 'description']
    inlines = [ProductImageInline] 

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['product', 'quantity', 'price']


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'full_name', 'total_price', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['full_name', 'user__username']
    inlines = [OrderItemInline]
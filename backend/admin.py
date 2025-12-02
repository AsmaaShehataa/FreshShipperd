"""backend.admin

Django admin registrations and admin class customizations for the
`backend` app. Registers models and configures list display, filters,
and search fields used by staff in the Django admin site.

Keep admin-specific display and form configuration here.
"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import (
    User, Warehouse, Locker, InternationalOrder, ShipmentLabel,
    Item, InternationalBox, BoxItem, DomesticOrder, ItemRequest, StatusLog
)

# Custom User Admin - UPDATED for email as username
class CustomUserAdmin(UserAdmin):
    # Change 'username' to 'email' in list_display
    list_display = ('email', 'first_name', 'last_name', 'role', 'phone', 'is_staff')
    list_filter = ('role', 'is_staff', 'is_superuser')
    
    # Fieldsets - remove 'username' field, keep 'email'
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'phone', 'country', 'city', 'address')}),
        ('Permissions', {'fields': ('role', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important Dates', {'fields': ('last_login', 'date_joined')}),
    )
    
    # Add fieldsets - use 'email' instead of 'username'
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'first_name', 'last_name', 'role', 'phone', 'country', 'city', 'address'),
        }),
    )
    
    # Search by email instead of username
    search_fields = ('email', 'first_name', 'last_name', 'phone')
    
    # Order by email instead of username
    ordering = ('email',)
    
    # Filter by email in horizontal filter
    filter_horizontal = ('groups', 'user_permissions',)

# Update other admin classes that reference 'customer__username' to 'customer__email'
@admin.register(Warehouse)
class WarehouseAdmin(admin.ModelAdmin):
    list_display = ('name', 'city', 'country')
    search_fields = ('name', 'city', 'country')

@admin.register(Locker)
class LockerAdmin(admin.ModelAdmin):
    list_display = ('code', 'customer', 'warehouse')
    list_filter = ('warehouse',)
    search_fields = ('code', 'customer__email', 'customer__first_name', 'customer__last_name')  # Changed from username to email

@admin.register(InternationalOrder)
class InternationalOrderAdmin(admin.ModelAdmin):
    list_display = ('marketplace', 'marketplace_order_ref', 'customer', 'status', 'total_amount')
    list_filter = ('marketplace', 'status')
    search_fields = ('marketplace_order_ref', 'customer__email', 'customer__first_name', 'customer__last_name')  # Changed

@admin.register(ShipmentLabel)
class ShipmentLabelAdmin(admin.ModelAdmin):
    list_display = ('barcode_number', 'customer', 'international_order', 'is_printed')
    list_filter = ('is_printed',)
    search_fields = ('barcode_number', 'customer__email', 'customer__first_name', 'customer__last_name')  # Changed

@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ('tracking_number', 'customer', 'category', 'status', 'condition')
    list_filter = ('status', 'condition', 'category')
    search_fields = ('tracking_number', 'customer__email', 'customer__first_name', 'customer__last_name')  # Changed

@admin.register(InternationalBox)
class InternationalBoxAdmin(admin.ModelAdmin):
    list_display = ('box_number', 'status', 'total_weight_kg', 'items_count')
    list_filter = ('status',)
    search_fields = ('box_number', 'tracking_number')

@admin.register(BoxItem)
class BoxItemAdmin(admin.ModelAdmin):
    list_display = ('box', 'item', 'added_at')
    list_filter = ('added_at',)

@admin.register(DomesticOrder)
class DomesticOrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'customer', 'status', 'created_at')
    list_filter = ('status',)
    search_fields = ('customer__email', 'customer__first_name', 'customer__last_name')  # Changed

@admin.register(ItemRequest)
class ItemRequestAdmin(admin.ModelAdmin):
    list_display = ('subject', 'customer', 'status', 'created_at')
    list_filter = ('status',)
    search_fields = ('subject', 'customer__email', 'customer__first_name', 'customer__last_name')  # Changed

@admin.register(StatusLog)
class StatusLogAdmin(admin.ModelAdmin):
    list_display = ('entity_type', 'entity_id', 'status', 'changed_by', 'created_at')
    list_filter = ('entity_type', 'status')
    search_fields = ('entity_id',)

# Special registration for User model
admin.site.register(User, CustomUserAdmin)
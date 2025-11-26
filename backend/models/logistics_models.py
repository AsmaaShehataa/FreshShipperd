"""backend.models.logistics_models

Models representing warehouses, lockers and external marketplace orders.
Contains small domain objects used by the logistics workflows.
"""

from django.db import models
from .enums import SourceOrderStatus

class Warehouse(models.Model):
    """Physical warehouse facility (UAE, Egypt, etc.)"""
    name = models.CharField(max_length=255, unique=True)
    address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    
    class Meta:
        db_table = 'warehouses'
    
    def __str__(self):
        return f"{self.name} ({self.country})"

class Locker(models.Model):
    """Customer locker at a specific warehouse"""
    code = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True, null=True)
    customer = models.ForeignKey('User', on_delete=models.CASCADE)
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE)
    
    class Meta:
        db_table = 'lockers'
        unique_together = ['customer', 'warehouse']
    
    def __str__(self):
        return f"Locker {self.code} - {self.customer.username}"

class InternationalOrder(models.Model):
    """External marketplace order (Amazon, Noon, etc.)"""
    customer = models.ForeignKey('User', on_delete=models.CASCADE)
    marketplace = models.CharField(max_length=50)  # 'amazon', 'noon'
    marketplace_order_ref = models.CharField(max_length=100, blank=True, null=True)
    order_url = models.URLField(blank=True, null=True)
    currency = models.CharField(max_length=10, blank=True, null=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    status = models.CharField(
        max_length=20, 
        choices=SourceOrderStatus.choices, 
        default=SourceOrderStatus.PLACED
    )
    
    class Meta:
        db_table = 'international_orders'
        indexes = [
            models.Index(fields=['customer', 'status']),
            models.Index(fields=['marketplace', 'marketplace_order_ref']),
        ]
    
    def __str__(self):
        return f"{self.marketplace} Order #{self.marketplace_order_ref}"

class ShipmentLabel(models.Model):
    """Internal barcode system for package tracking"""
    barcode_number = models.CharField(max_length=100, unique=True)
    customer = models.ForeignKey('User', on_delete=models.CASCADE)
    international_order = models.OneToOneField(InternationalOrder, on_delete=models.CASCADE)
    is_printed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'shipment_labels'
    
    def __str__(self):
        return f"Label {self.barcode_number}"
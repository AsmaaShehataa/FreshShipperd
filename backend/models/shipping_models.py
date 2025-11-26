"""backend.models.shipping_models

Models related to international and domestic shipping: boxes, box-item
relationships and final domestic orders.
"""

from django.db import models
from .enums import BoxStatus

class InternationalBox(models.Model):
    """International shipping box/container"""
    box_number = models.CharField(max_length=100, unique=True)
    tracking_number = models.CharField(max_length=255, unique=True, blank=True, null=True, db_index=True)
    status = models.CharField(
        max_length=20, 
        choices=BoxStatus.choices, 
        default=BoxStatus.BUILDING
    )
    origin_country = models.CharField(max_length=100, blank=True, null=True)
    destination_country = models.CharField(max_length=100, blank=True, null=True)
    total_weight_kg = models.FloatField(default=0.0)
    items_count = models.IntegerField(default=0)
    
    # Relationships
    warehouse = models.ForeignKey('Warehouse', on_delete=models.SET_NULL, blank=True, null=True)
    
    class Meta:
        db_table = 'international_boxes'
    
    def __str__(self):
        return f"Box {self.box_number} - {self.status}"

class BoxItem(models.Model):
    """Many-to-many relationship between boxes and items"""
    box = models.ForeignKey(InternationalBox, on_delete=models.CASCADE)
    item = models.ForeignKey('Item', on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)
    added_by = models.ForeignKey('User', on_delete=models.SET_NULL, blank=True, null=True)
    note = models.TextField(blank=True, null=True)
    
    class Meta:
        db_table = 'box_items'
        unique_together = ['box', 'item']
    
    def __str__(self):
        return f"BoxItem {self.box.box_number} - {self.item.tracking_number}"

class DomesticOrder(models.Model):
    """Final domestic delivery within Egypt"""
    customer = models.ForeignKey('User', on_delete=models.CASCADE)
    shipping_address = models.TextField()
    status = models.CharField(
        max_length=20, 
        choices=[
            ('CART', 'Cart'),
            ('PLACED', 'Placed'), 
            ('OUT_FOR_DELIVERY', 'Out for Delivery'),
            ('DELIVERED', 'Delivered')
        ], 
        default='CART'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'domestic_orders'
    
    def __str__(self):
        return f"Domestic Order {self.id} - {self.customer.username}"
"""backend.models.items_models

Item-related models used for tracking physical goods, requests and
customer service interactions.
"""

from django.db import models
from .enums import ItemStatus, RequestStatus

class Item(models.Model):
    """Physical item scanned at the warehouse"""
    tracking_number = models.CharField(max_length=255, unique=True, db_index=True)
    scanning_date = models.DateTimeField(blank=True, null=True)
    weight_kg = models.FloatField(blank=True, null=True)
    category = models.CharField(max_length=100, blank=True, null=True)
    quantity = models.IntegerField(default=1)
    country_origin = models.CharField(max_length=100, blank=True, null=True)
    status = models.CharField(
        max_length=30, 
        choices=ItemStatus.choices, 
        default=ItemStatus.AWAITING_ARRIVAL
    )
    condition = models.CharField(
        max_length=20, 
        choices=[('OK', 'Ok'), ('DAMAGED', 'Damaged'), ('MISMATCHED', 'Mismatched')], 
        default='OK'
    )
    
    # Relationships
    customer = models.ForeignKey('User', on_delete=models.CASCADE)
    locker = models.ForeignKey('Locker', on_delete=models.CASCADE)
    international_order = models.ForeignKey('InternationalOrder', on_delete=models.SET_NULL, blank=True, null=True)
    
    class Meta:
        db_table = 'items'
        indexes = [
            models.Index(fields=['customer', 'status']),
        ]
    
    def __str__(self):
        return f"Item {self.tracking_number} - {self.customer.username}"

class ItemRequest(models.Model):
    """Customer service requests (mismatches, returns, refunds)"""
    customer = models.ForeignKey('User', on_delete=models.CASCADE)
    subject = models.CharField(max_length=255)
    message = models.TextField()
    charge = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    item = models.ForeignKey(Item, on_delete=models.SET_NULL, blank=True, null=True)
    box = models.ForeignKey('InternationalBox', on_delete=models.SET_NULL, blank=True, null=True)
    status = models.CharField(
        max_length=20, 
        choices=RequestStatus.choices, 
        default=RequestStatus.OPEN
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'item_requests'
    
    def __str__(self):
        return f"Request {self.id} - {self.subject}"
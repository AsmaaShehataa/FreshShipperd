# backend/serializers.py
"""Serializers are like translators between your Django models (database) and JSON (API responses). 
They convert complex data types, like Django model instances, into native Python datatypes that can then be easily rendered into JSON. They also handle validation and deserialization, 
converting JSON back into Django models when needed.

Django Models = Speaking in "Python/Database" language
React Frontend = Speaking in "JSON/JavaScript" language
Serializers = The translator that converts between these languages
"""

from rest_framework import serializers
from .models import InternationalBox, Item, User, Warehouse
from django.contrib.auth.models import User as DjangoUser


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 
            'email', 
            'first_name', 
            'last_name', 
            'role',
            'phone',
            'country',
            'city',
            'address',
            'email_notifications',  # Add these new fields
            'sms_notifications',
            'timezone'
        ]
        read_only_fields = ['id', 'email', 'role']
class WarehouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Warehouse
        fields = ['name', 'country']

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ['item_id', 'name', 'status', 'category', 'price']

class InternationalBoxSerializer(serializers.ModelSerializer):
    warehouse = WarehouseSerializer(read_only=True)

    
    class Meta:
        model = InternationalBox
        fields = [
            'box_number', 
            'status', 
            'origin_country', 
            'destination_country',
            'total_weight_kg', 
            'items_count',
            'warehouse'
        ]
"""backend.models.signals

Signal handlers for automatically creating customer lockers.

This module listens to Django's `post_save` signal for the User model. 
When a new user with the role `CUSTOMER` is created, the system 
automatically generates lockers for that customer across all warehouses.

Functions:
    create_customer_lockers:
        Signal receiver that triggers on new User creation. It generates 
        a unique locker for the new customer in each warehouse.

    generate_locker_code:
        Helper function that builds a unique locker code using warehouse
        and user identifiers, ensuring sequential numbering for lockers
        within the same warehouse–customer combination.
"""

from django.db.models.signals import post_save
from django.dispatch import receiver
from backend.models import User, Warehouse, Locker
from .enums import UserRole

@receiver(post_save, sender=User)
def create_customer_lockers(sender, instance, created, **kwargs):
    """Automatically create lockers when a new customer is created"""
    if created and instance.role == UserRole.CUSTOMER:
        warehouses = Warehouse.objects.all()
        for warehouse in warehouses:
            locker_code = generate_locker_code(instance, warehouse)
            
            Locker.objects.create(
                code=locker_code,
                description=f"Auto-assigned locker for {instance.username}",
                customer=instance,
                warehouse=warehouse
            )

def generate_locker_code(user, warehouse):
    """Generate unique locker code"""
    warehouse_code = warehouse.city[:3].upper() if warehouse.city else warehouse.name[:3].upper()
    user_code = user.username.upper()[:5]
    
    existing_count = Locker.objects.filter(
        warehouse=warehouse,
        code__startswith=f"{warehouse_code}-{user_code}-"
    ).count()
    
    next_number = existing_count + 1
    return f"{warehouse_code}-{user_code}-{next_number:03d}"
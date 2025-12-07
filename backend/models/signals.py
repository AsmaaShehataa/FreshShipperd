"""backend.models.signals

Signal handlers for automatically creating customer lockers.
"""

from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db import transaction
from backend.models import User, Warehouse, Locker
from .enums import UserRole
import logging

logger = logging.getLogger(__name__)

@receiver(post_save, sender=User)
def create_customer_lockers(sender, instance, created, **kwargs):
    """Automatically create lockers when a new customer is created"""
    if created and instance.role == UserRole.CUSTOMER:
        try:
            with transaction.atomic():
                warehouses = Warehouse.objects.all()
                for warehouse in warehouses:
                    locker_code = generate_locker_code(instance, warehouse)
                    
                    # Check if locker with this code already exists
                    if not Locker.objects.filter(code=locker_code).exists():
                        Locker.objects.create(
                            code=locker_code,
                            description=f"Auto-assigned locker for {instance.username}",
                            customer=instance,
                            warehouse=warehouse
                        )
                        logger.info(f"Created locker {locker_code} for {instance.email}")
                    else:
                        # Generate alternative code
                        alternative_code = generate_alternative_code(instance, warehouse)
                        Locker.objects.create(
                            code=alternative_code,
                            description=f"Auto-assigned locker for {instance.username}",
                            customer=instance,
                            warehouse=warehouse
                        )
                        logger.info(f"Created alternative locker {alternative_code} for {instance.email}")
        except Exception as e:
            logger.error(f"Failed to create lockers for {instance.email}: {str(e)}")
            # Don't raise exception to prevent user creation from failing

def generate_locker_code(user, warehouse):
    """Generate unique locker code"""
    if warehouse.city:
        warehouse_code = warehouse.city[:3].upper().replace(' ', '')
    else:
        warehouse_code = warehouse.name[:3].upper().replace(' ', '')
    
    if user.username:
        user_code = user.username.upper()[:5].replace(' ', '')
    else:
        user_code = user.email.split('@')[0].upper()[:5].replace(' ', '')
    
    existing_count = Locker.objects.filter(
        warehouse=warehouse,
        customer=user
    ).count()
    
    next_number = existing_count + 1
    return f"{warehouse_code}-{user_code}-{next_number:03d}"

def generate_alternative_code(user, warehouse):
    """Generate alternative locker code if primary exists"""
    if warehouse.city:
        warehouse_code = warehouse.city[:3].upper().replace(' ', '')
    else:
        warehouse_code = warehouse.name[:3].upper().replace(' ', '')
    
    if user.username:
        user_code = user.username.upper()[:5].replace(' ', '')
    else:
        user_code = user.email.split('@')[0].upper()[:5].replace(' ', '')
    
    # Use timestamp to ensure uniqueness
    import time
    timestamp = int(time.time()) % 1000
    
    return f"{warehouse_code}-{user_code}-ALT-{timestamp:03d}"
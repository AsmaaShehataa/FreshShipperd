"""Django management command: seed_data

Populate the database with lightweight demo/test data for local
development. Use `python manage.py seed_data` to run. The command is
idempotent for existing objects where appropriate.
"""

from django.core.management.base import BaseCommand
from backend.models import User, Warehouse, InternationalBox, Item, Locker
from backend.models.enums import UserRole, BoxStatus, ItemStatus
import random

class Command(BaseCommand):
    def handle(self, *args, **options):
        self.stdout.write("Creating fresh seed data...")
        
        # Get or create warehouses
        uae_warehouse, _ = Warehouse.objects.get_or_create(
            name="Shipped UAE Warehouse",
            defaults={'country': 'UAE'}
        )
        egypt_warehouse, _ = Warehouse.objects.get_or_create(
            name="Egypt Warehouse", 
            defaults={'country': 'Egypt'}
        )
        
        # Create admin if doesn't exist
        if not User.objects.filter(username='admin').exists():
            admin = User.objects.create_superuser(
                username='admin',
                email='admin@shipperd.com',
                password='admin123'
            )
            self.stdout.write(f"Created admin: {admin.username}")
        
        # Create sample customers
        customers = []
        for i in range(5):
            username = f'customer{i+1}'
            if not User.objects.filter(username=username).exists():
                customer = User.objects.create_user(
                    username=username,
                    email=f'{username}@example.com',
                    password='pass123',
                    role=UserRole.CUSTOMER
                )
                customers.append(customer)
                self.stdout.write(f"Created customer: {customer.username}")
        
        # Create sample boxes - using only fields that exist
        self.create_sample_boxes(customers, uae_warehouse)
        
        self.stdout.write(self.style.SUCCESS('✅ Successfully created fresh seed data!'))
    
    def create_sample_boxes(self, customers, warehouse):
        statuses = [BoxStatus.BUILDING, BoxStatus.READY_TO_SHIP, BoxStatus.SHIPPED, BoxStatus.IN_TRANSIT]
        
        for i in range(10):
            box = InternationalBox.objects.create(
                box_number=f'BOX-{i+1:03d}',
                status=random.choice(statuses),
                total_weight_kg=random.uniform(5.0, 30.0),
                items_count=random.randint(3, 15),
                warehouse=warehouse,
                origin_country='UAE',
                destination_country='Egypt'
            )
            self.stdout.write(f"Created box: {box.box_number}")
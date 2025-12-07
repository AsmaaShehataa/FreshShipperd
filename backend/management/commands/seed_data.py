# backend/management/commands/seed_data.py
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import transaction
from backend.models.logistics_models import Warehouse
import logging

logger = logging.getLogger(__name__)
User = get_user_model()

class Command(BaseCommand):
    help = 'Seed initial data for the application'
    
    def handle(self, *args, **kwargs):
        self.stdout.write('🌱 Starting data seeding...')
        
        try:
            with transaction.atomic():
                # 1. Create warehouses
                self.create_warehouses()
                
                # 2. Create admin user
                self.create_admin()
                
                # 3. Create customer users
                self.create_customers()
                
                self.stdout.write(self.style.SUCCESS('🎉 Data seeding completed successfully!'))
                
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'❌ Error seeding data: {str(e)}'))
            logger.exception('Seeding error:')
            raise
    
    def create_warehouses(self):
        """Create initial warehouses"""
        warehouse_data = [
            {
                'name': 'Dubai Main Warehouse',
                'city': 'Dubai',
                'country': 'AE',
                # Remove is_active if it doesn't exist
            },
            {
                'name': 'Abu Dhabi Warehouse',
                'city': 'Abu Dhabi',
                'country': 'AE',
                # Remove is_active if it doesn't exist
            }
        ]
        
        for w_data in warehouse_data:
            # First, try to get or create without any extra fields
            warehouse, created = Warehouse.objects.get_or_create(
                name=w_data['name'],
                defaults={
                    'city': w_data.get('city', ''),
                    'country': w_data.get('country', 'AE')
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'✅ Created warehouse: {warehouse.name}'))
            else:
                self.stdout.write(f'ℹ️  Warehouse already exists: {warehouse.name}')
    
    def create_admin(self):
        """Create admin user"""
        admin_data = {
            'email': 'admin@example.com',
            'username': 'admin',
            'first_name': 'Admin',
            'last_name': 'User',
            'is_staff': True,
            'is_superuser': True,
            'is_active': True
        }
        
        admin, created = User.objects.get_or_create(
            email=admin_data['email'],
            defaults=admin_data
        )
        
        if created:
            admin.set_password('admin123')
            admin.save()
            self.stdout.write(self.style.SUCCESS('✅ Created admin: admin@example.com'))
        else:
            # Update existing admin
            for key, value in admin_data.items():
                if key != 'email' and hasattr(admin, key):
                    setattr(admin, key, value)
            admin.set_password('admin123')
            admin.save()
            self.stdout.write('ℹ️  Updated existing admin: admin@example.com')
    
    def create_customers(self):
        """Create customer users"""
        customers_data = [
            {
                'email': 'customer1@example.com',
                'username': 'customer1',
                'first_name': 'John',
                'last_name': 'Doe',
                'phone': '+971501234567',
                'company_name': 'Doe Trading',
                'country': 'AE',
                'password': 'password123'
            },
            {
                'email': 'customer2@example.com',
                'username': 'customer2',
                'first_name': 'Jane',
                'last_name': 'Smith',
                'phone': '+971502345678',
                'company_name': 'Smith Imports',
                'country': 'AE',
                'password': 'password123'
            }
        ]
        
        for customer_data in customers_data:
            # Prepare user data - only include fields that definitely exist
            user_data = {
                'email': customer_data['email'],
                'username': customer_data['username'],
                'first_name': customer_data['first_name'],
                'last_name': customer_data['last_name'],
                'is_active': True
            }
            
            # Check if user exists
            try:
                user = User.objects.get(email=customer_data['email'])
                self.stdout.write(f'ℹ️  User already exists: {customer_data["email"]}')
                
                # Update user data
                for key, value in user_data.items():
                    if key != 'email' and hasattr(user, key):
                        setattr(user, key, value)
                user.save()
                
            except User.DoesNotExist:
                # Create new user
                user = User.objects.create_user(
                    email=customer_data['email'],
                    username=customer_data['username'],
                    password=customer_data['password'],
                    first_name=customer_data['first_name'],
                    last_name=customer_data['last_name'],
                    is_active=True
                )
                
                self.stdout.write(self.style.SUCCESS(f'✅ Created customer: {customer_data["email"]}'))
            
            # Try to add additional customer fields if they exist on the User model
            for field in ['phone', 'company_name', 'country']:
                if hasattr(user, field) and field in customer_data:
                    setattr(user, field, customer_data[field])
                    user.save()
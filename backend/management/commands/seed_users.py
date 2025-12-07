# backend/management/commands/seed_users.py
from django.core.management.base import BaseCommand
from backend.models import User
from backend.models.enums import UserRole

class Command(BaseCommand):
    help = 'Seed test users for different roles'

    def handle(self, *args, **options):
        users = [
            {
                'email': 'superadmin@shipperd.com',
                'password': 'password123',
                'first_name': 'Super',
                'last_name': 'Admin',
                'role': UserRole.SUPER_ADMIN,
                'phone': '+12345678901',
                'country': 'Saudi Arabia',
                'city': 'Riyadh',
            },
            {
                'email': 'admin@shipperd.com',
                'password': 'password123',
                'first_name': 'Regular',
                'last_name': 'Admin',
                'role': UserRole.ADMIN,
                'phone': '+12345678902',
                'country': 'Saudi Arabia',
                'city': 'Jeddah',
            },
            {
                'email': 'employee@shipperd.com',
                'password': 'password123',
                'first_name': 'John',
                'last_name': 'Doe',
                'role': UserRole.EMPLOYEE,
                'phone': '+12345678903',
                'country': 'Saudi Arabia',
                'city': 'Dammam',
            },
            {
                'email': 'employee2@shipperd.com',
                'password': 'password123',
                'first_name': 'Sarah',
                'last_name': 'Smith',
                'role': UserRole.EMPLOYEE,
                'phone': '+12345678904',
                'country': 'UAE',
                'city': 'Dubai',
            },
        ]
        
        for user_data in users:
            user, created = User.objects.get_or_create(
                email=user_data['email'],
                defaults={
                    'first_name': user_data['first_name'],
                    'last_name': user_data['last_name'],
                    'role': user_data['role'],
                    'phone': user_data['phone'],
                    'country': user_data['country'],
                    'city': user_data['city'],
                }
            )
            if created:
                user.set_password(user_data['password'])
                user.save()
                self.stdout.write(self.style.SUCCESS(f'✅ Created {user.role}: {user.email}'))
            else:
                self.stdout.write(self.style.WARNING(f'⚠️ User already exists: {user.email}'))
        
        self.stdout.write(self.style.SUCCESS('🎉 All test users seeded successfully!'))
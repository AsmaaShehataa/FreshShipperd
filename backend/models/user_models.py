"""backend.models.user_models

Custom user model and user-related utilities for the `backend` app.
Defines the application `User` model with roles, contact fields and
helper methods used across the codebase.
"""

from django.contrib.auth.models import AbstractUser
from django.db import models
from .enums import UserRole

class User(AbstractUser):
    """Custom User model for Shipperd"""
    role = models.CharField(
        max_length=20, 
        choices=UserRole.choices, 
        default=UserRole.CUSTOMER
    )
    phone = models.CharField(max_length=50, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    
    class Meta:
        db_table = 'users'
    
    def __str__(self):
        return f"{self.username} ({self.role})"
    
    def save(self, *args, **kwargs):
        if self.is_superuser and self.role != UserRole.SUPER_ADMIN:
            self.role = UserRole.SUPER_ADMIN
        elif self.is_staff and self.role == UserRole.CUSTOMER:
            self.role = UserRole.EMPLOYEE
        super().save(*args, **kwargs)
        
    def __str__(self):
        return f"{self.username} ({self.role})"
    
    def is_customer(self):
        return self.role == UserRole.CUSTOMER
    
    def is_employee(self):
        return self.role in [UserRole.EMPLOYEE, UserRole.ADMIN, UserRole.SUPER_ADMIN]
    
    def is_admin(self):
        return self.role in [UserRole.ADMIN, UserRole.SUPER_ADMIN]
"""backend.models.user_models

Custom user model and user-related utilities for the `backend` app.
Defines the application `User` model with roles, contact fields and
helper methods used across the codebase.
"""

from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.utils.translation import gettext_lazy as _
from .enums import UserRole

class UserManager(BaseUserManager):
    """Custom manager for User model with email as username"""
    
    def _create_user(self, email, password=None, **extra_fields):
        """Create and save a User with the given email and password."""
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)
    
    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', UserRole.SUPER_ADMIN)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        
        return self._create_user(email, password, **extra_fields)

class User(AbstractUser):
    """Custom User model for Shipperd - Email as username"""
    
    username = models.CharField(
        _('username'),
        max_length=150,
        blank=True,
        null=True,
        help_text=_('Optional. 150 characters or fewer.'),
    )
    email = models.EmailField(_('email address'), unique=True)
    role = models.CharField(
        max_length=20, 
        choices=UserRole.choices, 
        default=UserRole.CUSTOMER
    )
    phone = models.CharField(max_length=50, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    
    # Adding Settings fields to match with user_settings endpoint:
    email_notifications = models.BooleanField(default=True)
    sms_notifications = models.BooleanField(default=False)
    #language = models.CharField(max_length=10, default='en')
    timezone = models.CharField(max_length=50, default='UTC')
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']
    
    objects = UserManager()  # ADD THIS LINE - CRITICAL!
    
    class Meta:
        db_table = 'users'
    
    def __str__(self):
        return f"{self.email} ({self.role})"
    
    def save(self, *args, **kwargs):
        if self.is_superuser and self.role != UserRole.SUPER_ADMIN:
            self.role = UserRole.SUPER_ADMIN
        elif self.is_staff and self.role == UserRole.CUSTOMER:
            self.role = UserRole.EMPLOYEE
        super().save(*args, **kwargs)
    
    def is_customer(self):
        return self.role == UserRole.CUSTOMER
    
    def is_employee(self):
        return self.role in [UserRole.EMPLOYEE, UserRole.ADMIN, UserRole.SUPER_ADMIN]
    
    def is_admin(self):
        return self.role in [UserRole.ADMIN, UserRole.SUPER_ADMIN]
    
    def is_super_admin(self):
        return self.role == UserRole.SUPER_ADMIN
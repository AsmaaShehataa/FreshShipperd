#!/usr/bin/python3
"""Base Model"""

from datetime import datetime
import uuid
from django.db import models


time = "%Y-%m-%dT%H:%M:%S.%f"


class BaseModel(models.Model):
    """Base model with UUID, created_at, updated_at"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        """Meta class to define abstract model"""
        abstract = True

    
    def __str__(self):
        return f"{self.__class__.__name__} {self.id}"

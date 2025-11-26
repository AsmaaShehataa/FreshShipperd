"""backend.models.audit_models

Audit and logging models used to capture status changes and important
events related to items, boxes, and other entities. Keep immutable
historical entries here.
"""

from django.db import models
from .enums import EntityType

class StatusLog(models.Model):
    """Audit log for status changes of items, boxes, etc."""
    entity_type = models.CharField(max_length=20, choices=EntityType.choices)
    entity_id = models.CharField(max_length=60)  # UUID of the entity
    status = models.CharField(max_length=50)
    note = models.TextField(blank=True, null=True)
    changed_by = models.ForeignKey('User', on_delete=models.SET_NULL, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'status_logs'
        indexes = [
            models.Index(fields=['entity_type', 'entity_id', 'created_at']),
        ]
    
    def __str__(self):
        return f"StatusLog {self.entity_type} {self.entity_id} - {self.status}"
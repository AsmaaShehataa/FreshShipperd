"""Django management command: clear_data

Deletes seeded and test data from the local development database.
Be careful: this command performs destructive deletes. Run only in
development environments and never on production data.
"""

from django.core.management.base import BaseCommand
from backend.models import User, Warehouse, InternationalBox, Item, Locker


class Command(BaseCommand):
    def handle(self, *args, **options):
        # Clear all data (be careful - this deletes everything!)
        InternationalBox.objects.all().delete()
        Item.objects.all().delete() 
        Locker.objects.all().delete()
        User.objects.exclude(username='admin').delete()
        Warehouse.objects.all().delete()
        
        self.stdout.write(self.style.SUCCESS('Cleared all data!'))

"""backend.views.api_views

API endpoints implemented with Django REST Framework. These views
return JSON responses and are intended to be wired behind the app
`urls.py` (see `backend/urls.py`). Prefer viewsets and routers for
larger APIs; function-based views are used here for simplicity.
"""

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import BasePermission
from rest_framework.response import Response
from backend.models import InternationalBox, Item, User
from backend.models.enums import BoxStatus, UserRole
from backend.serializers import InternationalBoxSerializer, CustomerSerializer
from backend.views.auth_views import IsAdminOrSuperAdmin


# Django URL life cycle:
# 1. Browser Request → http://localhost:8000/api/boxes/
# 2. Django URL Router → matches pattern in urls.py
# 3. Django View → processes request, queries database
# 4. Django Response → returns JSON data

@api_view(['GET'])
def dashboard_stats(request):
    stats = {
        'total_boxes': InternationalBox.objects.count(),
        'boxes_in_transit': InternationalBox.objects.filter(status=BoxStatus.IN_TRANSIT).count(),
        'total_customers': User.objects.filter(role=UserRole.CUSTOMER).count(),
    }
    return Response(stats)

@api_view(['GET'])
def international_boxes(request):
    boxes = InternationalBox.objects.select_related('warehouse').all()
    serializer = InternationalBoxSerializer(boxes, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def customers_list(request):
    customers = User.objects.filter(role=UserRole.CUSTOMER).prefetch_related('locker_set')
    serializer = CustomerSerializer(customers, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def items_list(request):
    items = Item.objects.select_related('customer', 'international_box').all()
    from backend.serializers import ItemSerializer  # Add import
    serializer = ItemSerializer(items, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def statistics_view(request):
    # This view is currently not in use.
    pass
    return Response({"message": "Statistics view is under construction."})
  
@api_view(['GET'])
def notifications_view(request):
    # This view is currently not in use.
    pass
    return Response({"message": "Notifications view is under construction."})

@api_view(['GET'])
@permission_classes([IsAdminOrSuperAdmin])
def admin_only_endpoint(request):
    return Response({"message": "Hello, Admin or Super Admin!"})
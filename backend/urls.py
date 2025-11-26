"""backend.urls

App URL configuration for the `backend` Django app. Routes most API-style
endpoints into `backend.views.api_views` where view logic is implemented.

Add new routes here and include this module from the project `urls.py`.
"""

from django.urls import path
from .views import api_views

urlpatterns = [
    path('api/stats/', api_views.dashboard_stats, name='api_stats'),
    path('api/boxes/', api_views.international_boxes, name='api_boxes'),
    path('api/items/', api_views.items_list, name='api_items'),
    path('api/customers/', api_views.customers_list, name='api_customers'),
]
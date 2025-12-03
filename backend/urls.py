"""backend.urls

App URL configuration for the `backend` Django app. Routes most API-style
endpoints into `backend.views.api_views` where view logic is implemented.

Add new routes here and include this module from the project `urls.py`.
"""

from django.urls import path
from .views import api_views, auth_views

urlpatterns = [
    #Auth Endpoints
    # Auth Endpoints - all under /api/auth/
    path('api/auth/login/', auth_views.login_view, name='login'),
    path('api/auth/logout/', auth_views.logout_view, name='logout'),
    path('api/auth/profile/', auth_views.user_profile, name='user-profile'),
    path('api/auth/settings/', auth_views.user_settings, name='user-settings'),
    path('api/auth/refresh/', auth_views.refresh_token_view, name='refresh_token'),
    path('api/auth/me/', auth_views.current_user, name='current_user'),

    #path('api/admin/', api_views.admins_list, name='api_admins'),
    path('api/stats/', api_views.dashboard_stats, name='api_stats'),
    path('api/boxes/', api_views.international_boxes, name='api_boxes'),
    path('api/items/', api_views.items_list, name='api_items'),
    path('api/customers/', api_views.customers_list, name='api_customers'),
]
"""backend.views.auth_views

Authentication and authorization endpoints for the Shipperd API.
Handles login, logout, token management, and user session operations.
"""

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import BasePermission
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import get_user_model, authenticate
from backend.serializers import UserProfileSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

User = get_user_model()


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """
    Custom login view that returns user role along with tokens.
    Only allows SUPER_ADMIN, ADMIN, EMPLOYEE roles to login.
    """
    email = request.data.get('email')
    password = request.data.get('password')
    
    if not email or not password:
        return Response(
            {'error': 'Please provide both email and password'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Authenticate user
    user = authenticate(request, username=email, password=password)
    
    if user is None:
        return Response(
            {'error': 'Invalid email or password'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    # Check if user is allowed to access dashboard (not customer)
    if user.role == 'customer':
        return Response(
            {'error': 'Customer accounts cannot access this dashboard'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Generate tokens
    refresh = RefreshToken.for_user(user)
    
    return Response({
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'user': {
            'id': user.id,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'role': user.role,
            'is_super_admin': user.is_super_admin(),
            'is_admin': user.is_admin(),
            'is_employee': user.is_employee(),
        }
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """Logout view - blacklist refresh token"""
    try:
        refresh_token = request.data.get('refresh')
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response(
            {'detail': 'Successfully logged out.'},
            status=status.HTTP_200_OK
        )
    except TokenError:
        return Response(
            {'error': 'Invalid token'},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    """Get current authenticated user information"""
    user = request.user
    return Response({
        'id': user.id,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'role': user.role,
        'is_super_admin': user.is_super_admin(),
        'is_admin': user.is_admin(),
        'is_employee': user.is_employee(),
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def refresh_token_view(request):
    """Refresh access token using refresh token"""
    refresh_token = request.data.get('refresh')
    
    if not refresh_token:
        return Response(
            {'error': 'Refresh token is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        refresh = RefreshToken(refresh_token)
        user_id = refresh.payload.get('user_id')
        user = User.objects.get(id=user_id)
        
        # Generate new access token
        new_access_token = str(refresh.access_token)
        
        return Response({
            'access': new_access_token,
            'user': {
                'id': user.id,
                'email': user.email,
                'role': user.role,
            }
        })
    except TokenError:
        return Response(
            {'error': 'Invalid or expired refresh token'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    except User.DoesNotExist:
        return Response(
            {'error': 'User not found'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    """Get or update user profile"""
    if request.method == 'GET':
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def user_settings(request):
    """Get or update user settings"""
    if request.method == 'GET':
        # Return current user's settings
        user = request.user
        return Response({
            'email_notifications': getattr(user, 'email_notifications', True),
            'sms_notifications': getattr(user, 'sms_notifications', False),
            'timezone': getattr(user, 'timezone', 'UTC'),
        })
    
    elif request.method == 'PUT':
        # Update user settings
        user = request.user
        data = request.data
        
        # Update settings fields if they exist on your User model
        # You may need to add these fields to your User model first
        if 'email_notifications' in data:
            user.email_notifications = data['email_notifications']
        if 'sms_notifications' in data:
            user.sms_notifications = data['sms_notifications']
        if 'timezone' in data:
            user.timezone = data['timezone']
        
        user.save()
        return Response({
            'message': 'Settings updated successfully',
            'email_notifications': getattr(user, 'email_notifications', True),
            'sms_notifications': getattr(user, 'sms_notifications', False),
            'timezone': getattr(user, 'timezone', 'UTC'),
        })
        

    # Custom permission class ModelListView(ListView)
class IsSuperAdmin(BasePermission):
    """Allows access only to super admin users."""
    def has_permission(self, request, view):
        return request.user and request.user.is_super_admin()   
class IsAdmin(BasePermission):
    """Allows access only to admin users."""
    def has_permission(self, request, view):
        return request.user and request.user.is_admin()

class IsEmployee(BasePermission):
    """Allows access only to employee users."""
    def has_permission(self, request, view):
        return request.user and request.user.is_employee()

class IsAdminOrSuperAdmin(BasePermission):
    """Allows access to admin or super admin users."""
    def has_permission(self, request, view):
        return request.user and (request.user.is_admin() or request.user.is_super_admin())


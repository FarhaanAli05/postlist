from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

@api_view(['POST'])
def login_user(request):
    username_or_email = request.data.get('username')
    password = request.data.get('password')

    if not username_or_email or not password:
        return Response({'error': 'Username/email and password are required.'})
    
    user_obj = (
        User.objects.filter(username=username_or_email).first() or
        User.objects.filter(email=username_or_email).first()
    )

    user = authenticate(username=user_obj.username, password=password) if user_obj else None

    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            "message": "Login successful",
            'access': str(refresh.access_token),
            'refresh': str(refresh)
        }, status=status.HTTP_200_OK)
    else:
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
def register_user(request):
    username = request.data['username']
    password = request.data['password']
    email = request.data.get('email', '')

    if not username or not password:
        return Response({'error': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)
    
    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
    elif email and User.objects.filter(email=email).exists():
        return Response({'error': 'Email already in use'}, status=status.HTTP_400_BAD_REQUEST)

    User.objects.create(
        username=username,
        email=email,
        password=make_password(password)
    )

    return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
def get_user(request):
    username_or_email = request.data.get('username')

    user_obj = User.objects.filter(username=username_or_email).first()

    if not user_obj:
        user_obj = User.objects.filter(email=username_or_email).first()
    if user_obj:
        return Response({
            'username': user_obj.username,
            'email': user_obj.email
        }, status=status.HTTP_200_OK)
    else:
        return None
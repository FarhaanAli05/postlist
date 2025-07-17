from django.core.files.storage import default_storage
from django.conf import settings
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Task, BlogPost
from .services import get_tasks
from .serializers import BlogPostSerializer

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def get_or_add_task(request):
    if request.method == 'GET':
        return get_tasks(request)
    elif request.method == 'POST':
        text = request.data.get('text')
        finished = request.data.get('finished', 'incomplete')
        description = request.data.get('description', '')
        quantity = request.data.get('quantity', 0)
        Task.objects.create(
            user=request.user,
            text=text,
            finished=finished,
            description=description,
            quantity=quantity
        )
        return get_tasks(request)

@api_view(['POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def finish_or_delete_task(request, index):
    if request.method == 'POST':
        user_tasks = Task.objects.filter(user=request.user)
        tasks_ordered = user_tasks.order_by('id') # Because, this is a small application, I am ordering by ID. Generally, it is preferred to identify row in table using primary key.
        matching_task = tasks_ordered[index]
        matching_task_dict = matching_task.__dict__
        if matching_task_dict['finished'] == 'complete':
            matching_task_dict['finished'] = 'incomplete'
        elif matching_task_dict['finished'] == 'incomplete':
            matching_task_dict['finished'] = 'complete'
        for key, value in matching_task_dict.items():
            setattr(matching_task, key, value)
        matching_task.save(update_fields=['finished'])
        return get_tasks(request)
    elif request.method == 'DELETE':
        user_tasks = Task.objects.filter(user=request.user)
        tasks_ordered = user_tasks.order_by('id')
        matching_task = tasks_ordered[index]
        matching_task.delete()
        return get_tasks(request)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def edit_task(request, index):
    user_tasks = Task.objects.filter(user=request.user)
    tasks_ordered = user_tasks.order_by('id')
    matching_task = tasks_ordered[index]
    newText = request.data.get('text')
    newDesc = request.data.get('description', '')
    newQty = request.data.get('quantity')
    matching_task_dict = matching_task.__dict__
    matching_task_dict['text'] = newText
    matching_task_dict['description'] = newDesc
    matching_task_dict['quantity'] = newQty
    for key, value in matching_task_dict.items():
        setattr(matching_task, key, value)
    matching_task.save(update_fields=['text', 'description', 'quantity'])
    return get_tasks(request)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def get_or_create_post(request):
    if request.method == 'GET':
        posts = BlogPost.objects.all()
        serializer = BlogPostSerializer(posts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    elif request.method == 'POST':
        title = request.data.get('title')
        author = request.data.get('author')
        summary = request.data.get('summary')
        content = request.data.get('content')
        file = request.FILES.get('file')
        filename = ''
        if file:
            filename = default_storage.save(file.name, file)
        else:
            filename = 'gray.png'
        BlogPost.objects.create(
            title=title,
            author=author,
            summary=summary,
            content=content,
            file=filename
        )
        return Response({'message': 'Blog post successfuly created!'}, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_post(request, index):
    matching_post = BlogPost.objects.get(pk=index)
    serializer = BlogPostSerializer(matching_post)
    return Response(serializer.data, status=status.HTTP_200_OK)

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
    elif len(password) < 8:
        return Response({'error': 'Password cannot be less than 8 characters'}, status=status.HTTP_400_BAD_REQUEST)

    User.objects.create(
        username=username,
        email=email,
        password=make_password(password)
    )

    user_obj = (
        User.objects.filter(username=username).first() or
        User.objects.filter(email=email).first()
    )

    user = authenticate(username=user_obj.username, password=password) if user_obj else None

    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            'message': 'User created successfully',
            'access': str(refresh.access_token),
            'refresh': str(refresh)
        }, status=status.HTTP_201_CREATED)
    else:
        return Response({'error': 'Could not create user'})

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
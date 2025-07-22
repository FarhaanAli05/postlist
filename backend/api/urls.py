from django.urls import path
from .views import login_user, register_user, get_user, get_or_add_task, finish_or_delete_task, edit_task, get_or_create_post, blog_post_detail
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView
)

urlpatterns = [
    path('tasks/', get_or_add_task, name=('get_or_add_task')),
    path('tasks/<int:index>/', finish_or_delete_task, name=('finish_or_delete_task')),
    path('tasks/edit/<int:index>/', edit_task, name=('edit_task')),
    path('register/', register_user, name='register'),
    path('login/', login_user, name=('login')),
    path('getuser/', get_user, name=('get_user')),
    path('post/', get_or_create_post, name=('get_or_create_post')),
    path('post/<int:index>/', blog_post_detail, name=('get_or_delete_post')),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
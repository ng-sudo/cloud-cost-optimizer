from django.urls import path
from .views import register, profile, LoginView

urlpatterns = [
    path('register/', register, name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/', profile, name='profile'),
]
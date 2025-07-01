from django.urls import path
from .views import index, register_view, login_view, logout_view, verify_view


urlpatterns = [
    path("", index, name="index"),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('register/', register_view, name='register'),
    path('verify/', verify_view, name='verify'),
]

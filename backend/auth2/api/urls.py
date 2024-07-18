from django.urls import path  # type: ignore
from . import views
from rest_framework_simplejwt.views import (

    TokenRefreshView,
)

from .views import MyTokenObtainPairView, RegisterView, get_data, get_specific_data, test_method

urlpatterns = [
    path('', views.getRoutes),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view()),
    path('prob/', get_data, name='problm-detas'),
    path('probdet/<int:id>/', get_specific_data),
    path('code/', test_method)
]

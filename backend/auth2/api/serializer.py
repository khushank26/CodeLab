
from ..models import CustomUser, Profile, ProblemDetail, Problems
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from django.contrib.auth.hashers import make_password


class CustomUserSerializers(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email']


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['full_name'] = user.profile.full_name
        token['college'] = user.profile.college
        token['username'] = user.username
        token['email'] = user.email
        # ...

        return token


class RegisterSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password', 'confirm_password']

    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    confirm_password = serializers.CharField(write_only=True, required=True)

    def validate(self, fields):
        if fields['password'] != fields['confirm_password']:
            raise serializers.ValidationError("Password fields does not match")
        return fields

    def create(self, fields):
        user = CustomUser.objects.create(
            username=fields['username'],
            email=fields['email'],

        )
        user.set_password((fields['password']))
        user.save()

        return user

            
# class ProblemSerializer(serializers.Serializer):
#     class Meta:
#         model = Problems
#         fields = ['problem_title']
#     def create(self, fields):
#         index = Problems.objects.create

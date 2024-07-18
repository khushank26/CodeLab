from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save


class CustomUser(AbstractUser):
    username = models.CharField(max_length=100, unique=True)
    email = models.EmailField(max_length=100)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    def __str__(self):
        return self.username

# This line creates a one-to-one relationship between the Profile model and the CustomUser model. Each Profile instance is linked to a single CustomUser instance, and each CustomUser instance can have only one Profile.


class Profile(models.Model):

    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=100)
    college = models.CharField(max_length=100)

    def __str__(self):
        return self.user.username


def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)


def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()


post_save.connect(create_user_profile, sender=CustomUser)
post_save.connect(save_user_profile, sender=CustomUser)


class Problems(models.Model):
    problem_title = models.TextField(max_length=300)

    def __str__(self):
        return self.problem_title


class ProblemDetail(models.Model):
    problem = models.OneToOneField(Problems, on_delete=models.CASCADE)
    
    problem_description = models.TextField(max_length=10000)

    difficulty = models.CharField(max_length=10)
    testcases = models.TextField(max_length=3000)
    solution = models.TextField(max_length=3000)

    def __str__(self):
        return self.problem.problem_title


def create_problem_detail(sender, instance, created, **kwargs):
    if created:
        ProblemDetail.objects.create(problem=instance)


def save_problem_detail(sender, instance, **kwargs):
    pass
    instance.problemdetail.save()


post_save.connect(create_problem_detail, sender=Problems)
post_save.connect(save_problem_detail, sender=Problems)
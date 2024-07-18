from django.contrib import admin
from auth2.models import CustomUser, Profile, ProblemDetail, Problems
# Register your models here.


class CustomUserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email']


class ProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'full_name', 'college']
    list_editable = ['full_name','college']


class ProblemsAdmin(admin.ModelAdmin):
    list_display = ['id', 'problem_title']
    list_editable = ['problem_title']


class ProblemDetailAdmin(admin.ModelAdmin):
    list_display = ['problem', 'problem_description',
                    'difficulty', 'testcases', 'solution']
    list_editable = ['problem_description',
                     'difficulty', 'testcases', 'solution']


admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Profile, ProfileAdmin)
admin.site.register(Problems, ProblemsAdmin)
admin.site.register(ProblemDetail, ProblemDetailAdmin)

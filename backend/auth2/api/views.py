from rest_framework.response import Response
from django.http import JsonResponse
from django.shortcuts import render
from ..models import CustomUser, Profile, ProblemDetail, Problems
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializer import CustomUserSerializers, RegisterSerializer, MyTokenObtainPairSerializer
from rest_framework.decorators import api_view
from rest_framework import generics
from rest_framework.permissions import AllowAny

from rest_framework import status
from datetime import datetime
import uuid
import os
import subprocess


class MyTokenObtainPairView(TokenObtainPairView):   
    serializer_class = MyTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer


@api_view(['GET'])
def getRoutes(request):
    routes = {
        '/api/token',
        '/api/token/refresh'
    }
    return Response(routes)


@api_view(['GET'])
def get_data(request):
    all_problems = ProblemDetail.objects.all().values()
    for i in all_problems:
        i['title'] = (str(Problems.objects.get(id=i['problem_id'])))

    return Response(all_problems)


@api_view(['GET'])
def get_specific_data(request, id):

    queryset = ProblemDetail.objects.values().get(problem_id=id)

    queryset['title'] = str(Problems.objects.get(id=id))

    return Response(queryset)


@api_view(['POST'])
def test_method(request):
    lang = request.data["language"]
    id = request.data["id"]
    code = request.data["code"]
    if lang not in ["cpp", "python"]:
        return Response(
            {"error": "Invalid language", status: status.HTTP_400_BAD_REQUEST}
        )

    folder_name = "InputCodes"
    folder_path = os.path.join(os.getcwd(), folder_name)
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)

    uniquename = uuid.uuid4().hex
    unique_filename = f"{uniquename}.{lang}"
    file_path = os.path.join(folder_path, unique_filename)

    # Perform file operations within "InputCodes" folder
    with open(file_path, 'w') as f:
        f.write(code)

    # with open(file_path, "w") as f:
    #     f.write(code)

    queryset = ProblemDetail.objects.values('testcases').filter(problem_id=id)
    sol = ProblemDetail.objects.values('solution').filter(problem_id=id)
    test_case = queryset[0]['testcases']
    solution = sol[0]['solution'].replace('\r\n', '\n')
    # print(test_case)
    if lang == "cpp":
        compile_result = subprocess.run(
            ["g++", os.path.join(folder_path, unique_filename),
             "-o", os.path.join(folder_path, uniquename)],
            capture_output=True
        )

        if compile_result.returncode == 0:
            # Run the compiled program with the test case input
            process = subprocess.Popen(f"echo '{test_case}' | {os.path.join(folder_path, uniquename)}",
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                shell=True,
                text=True
            )
            stdout, stderr = process.communicate()

            if process.returncode == 0:
                # Compare the output with the expected solution
                if stdout.strip() == solution.strip():
                    verdict = "Accepted"
                else:
                    verdict = "Rejected"

                return Response({
                    "verdict": verdict,
                    "result": stdout.strip()
                })
            else:
                # Runtime Error
                return Response({
                    "verdict": "Rejected",
                    "result": f"Runtime Error: {stderr.strip()}"
                })
        else:
            # Compilation Error
            return Response({
                "verdict": "Rejected",
                "result": f"Compilation Error: {compile_result.stderr.decode('utf-8').strip()}"
            })
    else:  # lang == py
        process = subprocess.Popen(f"echo '{test_case}' | python {os.path.join( folder_path, unique_filename)}", shell=True, text=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        stdout, stderr = process.communicate()
        if process.returncode == 0:
            # Compare the output with the expected solution
            save_string_to_file(stdout.strip(), "stdout.txt")
            save_string_to_file(solution.strip(), "solution.txt")
            if stdout.strip() == solution.strip():
                verdict = "Accepted"
            else:
                verdict = "Rejected"

            return Response({
                "verdict": verdict,
                "result": stdout
            })
        else:
            # Runtime Error
            return Response({
                "verdict": "Rejected",
                "result": f"Runtime Error: {stderr.strip()}"
            })


def save_string_to_file(content, file_path):
    """
    Saves the given content to the specified file.

    Parameters:
    - content (str): The string content to be saved to the file.
    - file_path (str): The path of the file where the content will be saved.
    """
    try:
        with open(file_path, 'w') as file:
            file.write(content)
        print(f"String has been saved to {file_path}")
    except IOError as e:
        print(f"Error occurred while saving to {file_path}: {e}")

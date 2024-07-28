FROM python:3.10
EXPOSE 8080
WORKDIR /dockerbackend 
COPY . /dockerbackend
RUN pip3 install -r requirements.txt
ENV DJANGO_SETTINGS_MODULE=codeLab.settings
ENV PYTHONUNBUFFERED=1
CMD ["python3", "manage.py", "runsslserver", "0.0.0.0:8080"]

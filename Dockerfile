FROM python:3.9
WORKDIR /Projekt
ADD . /Projekt
RUN pip install flask
ADD app.py .
EXPOSE 8080
ENTRYPOINT ["python3", "app.py"]

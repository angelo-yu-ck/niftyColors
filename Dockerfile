FROM python:3.5.3

WORKDIR /app/

COPY requirements.txt /app/
RUN pip install -r ./requirements.txt

COPY app.py /app/
COPY *.csv /app/

EXPOSE 3000

ENTRYPOINT python ./app.py
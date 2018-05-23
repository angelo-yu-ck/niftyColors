FROM frolvlad/alpine-python-machinelearning

WORKDIR /app/

COPY requirements.txt /app/
RUN pip install Flask

COPY app.py /app/
COPY *.csv /app/

EXPOSE 3000

ENTRYPOINT python ./app.py
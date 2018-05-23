FROM frolvlad/alpine-python-machinelearning
COPY train.py /src/train.py
COPY *.csv /data/
ENTRYPOINT ["python", "/src/train.py"]
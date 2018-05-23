FROM frolvlad/alpine-python-machinelearning
COPY color.py /src/color.py
COPY train/model.sav /src/model.sav
ENTRYPOINT ["python", "/src/color.py"]

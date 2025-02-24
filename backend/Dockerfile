FROM ubuntu:24.04

ENV username=admin
ENV WORKING_DIR=/home/app
ENV LANG=C.UTF-8
ENV TZ=Europe/Lisbon \
    DEBIAN_FRONTEND=noninteractive

WORKDIR ${WORKING_DIR}

RUN apt-get update && apt-get upgrade -y \
    && apt-get install -y \
    python3.12 \
    python3.12-dev \
    python3-pip \
    python3-dev \
    vim



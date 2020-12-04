FROM ubuntu:latest 
FROM node:11
#RUN apt-get update

RUN apt-get -y install curl wget
RUN apt-get update && \
      apt-get -y install sudo
RUN sudo curl -L https://github.com/docker/compose/releases/download/1.21.2/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
RUN sudo chmod +x /usr/local/bin/docker-compose      
RUN apt-get install -y postgresql-client
RUN curl -fsSL get.docker.com -o get-docker.sh
RUN  chmod +x get-docker.sh
RUN  sudo ./get-docker.sh
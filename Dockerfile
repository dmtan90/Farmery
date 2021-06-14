FROM node:10.0
COPY . /src
WORKDIR /src
RUN npm install
EXPOSE 8080

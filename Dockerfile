FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf

WORKDIR /usr/ampnet-frontend/
COPY dist/ampnet-frontend/ .
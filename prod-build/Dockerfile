FROM nginx

COPY prod-build/nginx.conf /etc/nginx/nginx.conf

WORKDIR /usr/share/nginx/html
COPY dist/ampnet-frontend .

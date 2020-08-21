FROM nginx:1.19.2

COPY prod-build/nginx.conf.template /etc/nginx/templates/nginx.conf.template
ENV NGINX_ENVSUBST_OUTPUT_DIR /etc/nginx

WORKDIR /usr/share/nginx/html
COPY dist/ampnet-frontend .

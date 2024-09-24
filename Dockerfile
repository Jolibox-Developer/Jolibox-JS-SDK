FROM nginx:alpine

WORKDIR /app
COPY ./docs /app/
COPY ./nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
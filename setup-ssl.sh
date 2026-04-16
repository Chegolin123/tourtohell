#!/bin/bash

# Остановка nginx если запущен
docker-compose stop nginx

# Получение сертификата
docker run -it --rm \
  -v $(pwd)/ssl:/etc/letsencrypt \
  -v $(pwd)/certbot/www:/var/www/certbot \
  certbot/certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email your-email@example.com \
  --agree-tos \
  --no-eff-email \
  -d helltour.chickenkiller.com

# Запуск nginx с HTTPS
docker-compose up -d nginx
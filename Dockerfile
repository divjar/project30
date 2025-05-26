FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

# Salin build hasil React
COPY --from=build /app/dist /usr/share/nginx/html

# Salin konfigurasi nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Salin sertifikat SSL
COPY certs/ca-umm.crt /etc/nginx/certs/ca-umm.crt
COPY certs/umm.key /etc/nginx/certs/umm.key

#EXPOSE 80
EXPOSE 443

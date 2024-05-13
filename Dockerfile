FROM node:latest as angular-article-manager
WORKDIR /angular-article-manager
COPY package*.json /angular-article-manager
RUN npm install --silent
COPY . .
RUN npm run build

FROM nginx:alpine
VOLUME /var/cache/nginx
COPY --from=angular-article-manager /angular-article-manager/dist/angular-article-manager/browser /usr/share/nginx/html
COPY ./config/nginx.conf /etc/nginx/conf.d/default.conf

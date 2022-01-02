### STAGE 1: Build ###
FROM node:lts-alpine AS build
WORKDIR /usr/src/app
COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . .
RUN npm set progress=false && npm config set depth 0 && npm cache clean --force
RUN $(npm bin)/ng build

### STAGE 2: Run ###
FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/app/dist/flightbook-instructor-app /usr/share/nginx/html

EXPOSE 80
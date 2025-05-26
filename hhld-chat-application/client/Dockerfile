# for apple m1 chip, docker hub image will not work 
# FROM node:latest

# fix for apple m1 chip
FROM --platform=linux/amd64 node:lts-alpine3.21

WORKDIR /app

COPY . /app

COPY .dockerignore /app/.dockerignore

RUN npm install

RUN npm run build

CMD ["npm", "run", "start"]
FROM node:20.19-bullseye-slim as builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --omit=dev

COPY . .

RUN npm run build:prod

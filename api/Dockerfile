# syntax=docker/dockerfile:1

FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:18-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:18-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app .
RUN rm -rf node_modules && npm ci --omit=dev
EXPOSE 3000
CMD ["npm", "run", "start"]

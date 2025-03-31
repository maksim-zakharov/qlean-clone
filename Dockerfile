FROM node:18-alpine AS builder

WORKDIR /app
COPY server/package*.json ./
RUN npm ci
COPY server/ .
RUN npm run build:ci

FROM node:18-alpine
WORKDIR /app

ARG DATABASE_URL
ARG SHADOW_DATABASE_URL

ENV NODE_ENV production
ENV DATABASE_URL=$DATABASE_URL
ENV SHADOW_DATABASE_URL=$SHADOW_DATABASE_URL
COPY --from=builder /app/package*.json ./
RUN npm ci --production
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/main.js"]
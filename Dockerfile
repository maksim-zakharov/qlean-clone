FROM node:18-alpine AS builder

WORKDIR /app
COPY server/package*.json ./
RUN npm ci
COPY server/ .
RUN npm run build:ci

FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/package*.json ./
RUN npm ci --production
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/main.js"]
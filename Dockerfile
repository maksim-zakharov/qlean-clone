FROM node:18-alpine AS builder

WORKDIR /app
COPY server/package*.json ./
RUN npm ci
COPY server/ .
RUN npm run build:ci

FROM node:18-alpine
WORKDIR /app

RUN npm install pm2 -g;

# Копируем зависимости, Pr-клиент и билд
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
# Копируем схему Prisma
COPY --from=builder /app/prisma ./prisma

ARG DATABASE_URL
ARG SHADOW_DATABASE_URL
ARG PM2_PUBLIC_KEY
ARG PM2_SECRET_KEY

ENV NODE_ENV production
ENV DATABASE_URL=$DATABASE_URL
ENV SHADOW_DATABASE_URL=$SHADOW_DATABASE_URL
ENV PM2_PUBLIC_KEY=${PM2_PUBLIC_KEY}
ENV PM2_SECRET_KEY=${PM2_SECRET_KEY}

RUN npm ci --production

# Генерируем Prisma Client для продакшена
RUN npx prisma generate

CMD ["pm2-runtime", "dist/main.js"]
EXPOSE $PORT

#EXPOSE 3000
#CMD ["node", "dist/main.js"]
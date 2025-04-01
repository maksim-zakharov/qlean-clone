FROM node:18-alpine AS builder

WORKDIR /app
COPY server/package*.json ./
RUN npm ci
COPY server/ .
RUN npm run build:ci

FROM node:18-alpine
WORKDIR /app

RUN #npm install pm2 -g

# Копируем зависимости, Pr-клиент и билд
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/ecosystem.config.js ./
COPY --from=builder /app/dist ./dist
# Копируем схему Prisma
COPY --from=builder /app/prisma ./prisma

ARG DATABASE_URL
ARG SHADOW_DATABASE_URL
ARG PM2_PUBLIC_KEY
ARG PM2_SECRET_KEY

ENV NODE_ENV production
ENV DATABASE_URL={$DATABASE_URL}
ENV SHADOW_DATABASE_URL={$SHADOW_DATABASE_URL}
ENV PM2_PUBLIC_KEY=${PM2_PUBLIC_KEY}
ENV PM2_SECRET_KEY=${PM2_SECRET_KEY}

# Создаем .env файл с переменными
RUN printf "DATABASE_URL=%s\nSHADOW_DATABASE_URL=%s\nPM2_PUBLIC_KEY=%s\nPM2_SECRET_KEY=%s\nNODE_ENV=production\n" \
    "$DATABASE_URL" \
    "$SHADOW_DATABASE_URL" \
    "$PM2_PUBLIC_KEY" \
    "$PM2_SECRET_KEY" > .env

RUN npm ci --production

# Генерируем Prisma Client для продакшена
RUN npx prisma generate

#CMD ["pm2-runtime", "ecosystem.config.js"]
#EXPOSE $PORT

EXPOSE 3000
CMD ["node", "dist/main.js"]
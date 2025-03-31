#!/bin/sh

# Логируем переменные окружения
echo "🔄 Checking environment variables:"
echo "---------------------------------"
echo "DATABASE_URL: ${DATABASE_URL:-NOT_SET}"
echo "SHADOW_DATABASE_URL: ${SHADOW_DATABASE_URL:-NOT_SET}"
echo "---------------------------------"

# Проверка обязательных переменных
if [ -z "$DATABASE_URL" ]; then
  echo "❌ ERROR: DATABASE_URL is not set!"
  exit 1
fi

# Запуск приложения
exec node dist/main.js
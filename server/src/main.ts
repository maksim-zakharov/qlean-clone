import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {PrismaService} from "./prisma.service";

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        cors: true,
    });

    // Проверка подключения к Prisma
    const prisma = app.get(PrismaService);
    await prisma.$connect()
        .then(() => console.log('✅ Подключение к БД успешно'))
        .catch((err) => {
            console.error('❌ Ошибка подключения к БД:', err);
            process.exit(1);
        });

    const PORT = process.env.PORT || 3000;
    await app.listen(PORT, '0.0.0.0');
}

bootstrap();

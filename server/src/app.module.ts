import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {HealthModule} from './health/health.module';
import {PrismaService} from "./prisma.service";
import {AddressesService} from "./addresses/address.service";
import {OrdersService} from './orders/orders.service';
import {ServicesService} from './services/services.service';
import {ServicesController} from './services/services.controller';
import {OrdersController} from './orders/orders.controller';
import {AddressesController} from './addresses/addresses.controller';
import {SpaController} from './spa/spa.controller';
import {CacheModule} from "@nestjs/cache-manager";
import {AuthService} from './auth/auth.service';
import {AuthController} from './auth/auth.controller';
import {UserService} from './user/user.service';
import {PassportModule} from "@nestjs/passport";
import {JwtModule} from "@nestjs/jwt";
import {JwtStrategy} from "./auth/jwt.strategy";
import { Context, session, Telegraf } from 'telegraf';

@Module({
    imports: [HealthModule,
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: {expiresIn: '1d'},
        }),
        CacheModule.register({
            ttl: 3600 * 24, // 24 часа
            max: 1000,
            // store: redisStore,
            // host: 'localhost',
            // port: 6379,
            // Для in-memory кэша:
            store: 'memory'
        })
    ],
    controllers: [ServicesController, OrdersController, AddressesController, AppController, AuthController, SpaController],
    providers: [AppService, PrismaService, AddressesService, OrdersService, ServicesService, AuthService, UserService, JwtStrategy,
        {
            provide: Telegraf,
            useFactory: async () => {
                const bot = new Telegraf<Context>(
                    process.env.TELEGRAM_BOT_TOKEN,
                    {
                        handlerTimeout: Infinity,
                    },
                );

                bot.use(session());
                // bot.use(stage.middleware());

                bot
                    .launch()
                    .catch((e) =>
                        console.error(`Не удалось запустить телеграмм-бота`, e.message),
                    );

                if (bot)
                    bot.telegram
                        .getMe()
                        .then((res) =>
                            console.log(`Bot started on https://t.me/${res.username}`),
                        )
                        .catch((e) =>
                            console.log(`Не удалось запустить телеграмм-бота`, e.message),
                        );

                return bot;
            },
        }
        ],
    exports: [PrismaService]
})
export class AppModule {
    // configure(consumer: MiddlewareConsumer) {
    //     consumer
    //         .apply(TelegramAuthMiddleware)
    //         .forRoutes('api/auth/login');
    // }
}

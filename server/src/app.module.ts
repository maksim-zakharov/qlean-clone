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

@Module({
    imports: [HealthModule,
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
    controllers: [ServicesController, OrdersController, AddressesController, AppController, SpaController],
    providers: [AppService, PrismaService, AddressesService, OrdersService, ServicesService],
    exports: [PrismaService]
})
export class AppModule {
}

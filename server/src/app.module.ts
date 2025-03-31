import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import {PrismaService} from "./prisma.service";
import {AddressesService} from "./address.service";
import { OrdersService } from './orders/orders.service';
import {PrismaHealthIndicator} from "./health/prisma.health";

@Module({
  imports: [HealthModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, AddressesService, OrdersService],
  exports: [PrismaService]
})
export class AppModule {}

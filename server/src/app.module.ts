import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import {PrismaService} from "./prisma.service";
import {AddressesService} from "./address.service";

@Module({
  imports: [HealthModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, AddressesService],
})
export class AppModule {}

import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../user/user.service';
import { ApplicationService } from '../application/application.service';
import { OrdersService } from '../orders/orders.service';
import { ServicesService } from '../services/services.service';
import {
  Address,
  BaseService,
  BonusOperation,
  BonusOperationType,
  ServiceOption,
} from '@prisma/client';

@Controller('/api/admin')
export class AdminController {
  constructor(
    private readonly serviceService: ServicesService,
    private readonly orderService: OrdersService,
    private readonly userService: UserService,
    private readonly applicationService: ApplicationService,
  ) {}

  @Get('variants')
  @UseGuards(AuthGuard('jwt'))
  async getVariants() {
    return this.serviceService.getVariants();
  }

  @Get('services')
  @UseGuards(AuthGuard('jwt'))
  async getServices() {
    return this.serviceService.getAll();
  }

  @Get('services/:id')
  @UseGuards(AuthGuard('jwt'))
  async getServiceById(@Param('id') id: number) {
    return this.serviceService.getVariantById(id);
  }

  @Post('services')
  @UseGuards(AuthGuard('jwt'))
  async addService(
    @Body() service: BaseService & { options: ServiceOption[] },
  ) {
    return this.serviceService.create(service);
  }

  @Get('orders')
  @UseGuards(AuthGuard('jwt'))
  async getOrders() {
    return this.orderService.getOrders();
  }

  @Get('users')
  @UseGuards(AuthGuard('jwt'))
  async getUsers() {
    return this.userService.getUsers();
  }

  @Get('users/:id')
  @UseGuards(AuthGuard('jwt'))
  async getUserById(@Param('id') id: string) {
    return this.userService.getById(id);
  }

  @Get('users/:id/orders')
  @UseGuards(AuthGuard('jwt'))
  async getOrdersByUserId(@Param('id') id: string) {
    return this.orderService.getOrdersByUserId(id);
  }

  @Get('users/:id/bonuses')
  @UseGuards(AuthGuard('jwt'))
  async getBonusOperationsByUserId(@Param('id') id: string) {
    return this.userService.getBonusOperations(id);
  }

  @Post('users/:id/bonuses')
  @UseGuards(AuthGuard('jwt'))
  async addBonus(@Param('id') id: string, @Body() bonus: BonusOperation) {
    bonus.type = BonusOperationType.GIFT;
    bonus.userId = id;
    return this.userService.addBonus(bonus);
  }

  @Get('applications')
  @UseGuards(AuthGuard('jwt'))
  async getApplications() {
    return this.applicationService.getApplications();
  }

  @Get('applications/:id')
  @UseGuards(AuthGuard('jwt'))
  async getApplicationByUserId(@Param('id') userId: string) {
    const application = await this.applicationService.getApplication(userId);
    if (!application) {
      throw new NotFoundException({ message: 'Application not found' });
    }
    return application;
  }

  @Post('applications/:id/approve')
  @UseGuards(AuthGuard('jwt'))
  async approveApplication(@Param('id') id: number) {
    return this.applicationService.approveApplication(id);
  }

  @Post('applications/:id/reject')
  @UseGuards(AuthGuard('jwt'))
  async rejectApplication(@Param('id') id: number) {
    return this.applicationService.rejectApplication(id);
  }
}

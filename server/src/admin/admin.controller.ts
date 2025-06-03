import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../user/user.service';
import { ApplicationService } from '../application/application.service';
import { OrdersService } from '../orders/orders.service';
import { ServicesService } from '../services/services.service';

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

  @Get('applications')
  @UseGuards(AuthGuard('jwt'))
  async getApplications() {
    return this.applicationService.getApplications();
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

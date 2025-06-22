import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Req,
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
  Order,
  ServiceOption,
  ServiceVariant,
} from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { OrderDTO } from '../_dto/orders.dto';
import { ChatService } from '../chat/chat.service';

@Controller('/api/admin')
export class AdminController {
  constructor(
    private readonly serviceService: ServicesService,
    private readonly orderService: OrdersService,
    private readonly userService: UserService,
    private readonly applicationService: ApplicationService,
    private readonly chatService: ChatService,
  ) {}

  @Get('variants')
  @UseGuards(AuthGuard('jwt'))
  async getVariants() {
    return this.serviceService.getVariants();
  }

  @Get('services')
  @UseGuards(AuthGuard('jwt'))
  async getServices() {
    return this.serviceService.getAll(true);
  }

  @Get('services/:id')
  @UseGuards(AuthGuard('jwt'))
  async getServiceById(@Param('id') id: number) {
    return this.serviceService.getById(id);
  }

  @Delete('services/:id')
  softDeleteService(@Param('id') id: number): any {
    return this.serviceService.delete(Number(id));
  }

  @Post('services/:id')
  restoreService(@Param('id') id: number): any {
    return this.serviceService.restore(Number(id));
  }

  @Post('services')
  @UseGuards(AuthGuard('jwt'))
  async addService(
    @Body()
    service: BaseService & { options: ServiceOption[]; variants: any[] },
  ) {
    return this.serviceService.create(service);
  }

  @Put('services/:id')
  @UseGuards(AuthGuard('jwt'))
  async editService(
    @Body()
    service: BaseService & {
      options: any[];
      variants: any[];
    },
  ) {
    return this.serviceService.update(service);
  }

  @Get('orders')
  @UseGuards(AuthGuard('jwt'))
  async getOrders() {
    return this.orderService.getOrders();
  }

  @Get('orders/:id')
  getOrderById(@Param('id') id: number) {
    return this.orderService
      .getAdminById(Number(id))
      .then((o) => plainToInstance(OrderDTO, o));
  }

  @Put('orders/:id')
  editOrder(@Param('id') id: number, @Body() body: Order): any {
    return this.orderService.updateAdmin(body);
  }

  @Patch('orders/:id')
  async patchOrder(@Param('id') id: number, @Body() body: Order) {
    const item = await this.orderService.getAdminById(Number(id));

    Object.assign(item, body);

    return this.orderService.updateAdmin(item);
  }

  @Post('orders/:id/cancel')
  async cancelOrder(@Param('id') id: string) {
    return this.orderService.cancelAdmin(id);
  }

  @Post('orders/:id')
  restoreOrder(@Param('id') id: number): any {
    return this.orderService.restore(Number(id));
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

  @Get('chat')
  async getDialogs() {
    return this.chatService.chats;
  }

  @Get('chat/:id')
  async getDialogById(@Param('id') id: string) {
    const chat = this.chatService.chats.find((c) => c.id.toString() === id);
    return {
      ...chat,
      messages: this.chatService.messages,
    };
  }

  @Post('chat/:id')
  async sendMessage(
    @Param('id') id: string,
    @Body() { message }: { message: string },
  ) {
    return this.chatService.sendMessage(message);
  }
}

import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ScheduleService } from './schedule.service';

@UseGuards(AuthGuard('jwt'))
@Controller('/api/schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get()
  async getSchedule(@Req() req) {
    const schedule = await this.scheduleService.findSchedule(req.user.id);
    if (!schedule) throw new NotFoundException('User schedule not found');
    return schedule;
  }

  @Put()
  async updateSchedule(@Req() req, @Body() updateScheduleDto: any) {
    return this.scheduleService.updateSchedule(req.user.id, updateScheduleDto);
  }

  @Get('available-slots')
  getAvailableSlotsSlots(@Query('date') date: string) {
    return this.scheduleService.getAvailableSlotsSlots(Number(date));
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { DayOfWeek, User } from '@prisma/client';

@Injectable()
export class ScheduleService {
  private parseTime(time: string): Date {
    const [hours, minutes] = time.split(':');
    return new Date(`1970-01-01T${hours}:${minutes}:00`);
  }

  constructor(private prisma: PrismaService) {}
  async findSchedule(userId: User['id']) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        scheduleDays: {
          include: { timeSlots: true },
        },
      },
    });

    if (!user) throw new NotFoundException('User not found');

    return user.scheduleDays.map((day) => ({
      dayOfWeek: day.dayOfWeek,
      isDayOff: day.isDayOff,
      timeSlots: day.timeSlots.map((slot) => ({
        time: slot.time.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      })),
    }));
  }

  async updateSchedule(userId: User['id'], updateScheduleDto: any) {
    return this.prisma.$transaction(async (tx) => {
      // Проверяем существование пользователя
      // const user = await tx.user.findUnique({ where: { id: userId } });
      // if (!user) throw new NotFoundException('User not found');

      // Удаление старых данных
      const existingDays = await tx.scheduleDay.findMany({
        where: { userId },
        select: { id: true },
      });

      if (existingDays.length > 0) {
        await tx.timeSlot.deleteMany({
          where: { scheduleDayId: { in: existingDays.map((d) => d.id) } },
        });
        await tx.scheduleDay.deleteMany({ where: { userId } });
      }

      // Создание нового расписания
      for (const dayDto of updateScheduleDto.days) {
        await tx.scheduleDay.create({
          data: {
            dayOfWeek: dayDto.dayOfWeek,
            isDayOff: dayDto.isDayOff,
            userId,
            timeSlots: {
              create: dayDto.isDayOff
                ? []
                : dayDto.timeSlots.map((slot) => ({
                    time: this.parseTime(slot),
                  })),
            },
          },
        });
      }

      return this.findSchedule(userId);
    });
  }
}

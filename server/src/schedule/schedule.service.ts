import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { DayOfWeek, User } from '@prisma/client';
import * as dayjs from 'dayjs';

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

  async getAvailableSlotsSlots(date: number) {
    const startOfDay = dayjs(date).startOf('day');
    const endOfDay = dayjs(date).endOf('day');
    const dayOfWeek = startOfDay.format('ddd').toUpperCase() as DayOfWeek;

    // Получаем всех исполнителей (пользователей с одобренной заявкой)
    const executors = await this.prisma.user.findMany({
      where: {
        application: {
          status: 'APPROVED',
        },
      },
      include: {
        scheduleDays: {
          where: {
            dayOfWeek,
          },
          include: {
            timeSlots: true,
          },
        },
      },
    });

    // Получаем занятые слоты
    const busyOrders = await this.prisma.order.findMany({
      where: {
        date: {
          gte: startOfDay.toDate(),
          lte: endOfDay.toDate(),
        },
        status: {
          notIn: ['completed', 'canceled'],
        },
      },
      select: {
        date: true,
      },
    });

    // Создаем сет занятых слотов
    const busyTimestamps = new Set(
      busyOrders.map((order) => order.date.getTime()),
    );

    // Фильтруем слоты, оставляя только те, которые:
    // 1. Есть в графике хотя бы у одного исполнителя
    // 2. Не заняты заказами
    const availableSlots = new Set<number>();

    for (const executor of executors) {
      const scheduleDay = executor.scheduleDays[0];

      // Если у исполнителя выходной, пропускаем
      if (!scheduleDay || scheduleDay.isDayOff) continue;

      // Добавляем все слоты из графика исполнителя
      for (const slot of scheduleDay.timeSlots) {
        const slotTime = dayjs(slot.time);
        const timestamp = startOfDay
          .hour(slotTime.hour())
          .minute(slotTime.minute())
          .valueOf();

        // Добавляем слот только если он не занят
        if (!busyTimestamps.has(timestamp)) {
          availableSlots.add(timestamp);
        }
      }
    }

    return Array.from(availableSlots).map((timestamp) => ({ timestamp }));
  }
}

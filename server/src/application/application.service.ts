import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ServiceVariant, User } from '@prisma/client';

@Injectable()
export class ApplicationService {
  constructor(private readonly prisma: PrismaService) {}

  submitApplication(
    executorId: User['id'],
    variantIds: ServiceVariant['id'][],
  ) {
    return this.prisma.$transaction(async (tx) => {
      const application = await tx.application.findUnique({
        where: { userId: executorId },
      });
      if (application) {
        return application;
      }

      return tx.application.create({
        data: {
          user: { connect: { id: executorId } },
          variants: {
            create: variantIds.map((variantId) => ({ variantId })),
          },
        },
      });
    });
  }

  getApplication(executorId: User['id']) {
    return this.prisma.application.findUnique({
      where: { userId: executorId },
    });
  }
}

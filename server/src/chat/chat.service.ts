import { Injectable, NotFoundException } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Context, Telegraf } from 'telegraf';
import { Message } from 'telegraf/typings/core/types/typegram';
import { PrismaService } from '../prisma.service';
import { Chat, MessageFrom, MessageType, User } from '@prisma/client';

@Injectable()
export class ChatService {
  readonly clients = new Map<string, Socket>();

  constructor(
    private readonly bot: Telegraf,
    private prisma: PrismaService,
  ) {}

  addClient(client: Socket) {
    this.clients.set(client.id, client);
  }

  getChats() {
    return this.prisma.chat.findMany({
      include: { messages: true, user: true },
    });
  }

  startChat(id: Chat['id'], userId: User['id']) {
    return this.prisma
      .$transaction(async (tx) => {
        const chat = await tx.chat.findUnique({
          where: {
            id: id,
          },
        });
        if (!chat) {
          throw new NotFoundException({ message: `Chat ${id} not found` });
        }
        chat.isStarted = true;

        return tx.chat.update({
          where: {
            id,
          },
          data: chat,
        });
      })
      .then(async () => {
        const user = await this.prisma.user.findUnique({
          where: {
            id: userId,
          },
          select: {
            firstName: true,
          },
        });
        if (user) {
          const tgMessage = await this.bot.telegram.sendMessage(
            id,
            `${user.firstName} is working on your question`,
          );
          await this.sendMessage(tgMessage, MessageType.SYSTEM);
        }
      });
  }

  closeChat(id: Chat['id'], userId: User['id']) {
    return this.prisma
      .$transaction(async (tx) => {
        const chat = await tx.chat.findUnique({
          where: {
            id: id,
          },
        });
        if (!chat) {
          throw new NotFoundException({ message: `Chat ${id} not found` });
        }
        chat.isStarted = false;

        return tx.chat.update({
          where: {
            id,
          },
          data: chat,
        });
      })
      .then(async () => {
        const user = await this.prisma.user.findUnique({
          where: {
            id: userId,
          },
          select: {
            firstName: true,
          },
        });
        if (user) {
          const tgMessage = await this.bot.telegram.sendMessage(
            id,
            `${user.firstName} left the chat`,
          );
          await this.sendMessage(tgMessage, MessageType.SYSTEM);
        }
      });
  }

  getChatById(id: Chat['id']) {
    return this.prisma.chat.findUnique({
      where: {
        id: id,
      },
      include: {
        messages: true,
        user: true,
      },
    });
  }

  async deleteMessage(chatId: string, id: number) {
    const existChat = await this.prisma.chat.findUnique({
      where: {
        id: chatId,
      },
      include: {
        messages: true,
      },
    });
    if (!existChat) {
      return;
    }
    if (!id) {
      return;
    }

    await this.bot.telegram.deleteMessage(chatId, id);

    await this.prisma.message.delete({
      where: {
        id,
        chatId: existChat.id,
      },
    });

    this.clients.forEach(
      (client) =>
        client?.connected &&
        client.send(JSON.stringify({ type: 'deleteMessage', chatId, id })),
    );
  }

  async sendMessage(
    message: Message.TextMessage,
    type: MessageType = MessageType.TEXT,
  ) {
    const existChat = await this.prisma.chat.findUnique({
      where: {
        id: message.chat.id.toString(),
      },
      include: {
        messages: true,
      },
    });
    if (existChat) {
      let newMessage: any = {
        from: MessageFrom.support,
        text: message.text,
        date: message.date,
        id: message.message_id,
        chatId: existChat.id,
        type,
      };

      newMessage = await this.prisma.message.create({
        data: newMessage,
      });

      this.clients.forEach(
        (client) =>
          client?.connected && client.send(JSON.stringify(newMessage)),
      );
    }
  }

  // `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${fileInfo.file_path}`
  async photoFromTGToAdmin(ctx: Context) {
    // Берём фото максимального качества (последний элемент массива)
    // @ts-ignore
    const photo = ctx.message.photo.pop();

    // Получаем информацию о файле
    const fileInfo = await ctx.telegram.getFile(photo.file_id);

    // Формируем прямую ссылку
    const fileUrl = fileInfo.file_path;

    const message = ctx.message;
    let existChat = await this.prisma.chat.findUnique({
      where: {
        id: message.chat.id.toString(),
      },
      include: {
        messages: true,
      },
    });

    if (!existChat) {
      await this.prisma.$transaction(async (tx) => {
        let user = await tx.user.findUnique({
          where: {
            id: message.chat.id.toString(),
          },
        });

        if (!user) {
          user = await tx.user.create({
            data: {
              id: message.chat.id.toString(),
              firstName: (message.chat as any).first_name,
              lastName: (message.chat as any).last_name,
              photoUrl: (message.chat as any).photo_url,
              phone: (message.chat as any).phone_number,
              username: (message.chat as any).username,
            },
          });
        }

        existChat = await tx.chat.create({
          data: {
            id: message.chat.id.toString(),
            name:
              (message as any).chat.first_name +
              (message as any).chat.last_name,
          },
          include: {
            messages: true,
          },
        });
      });

      await ctx.reply(
        `👋 Добрый день, ${(message as any).chat.first_name} ${(message as any).chat.last_name}! В ближайшее время вам ответит наш оператор и поможет разобраться с любым вопросом.\n` +
          '\n' +
          'Ожидайте, пожалуйста. 💙',
      );
    }

    let newMessage: any = {
      text: fileUrl,
      from:
        message.chat.id === message.from.id
          ? MessageFrom.client
          : MessageFrom.support,
      id: (message as any)?.message_id,
      date: message.date,
      chatId: existChat.id,
      type: MessageType.PHOTO,
    };

    newMessage = await this.prisma.message.create({
      data: newMessage,
    });

    this.clients.forEach(
      (client) => client?.connected && client.send(JSON.stringify(newMessage)),
    );
  }

  async messageFromTGToAdmin(ctx: Context) {
    const message = ctx.message;
    let existChat = await this.prisma.chat.findUnique({
      where: {
        id: message.chat.id.toString(),
      },
      include: {
        messages: true,
      },
    });

    if (!existChat) {
      await this.prisma.$transaction(async (tx) => {
        let user = await tx.user.findUnique({
          where: {
            id: message.chat.id.toString(),
          },
        });

        if (!user) {
          user = await tx.user.create({
            data: {
              id: message.chat.id.toString(),
              firstName: (message.chat as any).first_name,
              lastName: (message.chat as any).last_name,
              photoUrl: (message.chat as any).photo_url,
              phone: (message.chat as any).phone_number,
              username: (message.chat as any).username,
            },
          });
        }

        existChat = await tx.chat.create({
          data: {
            id: message.chat.id.toString(),
            name:
              (message as any).chat.first_name +
              (message as any).chat.last_name,
          },
          include: {
            messages: true,
          },
        });
      });

      await ctx.reply(
        `👋 Добрый день, ${(message as any).chat.first_name} ${(message as any).chat.last_name}! В ближайшее время вам ответит наш оператор и поможет разобраться с любым вопросом.\n` +
          '\n' +
          'Ожидайте, пожалуйста. 💙',
      );
    }

    let newMessage = {
      text: (message as any)?.text,
      from:
        message.chat.id === message.from.id
          ? MessageFrom.client
          : MessageFrom.support,
      id: (message as any)?.message_id,
      date: message.date,
      chatId: existChat.id,
    };

    newMessage = await this.prisma.message.create({
      data: newMessage,
    });

    this.clients.forEach(
      (client) => client?.connected && client.send(JSON.stringify(newMessage)),
    );
  }
}

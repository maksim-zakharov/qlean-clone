import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Context, Telegraf } from 'telegraf';
import { Message } from 'telegraf/typings/core/types/typegram';
import { PrismaService } from '../prisma.service';
import { Chat, MessageFrom } from '@prisma/client';

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
    return this.prisma.chat.findMany({ include: { messages: true } });
  }

  getChatById(id: Chat['id']) {
    return this.prisma.chat.findUnique({
      where: {
        id: id,
      },
      include: {
        messages: true,
      },
    });
  }

  async deleteMessage(chatId: number, id: number) {
    const existChat = await this.prisma.chat.findUnique({
      where: {
        id: Number(chatId),
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

  async sendMessage(message: Message.TextMessage) {
    const existChat = await this.prisma.chat.findUnique({
      where: {
        id: message.chat.id,
      },
      include: {
        messages: true,
      },
    });
    if (existChat) {
      const newMessage = {
        from: MessageFrom.support,
        text: message.text,
        date: message.date,
        id: message.message_id,
        chatId: existChat.id,
      };

      await this.prisma.message.create({
        data: newMessage,
      });

      this.clients.forEach(
        (client) =>
          client?.connected && client.send(JSON.stringify(newMessage)),
      );
    }
  }

  async messageFromTGToAdmin(ctx: Context) {
    const message = ctx.message;
    let existChat = await this.prisma.chat.findUnique({
      where: {
        id: message.chat.id,
        userId: message.chat.id.toString(),
      },
      include: {
        messages: true,
      },
    });
    console.log(existChat);
    if (!existChat) {
      existChat = await this.prisma.chat.create({
        data: {
          id: message.chat.id,
          userId: message.chat.id.toString(),
          name:
            (message as any).chat.first_name + (message as any).chat.last_name,
        },
        include: {
          messages: true,
        },
      });

      await ctx.reply(
        `👋 Добрый день, ${(message as any).chat.first_name} ${(message as any).chat.last_name}! В ближайшее время вам ответит наш оператор и поможет разобраться с любым вопросом.\n` +
          '\n' +
          'Ожидайте, пожалуйста. 💙',
      );
    }

    const newMessage = {
      text: (message as any)?.text,
      from:
        message.chat.id === message.from.id
          ? MessageFrom.client
          : MessageFrom.support,
      id: (message as any)?.message_id,
      date: message.date,
      chatId: existChat.id,
    };

    await this.prisma.message.create({
      data: newMessage,
    });

    this.clients.forEach(
      (client) => client?.connected && client.send(JSON.stringify(newMessage)),
    );
  }
}

import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Context, Telegraf } from 'telegraf';
import { Message } from 'telegraf/typings/core/types/typegram';

@Injectable()
export class ChatService {
  readonly clients = new Map<string, Socket>();

  chats = [];

  constructor(private readonly bot: Telegraf) {}

  addClient(client: Socket) {
    this.clients.set(client.id, client);
  }

  async deleteMessage(chatId: string, id: number) {
    const existChat = this.chats.find((chat) => chat.id.toString() === chatId);
    if (!existChat) {
      return;
    }
    if (!id) {
      return;
    }

    await this.bot.telegram.deleteMessage(chatId, id);

    existChat.messages = existChat.messages.filter(
      (message) => message.id !== id,
    );
    console.log(existChat.messages.length);

    this.clients.forEach(
      (client) =>
        client?.connected &&
        client.send(JSON.stringify({ type: 'deleteMessage', chatId, id })),
    );
  }

  sendMessage(message: Message.TextMessage) {
    const newMessage = {
      from: 'support',
      text: message.text,
      date: message.date,
      id: message.message_id,
    };
    const existChat = this.chats.find(
      (chat) => chat.id.toString() === message.chat.id.toString(),
    );
    if (existChat) {
      existChat.lastMessage = newMessage.text;
      existChat.messages.push(newMessage);
      this.clients.forEach(
        (client) =>
          client?.connected && client.send(JSON.stringify(newMessage)),
      );
    }
  }

  async messageFromTGToAdmin(ctx: Context) {
    const message = ctx.message;
    let existChat = this.chats.find((chat) => chat.id === message.chat.id);
    if (!existChat) {
      existChat = {
        id: message.chat.id,
        date: new Date(),
        name:
          (message as any).chat.first_name + (message as any).chat.last_name,
        lastMessage: (message as any)?.text,
        messages: [],
      };
      this.chats.unshift(existChat);

      await ctx.reply(
        `👋 Добрый день, ${(message as any).chat.first_name} ${(message as any).chat.last_name}! В ближайшее время вам ответит наш оператор и поможет разобраться с любым вопросом.\n` +
          '\n' +
          'Ожидайте, пожалуйста. 💙',
      );
    }
    existChat.lastMessage = (message as any)?.text;
    const newMessage = {
      text: (message as any)?.text,
      from: message.chat.id === message.from.id ? 'client' : 'support',
      id: (message as any)?.message_id,
      date: message.date,
    };
    console.log('messageFromTGToAdmin', message);
    existChat.messages.push(newMessage);

    this.clients.forEach(
      (client) => client?.connected && client.send(JSON.stringify(newMessage)),
    );
  }
}

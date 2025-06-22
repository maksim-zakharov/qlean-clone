import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Context } from 'telegraf';

@Injectable()
export class ChatService {
  readonly clients = new Map<string, Socket>();

  chats = [];

  addClient(client: Socket) {
    this.clients.set(client.id, client);
  }

  sendMessage(chatId: string, message: string) {
    const newMessage = {
      from: 'support',
      text: message,
      createdAt: new Date(),
    };
    const existChat = this.chats.find((chat) => chat.id.toString() === chatId);
    console.log(existChat);
    if (existChat) {
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
    existChat.messages.push({
      text: (message as any)?.text,
      from: message.chat.id === message.from.id ? 'client' : 'support',
      date: message.date,
    });

    this.clients.forEach(
      (client) =>
        client?.connected &&
        client.send(
          JSON.stringify({
            text: (message as any)?.text,
            from: 'client',
            createdAt: new Date(),
          }),
        ),
    );
  }
}

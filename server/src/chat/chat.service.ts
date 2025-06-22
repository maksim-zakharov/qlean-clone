import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class ChatService {
  readonly clients = new Map<string, Socket>();

  chats = [
    {
      id: 1,
      name: 'Максим',
      message: 'Пупупу Пупупу Пупупу Пупупу Пупупу Пупупу Пупупу',
      date: new Date(),
    },
    {
      id: 2,
      name: 'Максим',
      message: 'Пупупу Пупупу Пупупу Пупупу Пупупу Пупупу Пупупу',
      date: new Date(),
    },
    {
      id: 3,
      name: 'Максим',
      message: 'Пупупу Пупупу Пупупу Пупупу Пупупу Пупупу Пупупу',
      date: new Date(),
    },
    {
      id: 4,
      name: 'Максим',
      message: 'Пупупу Пупупу Пупупу Пупупу Пупупу Пупупу Пупупу',
      date: new Date(),
    },
    {
      id: 5,
      name: 'Максим',
      message: 'Пупупу Пупупу Пупупу Пупупу Пупупу Пупупу Пупупу',
      date: new Date(),
    },
    {
      id: 6,
      name: 'Максим',
      message: 'Пупупу Пупупу Пупупу Пупупу Пупупу Пупупу Пупупу',
      date: new Date(),
    },
    {
      id: 7,
      name: 'Максим',
      message: 'Пупупу Пупупу Пупупу Пупупу Пупупу Пупупу Пупупу',
      date: new Date(),
    },
    {
      id: 8,
      name: 'Максим',
      message: 'Пупупу Пупупу Пупупу Пупупу Пупупу Пупупу Пупупу',
      date: new Date(),
    },
    {
      id: 9,
      name: 'Максим',
      message: 'Пупупу Пупупу Пупупу Пупупу Пупупу Пупупу Пупупу',
      date: new Date(),
    },
    {
      id: 10,
      name: 'Максим',
      message: 'Пупупу Пупупу Пупупу Пупупу Пупупу Пупупу Пупупу',
      date: new Date(),
    },
    {
      id: 11,
      name: 'Максим',
      message: 'Пупупу Пупупу Пупупу Пупупу Пупупу Пупупу Пупупу',
      date: new Date(),
    },
    {
      id: 12,
      name: 'Максим',
      message: 'Пупупу Пупупу Пупупу Пупупу Пупупу Пупупу Пупупу',
      date: new Date(),
    },
  ];

  messages = [
    {
      // id: number;
      // chatId: number;
      from: 'client', // | 'support';
      text: 'ПупупупупупуПупупупупупуПупупупупупуПупупупупупуПупупупупупу',
      createdAt: new Date(),
    },
    {
      // id: number;
      // chatId: number;
      from: 'client', // | 'support';
      text: 'ПупупупупупуПупупупупупуПупупупупупуПупупупупупуПупупупупупу',
      createdAt: new Date(),
    },
    {
      // id: number;
      // chatId: number;
      from: 'client', // | 'support';
      text: 'ПупупупупупуПупупупупупуПупупупупупуПупупупупупуПупупупупупу',
      createdAt: new Date(),
    },
    {
      // id: number;
      // chatId: number;
      from: 'client', // | 'support';
      text: 'ПупупупупупуПупупупупупуПупупупупупуПупупупупупуПупупупупупу',
      createdAt: new Date(),
    },
    {
      // id: number;
      // chatId: number;
      from: 'client', // | 'support';
      text: 'ПупупупупупуПупупупупупуПупупупупупуПупупупупупуПупупупупупу',
      createdAt: new Date(),
    },
    {
      // id: number;
      // chatId: number;
      from: 'support', // | 'support';
      text: 'ПупупупупупуПупупупупупуПупупупупупуПупупупупупуПупупупупупу',
      createdAt: new Date(),
    },
    {
      // id: number;
      // chatId: number;
      from: 'support', // | 'support';
      text: 'ПупупупупупуПупупупупупуПупупупупупуПупупупупупуПупупупупупу',
      createdAt: new Date(),
    },
    {
      // id: number;
      // chatId: number;
      from: 'client', // | 'support';
      text: 'ПупупупупупуПупупупупупуПупупупупупуПупупупупупуПупупупупупу',
      createdAt: new Date(),
    },
  ];

  addClient(client: Socket) {
    this.clients.set(client.id, client);
  }

  sendMessage(message: string) {
    const newMessage = {
      from: 'support',
      text: message,
      createdAt: new Date(),
    };
    this.messages.push(newMessage);
    this.clients.forEach(
      (client) => client?.connected && client.send(JSON.stringify(newMessage)),
    );
  }
}

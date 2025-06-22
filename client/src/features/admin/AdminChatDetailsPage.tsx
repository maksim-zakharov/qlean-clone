import React, { useEffect, useRef, useState} from "react";
import {useGetAdminChatDetailsQuery, useSendAdminChatMessageMutation} from "../../api/ordersApi.ts";
import {useNavigate, useParams} from "react-router-dom";
import {cn} from "../../lib/utils.ts";
import {useBackButton} from "../../hooks/useTelegram.tsx";
import {RoutePaths} from "../../routes.ts";
import {Input} from "../../components/ui/input.tsx";
import {BottomActions} from "../../components/BottomActions.tsx";
import {Button} from "../../components/ui/button.tsx";
import {SendHorizontal} from "lucide-react";
import {io, Socket} from "socket.io-client";

export const AdminChatDetailsPage = () => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const navigate = useNavigate();
    useBackButton(() => navigate(RoutePaths.Admin.Chat.List));
    const {id} = useParams<string>();
    const {data: dialog} = useGetAdminChatDetailsQuery({id});

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [messages, setMessages] = useState<any[]>([])
    const [sendMessage, {isLoading}] = useSendAdminChatMessageMutation();

    useEffect(() => {
        setMessages(dialog?.messages || []);
    }, [dialog]);

    useEffect(() => {
        if (socket?.connected) {
            socket.emit('messages', {
                chatId: id
            });
        }
    }, [socket?.connected, id, socket]);

    // Инициализация Socket.IO
    useEffect(() => {
        const newSocket = io('/chat', {
            transports: ['websocket'],
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });
        setSocket(newSocket);

        newSocket.on('connect', () => {
            // setIsConnected(true);
            console.log('Connected to server');
        });

        newSocket.on('message', (data) => {
            const message = JSON.parse(data) as any;
            setMessages(prevState => [...prevState, message]);
        });

        newSocket.on('disconnect', () => {
            // setIsConnected(false);
            console.log('Disconnected from server');
        });

        return () => {
            newSocket.disconnect();
        };
    }, []);

    // Скролл вниз при изменении messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const [message, setMessage] = useState('');

    const handleOnSubmit = async () => {
        // await sendMessage({message});
        socket?.emit('message', {
            chatId: id,
            from: 'support', text: message
        });
        // dialog.messages.push({from: 'support', text: message});
        setMessage('');
    }

    if (!dialog) {
        return null;
    }

    return <div className="relative root-bg-color">
        <div className="p-3 flex-1">
            {messages.map(m => <div
                className={cn("p-1.5 rounded-lg mb-1 text-wrap break-all w-[calc(100vw-60px)] text-tg-theme-text-color truncate", m.from === 'client' ? 'ml-auto bg-tg-theme-button-color rounded-l-2xl' : 'mr-auto card-bg-color rounded-r-2xl')}>{m.text}</div>)}

            <div ref={messagesEndRef} /> {/* Невидимый якорь для скролла */}
        </div>
        <BottomActions className="[padding-bottom:var(--tg-safe-area-inset-bottom)] flex gap-2">
            <Input
                className="border-none rounded-lg text-tg-theme-hint-color h-10 placeholder-[var(--tg-theme-hint-color)] text-center"
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Message"/>
            <Button size="sm" className="border-none h-9 p-2 rounded-lg" variant="primary" disabled={!message}
                    loading={isLoading} onClick={handleOnSubmit}><SendHorizontal/></Button>
        </BottomActions>
    </div>
}
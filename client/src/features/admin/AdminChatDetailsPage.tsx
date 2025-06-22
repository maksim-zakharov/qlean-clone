import React, {useState} from "react";
import {useGetAdminChatDetailsQuery, useSendAdminChatMessageMutation} from "../../api/ordersApi.ts";
import {useNavigate, useParams} from "react-router-dom";
import {cn} from "../../lib/utils.ts";
import {useBackButton} from "../../hooks/useTelegram.tsx";
import {RoutePaths} from "../../routes.ts";
import {Input} from "../../components/ui/input.tsx";
import {BottomActions} from "../../components/BottomActions.tsx";
import {Button} from "../../components/ui/button.tsx";
import {SendHorizontal} from "lucide-react";

export const AdminChatDetailsPage = () => {
    const navigate = useNavigate();
    useBackButton(() => navigate(RoutePaths.Admin.Chat.List));
    const {id} = useParams<string>();
    const {data: dialog} = useGetAdminChatDetailsQuery({id});

    const [sendMessage, {isLoading}] = useSendAdminChatMessageMutation();

    const [message, setMessage] = useState('');

    const handleOnSubmit = async () => {
        await sendMessage({message});
        dialog.messages.push({from: 'support', text: message});
        setMessage('');
    }

    if (!dialog) {
        return null;
    }

    return <div className="relative">
        <div className="p-3 flex-1">
            {dialog.messages.map(m => <div className={cn("p-1.5 rounded-xl mb-1 text-wrap break-all w-[calc(100vw-60px)] text-tg-theme-text-color truncate", m.from === 'client' ? 'ml-auto bg-tg-theme-button-color' : 'mr-auto card-bg-color')}>{m.text}</div>)}
        </div>
        <BottomActions className="[padding-bottom:var(--tg-safe-area-inset-bottom)] flex gap-2">
            <Input
                className="border-none rounded-lg text-tg-theme-hint-color h-10 placeholder-[var(--tg-theme-hint-color)] text-center"
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Message"/>
            <Button size="sm" className="border-none h-9 p-2 rounded-lg" variant="primary" disabled={!message} loading={isLoading} onClick={handleOnSubmit}><SendHorizontal /></Button>
        </BottomActions>
    </div>
}
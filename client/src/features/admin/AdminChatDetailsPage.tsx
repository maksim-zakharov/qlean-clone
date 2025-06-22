import React from "react";
import {useGetAdminChatDetailsQuery} from "../../api/ordersApi.ts";
import { useParams} from "react-router-dom";
import {cn} from "../../lib/utils.ts";

export const AdminChatDetailsPage = () => {
    const {id} = useParams<string>();
    const {data: dialog} = useGetAdminChatDetailsQuery({id});

    if (!dialog) {
        return null;
    }

    return <>
        <div className="p-3">
            {dialog.messages.map(m => <div className={cn("p-1.5 rounded-xl mb-1 text-wrap break-all w-[calc(100vw-60px)] text-tg-theme-text-color truncate", m.from === 'client' ? 'justify-self-end bg-tg-theme-button-color' : 'justify-self-start card-bg-color')}>{m.text}</div>)}
        </div>
    </>
}
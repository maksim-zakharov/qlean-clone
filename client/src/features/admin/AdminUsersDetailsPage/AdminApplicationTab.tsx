import {Button} from "../../../components/ui/button.tsx";
import {ProfileApplicationCard} from "../../../components/ProfileApplicationCard.tsx";
import React from "react";
import {useApproveApplicationMutation, useRejectApplicationMutation} from "../../../api/ordersApi.ts";
import {toast} from "sonner";
import {CalendarCheck} from "lucide-react";

export const AdminApplicationTab = ({application}) => {

    const [approve, {isLoading: isLoadingApprove}] = useApproveApplicationMutation();
    const [reject, {isLoading: isLoadingReject}] = useRejectApplicationMutation();

    const handleApproveClick = async () => {
        Telegram.WebApp.showPopup({
            title: `Согласование заявки`,
            message: 'Вы уверены что хотите согласовать заявку?',
            buttons: [{
                id: 'ok',
                text: 'Согласовать',
                type: 'default'
            },{
                id: 'cancel',
                text: 'Cancel',
                type: 'destructive'
            }]
        }, id => id === 'ok' && (async () => {

            await approve(application).unwrap();

            toast('Application is approved', {
                classNames: {
                    icon: 'mr-2 h-5 w-5 text-[var(--chart-2)]'
                },
                icon: <CalendarCheck className="h-5 w-5 text-[var(--chart-2)]"/>
            })
        })())
    }

    const handleRejectClick = async () => {
        Telegram.WebApp.showPopup({
            title: `Отклонение заявки`,
            message: 'Вы уверены что хотите отклонить заявку?',
            buttons: [{
                id: 'ok',
                text: 'Отклонить',
                type: 'destructive'
            },{
                id: 'cancel',
                text: 'Cancel',
                type: 'default'
            }]
        }, id => id === 'ok' && (async () => {

            await reject(application).unwrap();

            toast('Application is rejected', {
                classNames: {
                    icon: 'mr-2 h-5 w-5 text-[var(--chart-2)]'
                },
                icon: <CalendarCheck className="h-5 w-5 text-[var(--chart-2)]"/>
            })
        })())
    }

    return <>
        {application?.status !== 'REJECTED' &&
            <div
                className="flex gap-2 p-4 [min-height:calc(58px+var(--tg-safe-area-inset-bottom))] [padding-bottom:var(--tg-safe-area-inset-bottom)]">
                <Button
                    wide
                    size="lg"
                    onClick={handleApproveClick}
                    loading={isLoadingApprove}
                >
                    Approve
                </Button>
                <Button
                    wide
                    size="lg"
                    className="border-none"
                    variant="default"
                    onClick={handleRejectClick}
                    loading={isLoadingReject}
                >
                    Reject
                </Button>
            </div>
        }

        <div className="px-4">
            <ProfileApplicationCard application={application}/>
        </div>
    </>
}
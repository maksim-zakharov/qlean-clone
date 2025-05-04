import {useNavigate, useParams} from "react-router-dom";
import {useCompleteOrderMutation, useGetOrderByIdQuery, useProcessedOrderMutation} from "../../api/ordersApi.ts";
import React, {useMemo, useState} from "react";
import {Button} from "../../components/ui/button.tsx";
import {BottomActions} from "../../components/BottomActions.tsx";
import {Header} from "../../components/ui/Header.tsx";
import {BackButton} from "../../components/BackButton.tsx";
import {RoutePaths} from "../../routes.ts";
import {Typography} from "@/components/ui/Typography.tsx";
import {ListButton, ListButtonGroup} from "../../components/ListButton/ListButton.tsx";
import {Checkbox} from "../../components/ui/checkbox.tsx";
import {useTelegram} from "../../hooks/useTelegram.ts";
import {AlertDialogWrapper} from "../../components/AlertDialogWrapper.tsx";
import {toast} from "sonner";
import {CalendarCheck} from "lucide-react";
import {PageLoader} from "../../components/PageLoader.tsx";
import {useTranslation} from "react-i18next";

export const ExecutorOrderDetailsPage = () => {
    const {t} = useTranslation();
    const navigate = useNavigate()
    const [completeOrder, {isLoading: completeOrderLoading}] = useCompleteOrderMutation();
    const [processedOrder, {isLoading: processedOrderLoading}] = useProcessedOrderMutation();
    const [orderToDelete, setOrderToDelete] = useState<any | null>(null);
    const {id} = useParams<string>();
    const {vibro} = useTelegram();
    const {data: order, isLoading} = useGetOrderByIdQuery({id: id!});
    const [variantIds, setVariantIds] = useState<any>([]);
    const selectedOptionsIdSet = useMemo(() => new Set(variantIds), [variantIds]);

    const handleFinishOrder = async (order) => {
        await completeOrder(order).unwrap();
        setOrderToDelete(undefined);
        toast(t('orders_notification_complete'), {
            classNames: {
                icon: 'mr-2 h-5 w-5 text-[var(--chart-2)]'
            },
            icon: <CalendarCheck className="h-5 w-5 text-[var(--chart-2)]"/>
        })
        navigate(RoutePaths.Executor.Orders)
    }

    const handleOptionToggle = (option: any) => {
        vibro('light');
        const exist = variantIds.find(opt => opt === option.id);
        let newOptions = [...variantIds];
        if (exist) {
            newOptions = newOptions.filter(opt => opt !== option.id);
        } else {
            newOptions.push(option.id)
        }
        setVariantIds(newOptions);
    }

    const canFinalized = useMemo(() => (order?.options || []).every(op => selectedOptionsIdSet.has(op.id)) && selectedOptionsIdSet.has(order?.serviceVariant?.id), [selectedOptionsIdSet, order?.options, order?.serviceVariant?.id])

    const canStart = useMemo(() => {
      if (!order) return false;
      const orderDate = new Date(order.date);
      const today = new Date();
      return order?.status === 'todo' && 
        orderDate.getDate() === today.getDate() &&
        orderDate.getMonth() === today.getMonth() &&
        orderDate.getFullYear() === today.getFullYear();
    }, [order]);

    if (isLoading) {
        return <PageLoader/>
    }

    return <>
        <Header>
            <BackButton url={RoutePaths.Executor.Orders}/>
        </Header>
        <div className="content px-4">
            <Typography.H2 className="text-3xl mb-0">{order?.baseService?.name}</Typography.H2>
            <Typography.Description
                className="text-base block mb-6">{order?.serviceVariant?.name}</Typography.Description>

            {/*<div>{order?.serviceVariant?.duration}</div>*/}
            {/*<div>{order?.date}</div>*/}
            {/*<div>{order?.fullAddress}</div>*/}

            <Typography.H2 className="mb-2">{t('executor_order_details_title')}</Typography.H2>
            <ListButtonGroup>
                <ListButton key={order?.serviceVariant?.id} text={order?.serviceVariant?.name} extra={
                    order?.status === 'processed' &&
                    <Checkbox checked={selectedOptionsIdSet.has(order?.serviceVariant?.id)}
                              onCheckedChange={() => handleOptionToggle(order?.serviceVariant)}/>}>{order?.serviceVariant?.name} {order?.serviceVariant?.duration}</ListButton>
                {order?.options.map(op => <ListButton key={op?.id} text={op?.name} extra={
                    order?.status === 'processed' && <Checkbox checked={selectedOptionsIdSet.has(op.id)}
                                                               onCheckedChange={() => handleOptionToggle(op)}/>}>{op?.name} {op?.duration}</ListButton>)}
            </ListButtonGroup>

            {(order?.status === 'processed' || canStart) && <BottomActions className="[padding-bottom:var(--tg-safe-area-inset-bottom)]">
                {canStart && <Button wide loading={processedOrderLoading}
                                                     onClick={() => processedOrder(order).unwrap()}>{t('executor_order_apply_btn')}</Button>}
                {order?.status === 'processed' &&
                    <Button disabled={!canFinalized} onClick={() => setOrderToDelete(order)} wide>{t('executor_order_complete_btn')}</Button>}
            </BottomActions>}
        </div>
        <AlertDialogWrapper open={Boolean(orderToDelete)} title={t('finalize_order_modal_title')}
                            description={t('finalize_order_modal_description')}
                            onOkText={t('finalize_order_modal_ok_btn')}
                            onCancelText={t('finalize_order_modal_cancel_btn')}
                            okLoading={completeOrderLoading}
                            onCancelClick={() => setOrderToDelete(undefined)}
                            onOkClick={() => handleFinishOrder(orderToDelete)}></AlertDialogWrapper>
    </>
}
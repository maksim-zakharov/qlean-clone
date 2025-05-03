import {useNavigate, useParams} from "react-router-dom";
import {useCompleteOrderMutation, useGetOrderByIdQuery, useProcessedOrderMutation} from "../../api.ts";
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

export const ExecutorOrderDetailsPage = () => {
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
        toast("Order completed", {
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

            <Typography.H2 className="mb-2">What you have to do:</Typography.H2>
            <ListButtonGroup>
                <ListButton key={order?.serviceVariant?.id} text={order?.serviceVariant?.name} extra={
                    order?.status === 'processed' &&
                    <Checkbox checked={selectedOptionsIdSet.has(order?.serviceVariant?.id)}
                              onCheckedChange={() => handleOptionToggle(order?.serviceVariant)}/>}>{order?.serviceVariant?.name} {order?.serviceVariant?.duration}</ListButton>
                {order?.options.map(op => <ListButton key={op?.id} text={op?.name} extra={
                    order?.status === 'processed' && <Checkbox checked={selectedOptionsIdSet.has(op.id)}
                                                               onCheckedChange={() => handleOptionToggle(op)}/>}>{op?.name} {op?.duration}</ListButton>)}
            </ListButtonGroup>

            {(order?.status === 'processed' || canStart) && <BottomActions>
                {canStart && <Button wide loading={processedOrderLoading}
                                                     onClick={() => processedOrder(order).unwrap()}>Start</Button>}
                {order?.status === 'processed' &&
                    <Button disabled={!canFinalized} onClick={() => setOrderToDelete(order)} wide>Finalize</Button>}
            </BottomActions>}
        </div>
        <AlertDialogWrapper open={Boolean(orderToDelete)} title="Finalize order"
                            description="Are you sure you want to finalize your order?"
                            onOkText="Yes"
                            onCancelText="No"
                            okLoading={completeOrderLoading}
                            onCancelClick={() => setOrderToDelete(undefined)}
                            onOkClick={() => handleFinishOrder(orderToDelete)}></AlertDialogWrapper>
    </>
}
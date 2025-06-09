import {Typography} from "../../components/ui/Typography.tsx";
import React, {FC} from "react";
import {useNavigate, useParams} from "react-router-dom";
import { useDeleteAdminServiceByIdMutation,
    useGetAdminServicesByIdQuery
} from "../../api/ordersApi.ts";
import {Button} from "../../components/ui/button.tsx";
import {Card} from "../../components/ui/card.tsx";
import {BottomActions} from "../../components/BottomActions.tsx";
import {Skeleton} from "../../components/ui/skeleton.tsx";
import {selectBaseService} from "../../slices/createOrderSlice.ts";
import {useDispatch} from "react-redux";
import {RoutePaths} from "../../routes.ts";
import {useTranslation} from "react-i18next";
import {ErrorState} from "../../components/ErrorState.tsx";
import {useBackButton} from "../../hooks/useTelegram.tsx";
import {moneyFormat} from "../../lib/utils.ts";
import {formatDuration} from "../../components/EstimatedTime.tsx";

export const AdminServiceDetailsPage: FC = () => {
    useBackButton(() => navigate(RoutePaths.Admin.Services.List));

    const {t} = useTranslation();
    const [deleteService, {isLoading: deleteLoading}] = useDeleteAdminServiceByIdMutation();
    const navigate = useNavigate()
    const dispatch = useDispatch();

    const {id} = useParams<string>();
    const {data: serviceVariant, isLoading, isError} = useGetAdminServicesByIdQuery({id: id!});

    const handleAddOptionClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        dispatch(selectBaseService(serviceVariant))
        navigate(RoutePaths.Admin.Order.Create)
    }

    const handleCloseClick = () => {
        Telegram.WebApp.showPopup({
            title: `Are you sure you want to delete ${serviceVariant?.name}?`,
            message: 'The service is not permanently deleted, it can be restored.',
            buttons: [{
                id: 'ok',
                text: 'Delete',
                type: 'destructive'
            },{
                id: 'cancel',
                text: 'Cancel',
                type: 'default'
            }]
        }, id => id === 'ok' && deleteService({id: serviceVariant.id}).unwrap().then(() => navigate(RoutePaths.Admin.Services.List)))
    }

    if (isLoading || deleteLoading || !serviceVariant) {
        return <div className="p-4 mt-[56px] flex flex-col gap-4">
            <Skeleton className="w-full h-[112px]"/>
            <Skeleton className="w-full h-[192px]"/>
            <Skeleton className="w-full h-[164px]"/>
        </div>
    }

    if (isError) {
        return <div
            className="h-screen">
            <ErrorState/>
        </div>
    }

    return <div className="flex flex-col bg-inherit overflow-y-auto overscroll-none h-screen">
        <div className="flex flex-col gap-4 bg-inherit p-4">
            <Card className="p-0 p-3 gap-0">
                <div className="flex justify-between">
                    <Typography.Title>{serviceVariant.name}</Typography.Title>
                    <Typography.Title>
                        №{serviceVariant.id}
                    </Typography.Title>
                </div>
            </Card>
            <div className="flex flex-col gap-2">
                <Typography.Title>Options</Typography.Title>
                {serviceVariant?.options?.map(o => <Card className="p-0 gap-0 pl-4" key={o.id}>
                    <div className="p-3 pl-0 separator-shadow-bottom flex justify-between items-center">
                        <Typography.Title>Name</Typography.Title>
                        <Typography.Description className="text-base">{o.name}</Typography.Description>
                    </div>
                    <div className="p-3 pl-0 separator-shadow-bottom flex justify-between items-center">
                        <Typography.Title>Duration</Typography.Title>
                        <Typography.Description className="text-base">{formatDuration(o.duration)}</Typography.Description>
                    </div>
                    <div className="p-3 pl-0 flex justify-between items-center">
                        <Typography.Title>Price</Typography.Title>
                        <Typography.Description className="text-base">{moneyFormat(o.price)}</Typography.Description>
                    </div>
                </Card>)}
            </div>
        </div>
        <BottomActions
            className="flex flex-col gap-2 [min-height:calc(58px+var(--tg-safe-area-inset-bottom))] [padding-bottom:var(--tg-safe-area-inset-bottom)]">
            <Button
                wide
                size="lg"
                onClick={handleAddOptionClick}
            >
                Edit
            </Button>
            <Button
                wide
                size="lg"
                className="border-none"
                variant="default"
                onClick={handleCloseClick}
            >
                Delete
            </Button>
        </BottomActions>
    </div>
}
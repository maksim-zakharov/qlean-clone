import {EmptyState} from "./EmptyState.tsx";
import {GiftIcon} from "lucide-react";
import {Skeleton} from "./ui/skeleton.tsx";
import {Card} from "./ui/card.tsx";
import {Typography} from "./ui/Typography.tsx";
import dayjs from "dayjs";
import React from "react";
import {useTranslation} from "react-i18next";

export const InvitesList = ({invites, isSuccess, isLoading}) => {
    const {t} = useTranslation();

    if (isLoading) {
        return <Skeleton className="w-full h-[200px] rounded-none"/>;
    }

    if (!invites?.length && isSuccess) {
        return <EmptyState icon={<GiftIcon/>} title={t('bonuses_invites_empty_title')}
                           description={t("bonuses_invites_empty_description")}/>;
    }

    return <div className="flex flex-col gap-2 pb-3 pt-2">
        {invites.map(ao => <Card className="p-0 mx-3 pl-4 gap-0 border-none card-bg-color mt-2">
            <div className="p-3 pl-0 flex justify-between">
                <Typography.Title>{ao.firstName} {ao.lastName}</Typography.Title>
                <Typography.Title>{dayjs(ao.createdAt).format('dd, D MMMM')}</Typography.Title>
            </div>
        </Card>)}
    </div>
}
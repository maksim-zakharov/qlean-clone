import {Typography} from "./ui/Typography.tsx";
import {moneyFormat} from "../lib/utils.ts";
import React, {FC, useMemo} from "react";
import {Card} from "./ui/card.tsx";
import {CalendarCheck, Plus} from "lucide-react";
import {Button} from "./ui/button.tsx";
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from "./ui/sheet.tsx";
import {BottomActions} from "./BottomActions.tsx";
import {useTelegram} from "../hooks/useTelegram.tsx";
import {useAddBonusMutation} from "../api/ordersApi.ts";
import {toast} from "sonner";

export const BonusTotal: FC<{ bonuses: any[], isAdmin?: boolean, userId?: string }> = ({bonuses, isAdmin, userId}) => {

    const total = useMemo(() => bonuses.reduce((acc, curr) => acc + curr.value, 0), [bonuses]);

    const [addBonus, {isLoading}] = useAddBonusMutation();

    const {vibro} = useTelegram();

    const [_opened, setOpened] = React.useState(false);

    const handleOpenChange = (opened: boolean) => {
        opened ? vibro() : null;
        setOpened(opened)
    }

    const handleOnClick = async () => {
        await addBonus({
            id: userId,
            value: 300
        }).unwrap();
        setOpened(false)
        toast('Bonuses was added', {
            classNames: {
                icon: 'mr-2 h-5 w-5 text-[var(--chart-2)]'
            },
            icon: <CalendarCheck className="h-5 w-5 text-[var(--chart-2)]"/>
        })
    }

    return <Card className="mb-2 text-center gap-0 p-3 relative">
        <Typography.H2 className="text-3xl m-0 text-center">{moneyFormat(total)}</Typography.H2>
        <Typography.Description className="text-md m-0 text-center">bonuses accumulated</Typography.Description>
        {isAdmin && <Sheet onOpenChange={handleOpenChange} open={_opened}>
            <SheetTrigger asChild onClick={() => setOpened(true)}>
                <Button className="pr-1 mt-2">
                    <Plus className="w-5 h-5 mr-2" /> Add bonuses
                </Button>
            </SheetTrigger>
            <SheetContent side="bottom">
                <SheetHeader>
                    <SheetTitle
                        className="text-xl font-bold text-tg-theme-text-color text-left">Add bonuses</SheetTitle>
                </SheetHeader>
                <BottomActions className="bg-inherit [padding-bottom:var(--tg-safe-area-inset-bottom)] relative">
                    <Button
                        wide
                        size="lg"
                        loading={isLoading}
                        onClick={handleOnClick}
                    >
                        <Plus className="w-5 h-5 mr-2" />Add
                    </Button>
                </BottomActions>
            </SheetContent>
        </Sheet>}
    </Card>
}
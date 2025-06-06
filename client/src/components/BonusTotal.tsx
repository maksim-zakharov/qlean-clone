import {Typography} from "./ui/Typography.tsx";
import {moneyFormat} from "../lib/utils.ts";
import React, {FC, useMemo} from "react";
import {Card} from "./ui/card.tsx";

export const BonusTotal: FC<{ bonuses: any[] }> = ({bonuses}) => {

    const total = useMemo(() => bonuses.reduce((acc, curr) => acc + curr.value, 0), [bonuses])

    return <Card className="mb-2 text-center gap-0 p-3">
        <Typography.H2 className="text-3xl m-0 text-center">{moneyFormat(total)}</Typography.H2>
        <Typography.Description className="text-md m-0 text-center">bonuses accumulated</Typography.Description>
    </Card>
}
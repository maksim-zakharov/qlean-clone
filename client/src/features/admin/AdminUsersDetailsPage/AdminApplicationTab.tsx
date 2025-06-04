import {Button} from "../../../components/ui/button.tsx";
import {ProfileApplicationCard} from "../../../components/ProfileApplicationCard.tsx";
import React from "react";

export const AdminApplicationTab = ({application}) => {

    return <>
        {application?.status !== 'REJECTED' &&
            <div
                className="flex gap-2 p-4 [min-height:calc(58px+var(--tg-safe-area-inset-bottom))] [padding-bottom:var(--tg-safe-area-inset-bottom)]">
                <Button
                    wide
                    size="lg"
                >
                    Approve
                </Button>
                <Button
                    wide
                    size="lg"
                    className="border-none"
                    variant="default"
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
import React, {FC, PropsWithChildren} from "react";

export const SafeAreaBottom: FC<PropsWithChildren> = ({children}) => <div
    className="bg-inherit [padding-bottom:var(--tg-safe-area-inset-bottom)] relative">
    {children}
</div>
import {Header} from "../../components/ui/Header.tsx";
import {RoutePaths} from "../../routes.ts";
import React, {useEffect, useMemo, useState} from "react";
import {BackButton} from "../../components/BackButton.tsx";
import {Typography} from "@/components/ui/Typography.tsx";
import {useGetApplicationQuery, useGetServicesQuery, useLoginMutation, useSendApplicationMutation} from "../../api.ts";
import {ListButton, ListButtonGroup} from "../../components/ListButton.tsx";
import {DynamicIcon} from "lucide-react/dynamic";
import {Checkbox} from "../../components/ui/checkbox.tsx";
import {useTelegram} from "../../hooks/useTelegram.ts";
import {BottomActions} from "../../components/BottomActions.tsx";
import {Button} from "../../components/ui/button.tsx";
import {FileClock, FileX, Loader2} from "lucide-react";
import {useNavigate} from "react-router-dom";

export const ApplicationPage = () => {
    const [loginMutation] = useLoginMutation();
    const {data: services = [], isLoading: servicesLoading} = useGetServicesQuery();
    const {data: application, isLoading: applicationLoading} = useGetApplicationQuery();
    const navigate = useNavigate()
    const [sendApplication, {isLoading: sendApplicationLoading}] = useSendApplicationMutation();
    const {vibro} = useTelegram();

    useEffect(() => {
        if(application?.status ==='APPROVED')
            loginMutation('executor').unwrap()
    }, [application]);

    const [variantIds, setVariantIds] = useState<any>([]);
    const selectedOptionsIdSet = useMemo(() => new Set(variantIds), [variantIds]);

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

    const handleSubmitApplication = () => sendApplication(variantIds).unwrap()

    const isLoading = servicesLoading || applicationLoading;

    if (isLoading) {
        return <div className="flex justify-center h-screen items-center m-auto"><Loader2
            className="animate-spin h-16 w-16 mb-16"/></div>
    }

    if (!application) {
        return <>
            <Header>
                <BackButton url={RoutePaths.Profile}/>
            </Header>
            <div className="content px-4">
                <Typography.H2 className="text-3xl mb-6">Job application</Typography.H2>

                <Typography.Title>What are you going to do?</Typography.Title>

                {services.map(s => <div className="mt-4">
                    <Typography.Description className="block mb-2">{s.name}</Typography.Description>
                    <ListButtonGroup>
                        {s.variants.map(s => <ListButton text={s.name} extra={
                            <Checkbox checked={selectedOptionsIdSet.has(s.id)}
                                      onCheckedChange={() => handleOptionToggle(s)}/>} icon={<DynamicIcon name={s.icon}
                                                                                                          className="w-7 h-7 p-1 root-bg-color rounded-md"
                                                                                                          strokeWidth={1.5}/>}/>)}
                    </ListButtonGroup>
                </div>)}

                <BottomActions className="bg-inherit">
                    <Button wide disabled={variantIds.length === 0} loading={sendApplicationLoading}
                            onClick={handleSubmitApplication}>Submit application</Button>
                </BottomActions>
            </div>
        </>
    }

    if (application.status === "PENDING") {
        return <div className="flex flex-col justify-center h-screen items-center m-auto">
            <FileClock className="w-20 h-20 p-2 rounded-3xl card-bg-color mb-4"/>
            <Typography.H2 className="mb-2">Application pending</Typography.H2>
            <Typography.Title className="mb-4 font-normal">Please await moderator review</Typography.Title>
            <Button onClick={() => navigate(RoutePaths.Profile)}>Back to profile</Button>
        </div>
    }

    if (application.status === "REJECTED") {
        return <div className="flex flex-col justify-center h-screen items-center m-auto">
            <FileX className="w-20 h-20 p-2 rounded-3xl card-bg-color mb-4"/>
            <Typography.H2 className="mb-2">Application rejected</Typography.H2>
            <Typography.Title className="mb-4 font-normal text-center">If you have any questions, <br/> please contact a
                support</Typography.Title>
            <Button onClick={() => navigate(RoutePaths.Profile)}>Back to profile</Button>
            <Button variant="ghost" onClick={() => window.open(`https://t.me/@qlean_clone_bot?start=support_${Date.now()}`, '_blank')}>Contact support</Button>
        </div>
    }

    return null;
}
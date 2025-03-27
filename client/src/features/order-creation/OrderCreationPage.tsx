import React, {useEffect, useMemo, useState} from 'react'
import {useLocation, useNavigate, useParams} from 'react-router-dom'
import {Button} from '@/components/ui/button'
import {Tabs, TabsList, TabsTrigger} from '@/components/ui/tabs'
import {CLEANING_TABS, DRYCLEANING_TABS, Service, SERVICE_OPTIONS} from './types'
import {List} from "../../components/ui/list.tsx";
import {BackButton} from "../../components/BackButton.tsx";
import {useTelegram} from "../../hooks/useTelegram.ts";
import {Info, Plus} from 'lucide-react'
import EstimatedTime from "../../components/EstimatedTime.tsx";
import {Header} from "../../components/ui/Header.tsx";

export const OrderCreationPage = () => {
    const location = useLocation()
    const selectedServices = (location.state?.selectedServices || []) as Service[]
    const {vibro} = useTelegram();
    const navigate = useNavigate()
    const {serviceId = ''} = useParams<{ serviceId: string }>()
    const [currentService, setcurrentService] = useState<Service | undefined>(location.state?.currentService);
    const [selectedOptions, setSelectedOptions] = useState<string[]>(selectedServices.map(s => s.id));

    // Определяем тип сервиса и находим текущую услугу
    const isCleaningService = useMemo(() => CLEANING_TABS.flatMap(tab => tab.services).some(service => service.id === serviceId), [serviceId]);

    const tabs = isCleaningService ? CLEANING_TABS : DRYCLEANING_TABS
    const serviceType = isCleaningService ? 'cleaning' : 'drycleaning'

    useEffect(() => {
        setcurrentService(tabs
            .flatMap(tab => tab.services)
            .find(service => service.id === serviceId))
    }, [serviceId, tabs]);

    // Находим таб, в котором находится услуга
    const currentTab = useMemo(() => tabs.find(tab =>
        tab.services.some(service => service.id === serviceId)
    ), [serviceId, tabs]);

    // Получаем доступные опции для типа услуги
    const availableOptions = SERVICE_OPTIONS[serviceType] || []

    // Считаем общую сумму
    const totalPrice = useMemo(() => selectedOptions.reduce((sum, optionId) => {
        const option = availableOptions.find(opt => opt.id === optionId)
        return sum + (option?.price || 0)
    }, currentService?.basePrice || 0), [currentService, selectedOptions, availableOptions]);

    // Считаем общее время
    const totalDuration = useMemo(() => selectedOptions.reduce((sum, optionId) => {
        const option = availableOptions.find(opt => opt.id === optionId)
        return sum + (option?.duration || 0)
    }, currentService?.duration || 0), [currentService, selectedOptions, availableOptions]);

    const handleOptionToggle = (optionId: string) => {
        vibro('light');
        setSelectedOptions(prev =>
            prev.includes(optionId)
                ? prev.filter(id => id !== optionId)
                : [...prev, optionId]
        )
    }

    const handleNext = () => {
        const selectedServiceOptions = availableOptions
            .filter(option => selectedOptions.includes(option.id));

        navigate(`/order/${serviceId}/checkout`, {
            state: {selectedServices: selectedServiceOptions, currentService}
        });
    }

    if (!currentService) {
        return null
    }

    return (
        <div className="fixed inset-0 flex flex-col">
            <div className="absolute inset-x-0 mx-auto h-full flex flex-col">
                <Header>
                    <div className="grid grid-cols-[40px_auto_40px]">
                        <BackButton/>
                        <div
                            className="items-center flex justify-center text-base font-medium text-tg-theme-text-color">
                            {isCleaningService ? 'Уборка' : 'Химчистка'}
                        </div>
                    </div>
                </Header>
                <Tabs defaultValue={currentTab?.id} value={currentTab?.id} className="pt-[calc(56px+env(safe-area-inset-top))]">
                    <TabsList>
                        {tabs.map(tab => (
                            <TabsTrigger
                                key={tab.id}
                                value={tab.id}
                                onClick={() => {
                                    if (tab.services.length > 0) {
                                        navigate(`/order/${tab.services[0].id}`)
                                    }
                                }}
                            >
                                {tab.name}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>

                {/* Service Options */}
                <div className="flex-1 overflow-y-auto overscroll-none bg-tg-theme-secondary-bg-color">
                    <div className="px-2 pt-4">
                        <List>
                            {availableOptions.map((option) => <>
                                <div className="flex items-start gap-3 flex-1 min-w-0">
                                    <Info
                                        className="flex-none w-[18px] h-[18px] mt-0.5 text-tg-theme-subtitle-text-color"/>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                        <span
                                            className="text-[15px] font-normal text-tg-theme-text-color truncate">{option.name}</span>
                                            {option.isPopular && (
                                                <span
                                                    className="px-1.5 py-0.5 text-[12px] font-medium badge-primary rounded-sm">
                ПОПУЛЯРНО
              </span>
                                            )}
                                        </div>
                                        {option.description && (
                                            <p className="mt-0.5 text-[13px] text-tg-theme-subtitle-text-color line-clamp-2">
                                                {option.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 ml-3">
                <span
                    className="text-[15px] font-normal text-tg-theme-text-color whitespace-nowrap">{option.price} ₽</span>
                                    <Button
                                        variant="ghost"
                                        className={`w-[34px] h-[34px] p-0 rounded-xl hover:bg-transparent ${
                                            selectedOptions.includes(option.id)
                                                ? 'bg-tg-theme-button-color text-tg-theme-button-text-color'
                                                : 'border border-tg-theme-button-color text-tg-theme-button-color'
                                        }`}
                                        onClick={() => handleOptionToggle(option.id)}
                                    >
                                        <Plus
                                            className={`w-[18px] h-[18px] ${selectedOptions.includes(option.id) ? 'rotate-45' : ''} transition-transform`}/>
                                    </Button>
                                </div>
                            </>)}
                        </List>
                    </div>
                    <EstimatedTime totalDuration={totalDuration}/>
                </div>

                {/* Bottom Section */}
                <div
                    className="bg-tg-theme-secondary-bg-color flex-none p-4 pb-[calc(env(safe-area-inset-bottom,0px)+12px)]">

                    {/* Next Button */}
                    <Button
                        className="w-full px-8 h-[48px] text-[15px] font-medium bg-tg-theme-button-color text-tg-theme-button-text-color hover:bg-tg-theme-button-color/90"
                        onClick={handleNext}
                    >
                        <span className="flex-1 text-left">Далее</span>
                        <span className="font-bold">{totalPrice} ₽</span>
                    </Button>
                </div>
            </div>
        </div>
    )
}
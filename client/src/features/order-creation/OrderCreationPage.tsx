import React, {useEffect, useMemo, useState} from 'react'
import {useLocation, useNavigate, useParams} from 'react-router-dom'
import {Button} from '@/components/ui/button'
import {Tabs, TabsList, TabsTrigger} from '@/components/ui/tabs'
import {CLEANING_TABS, DRYCLEANING_TABS, Service, SERVICE_OPTIONS} from './types'
import {List} from "../../components/ui/list.tsx";
import {BackButton} from "../../components/BackButton.tsx";
import {useTelegram} from "../../hooks/useTelegram.ts";
import {Clock} from 'lucide-react'
import EstimatedTime from "../../components/EstimatedTime.tsx";

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

    useEffect(() => {
        Telegram.WebApp.MainButton.onClick(handleNext)
        Telegram.WebApp.MainButton.setParams({
            is_visible: true,
            text: `Далее ${totalPrice} ₽`,
        })
    }, [totalPrice])

    if (!currentService) {
        return null
    }

    return (
        <div className="fixed inset-0 flex flex-col">
            <div className="absolute inset-x-0 mx-auto h-full flex flex-col">
                {/* Header */}
                <div
                    className="flex items-center h-[48px] px-2 pt-[env(safe-area-inset-top,0px)] bg-tg-theme-secondary-bg-color border-b border-tg-theme-section-separator-color">
                    <BackButton/>
                    <div className="flex-1 flex justify-center">
                        <span
                            className="text-base font-medium text-tg-theme-text-color">{isCleaningService ? 'Уборка' : 'Химчистка'}</span>
                    </div>
                    <div className="w-[40px]"/>
                    {/* Для центрирования заголовка */}
                </div>

                <Tabs defaultValue={currentTab?.id} value={currentTab?.id}>
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
                    <div className="p-2">
                        <List items={availableOptions} handleOptionToggle={handleOptionToggle}
                              selectedOptions={selectedOptions}/>
                    </div>
                    <EstimatedTime totalDuration={totalDuration}/>
                </div>

                {/* Bottom Section */}
                {Telegram.WebApp.platform === 'unknown' && <div
                    className="bg-tg-theme-secondary-bg-color flex-none p-4 pb-[calc(env(safe-area-inset-bottom,0px)+12px)]">

                    {/* Next Button */}
                    <Button
                        className="w-full px-8 h-[48px] text-[15px] font-medium bg-tg-theme-button-color text-tg-theme-button-text-color hover:bg-tg-theme-button-color/90"
                        onClick={handleNext}
                    >
                        <span className="flex-1 text-left">Далее</span>
                        <span className="font-bold">{totalPrice} ₽</span>
                    </Button>
                </div>}
            </div>
        </div>
    )
}
import {useEffect, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {Button} from '@/components/ui/button'
import {Tabs, TabsList, TabsTrigger} from '@/components/ui/tabs'
import {CLEANING_TABS, DRYCLEANING_TABS, SERVICE_OPTIONS} from './types'
import {List} from "../../components/ui/list.tsx";
import {BackButton} from "../../components/BackButton.tsx";
import {useTelegram} from "../../hooks/useTelegram.ts";
import {Clock} from 'lucide-react'

export const OrderCreationPage = () => {
    const {vibro} = useTelegram();
    const navigate = useNavigate()
    const {serviceId = ''} = useParams<{ serviceId: string }>()
    const [selectedOptions, setSelectedOptions] = useState<string[]>([])

    // Определяем тип сервиса и находим текущую услугу
    const isCleaningService = CLEANING_TABS.flatMap(tab => tab.services).some(service => service.id === serviceId)
    const isDryCleaningService = DRYCLEANING_TABS.flatMap(tab => tab.services).some(service => service.id === serviceId)

    const tabs = isCleaningService ? CLEANING_TABS : DRYCLEANING_TABS
    const serviceType = isCleaningService ? 'cleaning' : 'drycleaning'

    // Находим текущую услугу
    const currentService = tabs
        .flatMap(tab => tab.services)
        .find(service => service.id === serviceId)

    // Находим таб, в котором находится услуга
    const currentTab = tabs.find(tab =>
        tab.services.some(service => service.id === serviceId)
    )

    // Получаем доступные опции для типа услуги
    const availableOptions = SERVICE_OPTIONS[serviceType] || []

    // Считаем общую сумму
    const totalPrice = selectedOptions.reduce((sum, optionId) => {
        const option = availableOptions.find(opt => opt.id === optionId)
        return sum + (option?.price || 0)
    }, currentService.basePrice)

    // Считаем общее время
    const totalDuration = selectedOptions.reduce((sum, optionId) => {
        const option = availableOptions.find(opt => opt.id === optionId)
        return sum + (option?.duration || 0)
    }, currentService.duration)

    // Форматируем время в часы и минуты
    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60)
        const remainingMinutes = minutes % 60

        if (hours === 0) {
            return `${remainingMinutes} минут`
        } else if (remainingMinutes === 0) {
            return `${hours} ${hours === 1 ? 'час' : hours < 5 ? 'часа' : 'часов'}`
        } else {
            return `${hours} ${hours === 1 ? 'час' : hours < 5 ? 'часа' : 'часов'} ${remainingMinutes} минут`
        }
    }

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
            .filter(option => selectedOptions.includes(option.id))
            .map(option => ({
                name: option.name,
                price: option.price,
                duration: option.duration
            }));

        const services = [
            {
                name: currentService.name,
                price: currentService.basePrice,
                duration: currentService.duration
            },
            ...selectedServiceOptions
        ];

        navigate(`/order/${serviceId}/checkout`, {
            state: {selectedServices: services}
        });
    }

    useEffect(() => {
        Telegram.WebApp.MainButton.setParams({
            is_visible: true,
            position: 'left',
            text: `Далее ${totalPrice} ₽`,
        })
        // Telegram.WebApp.MainButton.show()
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
                    {/* Estimated Time */}
                    <div className="flex items-center justify-center gap-2 mt-4 text-tg-theme-button-color text-base">
                        <Clock className="w-5 h-5"/>
                        <span>Время уборки примерно {formatDuration(totalDuration)}</span>
                    </div>
                </div>

                {/* Bottom Section */}
                {Telegram.WebApp.platform === 'unknown' && <div
                    className="bg-tg-theme-secondary-bg-color flex-none px-2 py-4 pb-[calc(env(safe-area-inset-bottom,0px)+12px)]">

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
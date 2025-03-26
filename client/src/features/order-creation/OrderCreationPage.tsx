import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, Info, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CLEANING_TABS, DRYCLEANING_TABS, SERVICE_OPTIONS, type ServiceOption } from './types'
import {List} from "../../components/ui/list.tsx";

export const OrderCreationPage = () => {
  const navigate = useNavigate()
  const { serviceId = '' } = useParams<{ serviceId: string }>()
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

  if (!currentService) {
    return null
  }

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

  const handleOptionToggle = (optionId: string) => {
    setSelectedOptions(prev => 
      prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    )
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-tg-theme-bg-color">
      <div className="absolute inset-x-0 mx-auto max-w-[420px] h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center h-[48px] px-2 pt-[env(safe-area-inset-top,0px)] bg-tg-theme-section-bg-color border-b border-tg-theme-section-separator-color">
          <Button
            variant="ghost"
            className="p-2 -ml-2 text-tg-theme-button-color hover:bg-transparent"
            onClick={() => navigate('/')}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1 flex justify-center">
            <span className="text-base font-medium text-tg-theme-text-color">{isCleaningService ? 'Уборка' : 'Химчистка'}</span>
          </div>
          <div className="w-[40px]" /> {/* Для центрирования заголовка */}
        </div>

        {/* Tabs */}
        <div className="bg-tg-theme-section-bg-color overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <Tabs defaultValue={currentTab?.id} value={currentTab?.id} className="w-full">
            <TabsList className="min-w-fit h-auto p-0 bg-transparent border-b border-tg-theme-section-separator-color flex">
              {tabs.map(tab => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="group px-6 py-3 text-[17px] font-medium text-tg-theme-hint-color data-[state=active]:text-tg-theme-button-color data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  onClick={() => {
                    if (tab.services.length > 0) {
                      navigate(`/order/${tab.services[0].id}`)
                    }
                  }}
                >
                  <span className="relative inline-block whitespace-nowrap">
                    {tab.name}
                    <span className="absolute left-0 right-0 bottom-[-8px] h-[2px] bg-current opacity-0 group-data-[state=active]:opacity-100" />
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Service Options */}
        <div className="flex-1 overflow-y-auto overscroll-none">
          <div className="p-2">
            <List items={availableOptions} handleOptionToggle={handleOptionToggle} selectedOptions={selectedOptions}/>
          </div>
        </div>

        {/* Bottom Button */}
        <div className="flex-none px-2 py-3 pb-[calc(env(safe-area-inset-bottom,0px)+12px)]">
          <Button
            className="w-full h-[48px] text-[15px] font-medium bg-tg-theme-button-color text-tg-theme-button-text-color hover:bg-tg-theme-button-color/90"
            onClick={() => {
              // TODO: Implement order creation
              console.log('Creating order with options:', selectedOptions)
            }}
          >
            <span className="flex-1 text-left">Далее</span>
            <span>{totalPrice} ₽</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, Info, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CLEANING_TABS, DRYCLEANING_TABS, SERVICE_OPTIONS, type ServiceOption } from './types'

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
        <div className="bg-tg-theme-section-bg-color border-b border-tg-theme-section-separator-color">
          <div className="flex px-2">
            {tabs.map(tab => (
              <Button
                key={tab.id}
                variant="ghost"
                className={`group relative min-h-0 px-3 py-2 text-[13px] leading-none font-medium whitespace-nowrap hover:bg-transparent ${
                  tab.id === currentTab?.id
                    ? 'text-tg-theme-button-color'
                    : 'text-tg-theme-hint-color'
                }`}
                onClick={() => {
                  if (tab.services.length > 0) {
                    navigate(`/order/${tab.services[0].id}`)
                  }
                }}
              >
                <span className="relative">
                  {tab.name}
                  {tab.id === currentTab?.id && (
                    <span className="absolute left-0 right-0 bottom-[-8px] h-0.5 bg-current" />
                  )}
                </span>
              </Button>
            ))}
          </div>
        </div>

        {/* Service Options */}
        <div className="flex-1 overflow-y-auto overscroll-none">
          <div className="p-2">
            <div className="bg-tg-theme-section-bg-color rounded-2xl overflow-hidden">
              {availableOptions.map((option: ServiceOption, index) => (
                <ServiceOptionCard
                  key={option.id}
                  option={option}
                  isSelected={selectedOptions.includes(option.id)}
                  onToggle={() => handleOptionToggle(option.id)}
                  isLast={index === availableOptions.length - 1}
                />
              ))}
            </div>
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

type ServiceOptionCardProps = {
  option: ServiceOption
  isSelected: boolean
  onToggle: () => void
  isLast: boolean
}

const ServiceOptionCard = ({ option, isSelected, onToggle, isLast }: ServiceOptionCardProps) => {
  return (
    <div className={`flex items-center px-4 py-3 ${!isLast && 'border-b border-tg-theme-section-separator-color'}`}>
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <Info className="flex-none w-[18px] h-[18px] mt-0.5 text-tg-theme-subtitle-text-color" />
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[15px] font-normal text-tg-theme-text-color truncate">{option.name}</span>
            {option.isPopular && (
              <span className="px-1.5 py-0.5 text-[12px] font-medium text-white bg-[#4CAF50] rounded-sm">
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
        <span className="text-[15px] font-normal text-tg-theme-text-color whitespace-nowrap">{option.price} ₽</span>
        <Button
          variant="ghost"
          className={`w-[34px] h-[34px] p-0 rounded-xl hover:bg-transparent ${
            isSelected
              ? 'bg-tg-theme-button-color text-tg-theme-button-text-color'
              : 'border border-tg-theme-button-color text-tg-theme-button-color'
          }`}
          onClick={onToggle}
        >
          <Plus className="w-[18px] h-[18px]" />
        </Button>
      </div>
    </div>
  )
} 
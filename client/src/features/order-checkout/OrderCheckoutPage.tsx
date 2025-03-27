import { BackButton } from "@/components/BackButton"
import { Button } from "@/components/ui/button"
import { Calendar, ChevronRight, Clock, CreditCard, MessageSquare } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import { Checkbox } from "@/components/ui/checkbox"
import {ServiceOption, Service} from "../order-creation/types.ts";


export const OrderCheckoutPage = () => {
  const location = useLocation()
  const currentService = location.state?.currentService as Service;
  const selectedServices = (location.state?.selectedServices || []) as ServiceOption[]
  const totalPrice = selectedServices.reduce((sum: number, service: ServiceOption) => sum + service.price, currentService.basePrice)
  const estimatedTime = "4 часа" // TODO: Расчет времени на основе выбранных услуг

  return (
    <div className="fixed inset-0 flex flex-col bg-tg-theme-bg-color">
      {/* Header */}
      <div className="flex items-center h-[48px] px-2 pt-[env(safe-area-inset-top,0px)] bg-tg-theme-secondary-bg-color border-b border-tg-theme-section-separator-color">
        <BackButton url={`/order/${currentService?.id}`} state={{selectedServices, currentService}} />
        <div className="flex-1 flex flex-col items-center">
          <span className="text-base font-medium text-tg-theme-text-color">Оформление заказа</span>
          <span className="text-sm text-tg-theme-hint-color">Оружейный переулок, 41</span>
        </div>
        <div className="w-[40px]" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-3">
          {/* Date and Time */}
          <Button
            variant="ghost"
            className="w-full bg-tg-theme-bg-color rounded-2xl h-auto py-4 px-4 flex items-center justify-between"
            onClick={() => {/* TODO: Open date picker */}}
          >
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-tg-theme-hint-color" />
              <span className="text-tg-theme-text-color">Дата и время уборки</span>
            </div>
            <ChevronRight className="w-5 h-5 text-tg-theme-hint-color" />
          </Button>

          {/* Comments */}
          <Button
            variant="ghost"
            className="w-full bg-tg-theme-bg-color rounded-2xl h-auto py-4 px-4 flex items-center justify-between"
            onClick={() => {/* TODO: Open comments modal */}}
          >
            <div className="flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-tg-theme-hint-color" />
              <span className="text-tg-theme-text-color">Пожелание к заказу</span>
            </div>
            <ChevronRight className="w-5 h-5 text-tg-theme-hint-color" />
          </Button>

          {/* Payment Method */}
          <Button
            variant="ghost"
            className="w-full bg-tg-theme-bg-color rounded-2xl h-auto py-4 px-4 flex items-center justify-between"
            onClick={() => {/* TODO: Open payment selection */}}
          >
            <div className="flex items-center gap-3">
              <CreditCard className="w-6 h-6 text-tg-theme-hint-color" />
              <span className="text-tg-theme-text-color">Мир *5987</span>
            </div>
          </Button>

          {/* Order Summary */}
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium text-tg-theme-text-color">Итого</span>
              <div className="flex items-center gap-1">
                <span className="text-lg font-medium text-tg-theme-text-color">{totalPrice}₽</span>
                <ChevronRight className="w-5 h-5 text-tg-theme-hint-color" />
              </div>
            </div>

            {/* Services List */}
            {selectedServices.map((service, index: number) => (
              <div key={index} className="flex justify-between">
                <span className="text-tg-theme-text-color">{service.name}</span>
                <span className="text-tg-theme-text-color">{service.price}₽</span>
              </div>
            ))}

            {/* Estimated Time */}
            <div className="flex items-center gap-2 text-tg-theme-button-color">
              <Clock className="w-4 h-4" />
              <span>Время уборки примерно {estimatedTime}</span>
            </div>
          </div>

          {/* Promo Code */}
          <Button
            variant="ghost"
            className="w-full bg-tg-theme-bg-color rounded-2xl h-auto py-4 px-4 flex items-center justify-center"
            onClick={() => {/* TODO: Open promo code input */}}
          >
            <span className="text-tg-theme-text-color">У меня есть промокод</span>
          </Button>

          {/* Terms Checkbox */}
          <div className="flex items-start gap-2 mt-4">
            <Checkbox id="terms" className="mt-1" />
            <label htmlFor="terms" className="text-sm text-tg-theme-text-color">
              Принимаю <span className="text-tg-theme-button-color">условия оказания услуги</span>
            </label>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="p-4 pb-[calc(env(safe-area-inset-bottom,0px)+16px)] bg-tg-theme-bg-color">
        <Button
          className="w-full h-12 text-base font-medium"
          onClick={() => {/* TODO: Submit order */}}
        >
          Оформить заказ
        </Button>
      </div>
    </div>
  )
} 
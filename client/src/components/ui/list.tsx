import type {ServiceOption} from "../../features/order-creation/types.ts";
import {Info, Plus} from "lucide-react";
import {Button} from "./button.tsx";
import {FC} from "react";

interface Props {
    items: any[]
    selectedOptions: any[],
    handleOptionToggle: any
}

export const List: FC<Props> = ({items, handleOptionToggle, selectedOptions}) => <div
    className="bg-tg-theme-section-bg-color rounded-2xl overflow-hidden">
    {items.map((option: ServiceOption, index) => (
        <div
            className={`flex items-center px-4 py-3 ${index !== items.length - 1 && 'border-b border-tg-theme-section-separator-color'}`}>
            <div className="flex items-start gap-3 flex-1 min-w-0">
                <Info className="flex-none w-[18px] h-[18px] mt-0.5 text-tg-theme-subtitle-text-color"/>
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
                    <Plus className="w-[18px] h-[18px]"/>
                </Button>
            </div>
        </div>
    ))}
</div>
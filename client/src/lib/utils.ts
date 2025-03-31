import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const moneyFormat = (num: number) => new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  maximumFractionDigits: 0,
  currency: 'RUB',
}).format(num);

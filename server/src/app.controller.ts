import {Controller} from '@nestjs/common';

@Controller()
export class AppController {
    constructor() {
    }

    // @Get('/api/env')
    // getEnv() {
    //     return process.env;
    // }

    // @Get('/api/services')
    // getServices() {
    //     const SERVICES_DATA: ServiceCategory[] = [
    //         {
    //             id: 'cleaning',
    //             name: 'Уборка',
    //             services: [
    //                 {
    //                     id: 'regular-cleaning',
    //                     name: 'Поддерживающая',
    //                     basePrice: 3000,
    //                     duration: 120,
    //                     backgroundColor: 'bg-green-50 dark:bg-green-900/30',
    //                     icon: 'Sparkles'
    //                 },
    //                 {
    //                     id: 'general-cleaning',
    //                     name: 'Генеральная',
    //                     basePrice: 5000,
    //                     duration: 240,
    //                     backgroundColor: 'bg-slate-100 dark:bg-slate-800/60',
    //                     icon: 'Brush'
    //                 },
    //                 {
    //                     id: 'after-repair',
    //                     name: 'После ремонта',
    //                     basePrice: 6000,
    //                     duration: 300,
    //                     backgroundColor: 'bg-orange-50 dark:bg-orange-900/30',
    //                     icon: 'Hammer'
    //                 },
    //                 {
    //                     id: 'cottage',
    //                     name: 'Уборка коттеджей',
    //                     basePrice: 8000,
    //                     duration: 180,
    //                     backgroundColor: 'bg-blue-50 dark:bg-blue-900/30',
    //                     icon: 'Home'
    //                 },
    //                 {
    //                     id: 'commercial',
    //                     name: 'Коммерческие помещения',
    //                     basePrice: 10000,
    //                     duration: 240,
    //                     backgroundColor: 'bg-purple-50 dark:bg-purple-900/30',
    //                     icon: 'Building2'
    //                 }
    //             ],
    //             options: [
    //                 {
    //                     id: 'windows',
    //                     name: 'Мытье окон',
    //                     price: 500,
    //                     duration: 30,
    //                     isPopular: true
    //                 },
    //                 {
    //                     id: 'ironing',
    //                     name: 'Глажка белья',
    //                     price: 700,
    //                     duration: 45,
    //                     isPopular: true
    //                 },
    //                 {
    //                     id: 'fridge',
    //                     name: 'Уборка холодильника',
    //                     price: 300,
    //                     duration: 15
    //                 },
    //                 {
    //                     id: 'cat-litter',
    //                     name: 'Уборка кошачьего лотка',
    //                     price: 200,
    //                     duration: 15
    //                 },
    //                 {
    //                     id: 'balcony',
    //                     name: 'Уборка балкона',
    //                     price: 800,
    //                     duration: 45
    //                 }
    //             ]
    //         },
    //         {
    //             id: 'drycleaning',
    //             name: 'Химчистка',
    //             services: [
    //                 {
    //                     id: 'clothes-cleaning',
    //                     name: 'Химчистка и стирка одежды',
    //                     basePrice: 2000,
    //                     duration: 120,
    //                     backgroundColor: 'bg-slate-50 dark:bg-slate-800/60',
    //                     icon: 'Shirt'
    //                 },
    //                 {
    //                     id: 'carpet-cleaning',
    //                     name: 'Чистка ковров',
    //                     basePrice: 2500,
    //                     duration: 60,
    //                     backgroundColor: 'bg-orange-50 dark:bg-orange-900/30',
    //                     icon: 'Grid2x2'
    //                 },
    //                 {
    //                     id: 'furniture-cleaning',
    //                     name: 'Химчистка мебели',
    //                     basePrice: 3500,
    //                     duration: 90,
    //                     backgroundColor: 'bg-purple-50 dark:bg-purple-900/30',
    //                     icon: 'Sofa'
    //                 },
    //                 {
    //                     id: 'shoe-cleaning',
    //                     name: 'Чистка и ремонт обуви',
    //                     basePrice: 1500,
    //                     duration: 45,
    //                     backgroundColor: 'bg-red-50 dark:bg-red-900/30',
    //                     icon: 'Footprints'
    //                 }
    //             ],
    //             options: [
    //                 {
    //                     id: 'express',
    //                     name: 'Срочная чистка',
    //                     price: 500,
    //                     duration: 30,
    //                     isPopular: true,
    //                     description: 'Выполнение заказа в течение 24 часов'
    //                 },
    //                 {
    //                     id: 'stains',
    //                     name: 'Выведение пятен',
    //                     price: 300,
    //                     duration: 20,
    //                     isPopular: true,
    //                     description: 'Удаление сложных загрязнений'
    //                 },
    //                 {
    //                     id: 'deodorization',
    //                     name: 'Дезодорация',
    //                     price: 400,
    //                     duration: 15,
    //                     description: 'Устранение неприятных запахов'
    //                 },
    //                 {
    //                     id: 'stain-protection',
    //                     name: 'Защитное покрытие',
    //                     price: 600,
    //                     duration: 25,
    //                     isPopular: true,
    //                     description: 'Нанесение защиты от загрязнений'
    //                 },
    //                 {
    //                     id: 'deep-cleaning',
    //                     name: 'Глубокая чистка',
    //                     price: 800,
    //                     duration: 45,
    //                     isPopular: true,
    //                     description: 'Тщательная очистка всех слоев'
    //                 },
    //                 {
    //                     id: 'allergen-removal',
    //                     name: 'Удаление аллергенов',
    //                     price: 500,
    //                     duration: 30,
    //                     description: 'Специальная обработка против аллергенов'
    //                 }
    //             ]
    //         }
    //     ]
    //
    //     return SERVICES_DATA;
    // }
}

import {Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query} from '@nestjs/common';
import {AppService} from './app.service';

export type ServiceType = 'cleaning' | 'drycleaning'

export type Service = {
    id: string
    name: string
    basePrice: number
    duration: number // в минутах
    backgroundColor?: string
    icon?: string
    type?: ServiceType
}

export type ServiceOption = {
    id: string
    name: string
    price: number
    duration: number // в минутах
    description?: string
    isPopular?: boolean
}

export type ServiceCategory = {
    id: string
    name: string
    services: Service[]
    options: ServiceOption[]
}

@Controller()
export class AppController {

    private _addresses: any[] = [];

    private readonly _orders: any[] = [
        {
            id: Date.now(),
            status: 'active',
            serviceName: 'Доставка',
            totalPrice: 1250,
            fullAddress: 'Москва, Ходынский бульвар, 2',
            date: Date.now()
        },
        {
            id: Date.now(),
            status: 'completed',
            serviceName: 'Доставка',
            totalPrice: 1250,
            fullAddress: 'Москва, Ходынский бульвар, 2',
            date: Date.now()
        },
        {
            id: Date.now(),
            status: 'completed',
            serviceName: 'Доставка',
            totalPrice: 1250,
            fullAddress: 'Москва, Ходынский бульвар, 2',
            date: Date.now()
        },
        {
            id: Date.now(),
            status: 'completed',
            serviceName: 'Доставка',
            totalPrice: 1250,
            fullAddress: 'Москва, Ходынский бульвар, 2',
            date: Date.now()
        },
        {
            id: Date.now(),
            status: 'completed',
            serviceName: 'Доставка',
            totalPrice: 1250,
            fullAddress: 'Москва, Ходынский бульвар, 2',
            date: Date.now()
        },
        {
            id: Date.now(),
            status: 'completed',
            serviceName: 'Доставка',
            totalPrice: 1250,
            fullAddress: 'Москва, Ходынский бульвар, 2',
            date: Date.now()
        }
    ];


    constructor(private readonly appService: AppService) {
    }

    @Get('version')
    getVersion() {
        return {
            version: process.env.npm_package_version,
            commit: process.env.COMMIT_HASH,
            buildDate: process.env.BUILD_DATE
        };
    }

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }

    @Get('/addresses')
    getAddresses(@Query() {userId}: { userId?: number }) {
        if (!userId) {
            return this._addresses;
        }
        return this._addresses.filter(o => o.userId?.toString() === userId?.toString());
    }

    @Post('/addresses')
    addAddress(@Body() body: any): any {
        this._addresses.push({
            ...body,
            id: Date.now()
        })

        return body;
    }

    @Put('/addresses/:id')
    editAddress(@Param('id') id: number, @Body() body: any): any {
        const existAddress = this._addresses.find(o => o.id?.toString() === id?.toString() && o.userId?.toString() === body?.userId?.toString());
        if (!existAddress) {
            return new NotFoundException();
        }
        Object.assign(existAddress, body);

        return existAddress;
    }

    @Delete('/addresses/:id')
    deleteAddress(@Param('id') id: number): any {
        this._addresses = this._addresses.filter(o => o.id?.toString() !== id?.toString())
    }

    @Get('/orders')
    getOrders(@Query() {userId}: { userId?: number }) {
        if (!userId) {
            return this._orders;
        }
        return this._orders.filter(o => o.userId?.toString() === userId?.toString());
    }

    @Get('/orders/:id')
    getOrderById(@Param('id') id: number, @Query() {userId}: { userId?: number }) {
        const existOrder = this._orders.find(o => o.id?.toString() === id?.toString() && o.userId?.toString() === userId?.toString());
        if (!existOrder) {
            return new NotFoundException();
        }

        return existOrder;
    }

    @Put('/orders/:id')
    editOrder(@Param('id') id: number, @Body() body: any): any {
        const existOrder = this._orders.find(o => o.id?.toString() === id?.toString() && o.userId?.toString() === body?.userId?.toString());
        if (!existOrder) {
            return new NotFoundException();
        }
        Object.assign(existOrder, body);

        return existOrder;
    }

    @Post('/orders')
    addOrder(@Body() body) {

        this._orders.push({
            ...body,
            id: Date.now(),
            status: 'active',
        })

        return body;
    }

    @Get('/services')
    getServices() {
        const SERVICES_DATA: ServiceCategory[] = [
            {
                id: 'cleaning',
                name: 'Уборка',
                services: [
                    {
                        id: 'regular-cleaning',
                        name: 'Поддерживающая',
                        basePrice: 3000,
                        duration: 120,
                        backgroundColor: 'bg-green-50 dark:bg-green-900/30',
                        icon: 'Sparkles'
                    },
                    {
                        id: 'general-cleaning',
                        name: 'Генеральная',
                        basePrice: 5000,
                        duration: 240,
                        backgroundColor: 'bg-slate-100 dark:bg-slate-800/60',
                        icon: 'Brush'
                    },
                    {
                        id: 'after-repair',
                        name: 'После ремонта',
                        basePrice: 6000,
                        duration: 300,
                        backgroundColor: 'bg-orange-50 dark:bg-orange-900/30',
                        icon: 'Hammer'
                    },
                    {
                        id: 'cottage',
                        name: 'Уборка коттеджей',
                        basePrice: 8000,
                        duration: 180,
                        backgroundColor: 'bg-blue-50 dark:bg-blue-900/30',
                        icon: 'Home'
                    },
                    {
                        id: 'commercial',
                        name: 'Коммерческие помещения',
                        basePrice: 10000,
                        duration: 240,
                        backgroundColor: 'bg-purple-50 dark:bg-purple-900/30',
                        icon: 'Building2'
                    }
                ],
                options: [
                    {
                        id: 'windows',
                        name: 'Мытье окон',
                        price: 500,
                        duration: 30,
                        isPopular: true
                    },
                    {
                        id: 'ironing',
                        name: 'Глажка белья',
                        price: 700,
                        duration: 45,
                        isPopular: true
                    },
                    {
                        id: 'fridge',
                        name: 'Уборка холодильника',
                        price: 300,
                        duration: 15
                    },
                    {
                        id: 'cat-litter',
                        name: 'Уборка кошачьего лотка',
                        price: 200,
                        duration: 15
                    },
                    {
                        id: 'balcony',
                        name: 'Уборка балкона',
                        price: 800,
                        duration: 45
                    }
                ]
            },
            {
                id: 'drycleaning',
                name: 'Химчистка',
                services: [
                    {
                        id: 'clothes-cleaning',
                        name: 'Химчистка и стирка одежды',
                        basePrice: 2000,
                        duration: 120,
                        backgroundColor: 'bg-slate-50 dark:bg-slate-800/60',
                        icon: 'Shirt'
                    },
                    {
                        id: 'carpet-cleaning',
                        name: 'Чистка ковров',
                        basePrice: 2500,
                        duration: 60,
                        backgroundColor: 'bg-orange-50 dark:bg-orange-900/30',
                        icon: 'Grid2x2'
                    },
                    {
                        id: 'furniture-cleaning',
                        name: 'Химчистка мебели',
                        basePrice: 3500,
                        duration: 90,
                        backgroundColor: 'bg-purple-50 dark:bg-purple-900/30',
                        icon: 'Sofa'
                    },
                    {
                        id: 'shoe-cleaning',
                        name: 'Чистка и ремонт обуви',
                        basePrice: 1500,
                        duration: 45,
                        backgroundColor: 'bg-red-50 dark:bg-red-900/30',
                        icon: 'Footprints'
                    }
                ],
                options: [
                    {
                        id: 'express',
                        name: 'Срочная чистка',
                        price: 500,
                        duration: 30,
                        isPopular: true,
                        description: 'Выполнение заказа в течение 24 часов'
                    },
                    {
                        id: 'stains',
                        name: 'Выведение пятен',
                        price: 300,
                        duration: 20,
                        isPopular: true,
                        description: 'Удаление сложных загрязнений'
                    },
                    {
                        id: 'deodorization',
                        name: 'Дезодорация',
                        price: 400,
                        duration: 15,
                        description: 'Устранение неприятных запахов'
                    },
                    {
                        id: 'stain-protection',
                        name: 'Защитное покрытие',
                        price: 600,
                        duration: 25,
                        isPopular: true,
                        description: 'Нанесение защиты от загрязнений'
                    },
                    {
                        id: 'deep-cleaning',
                        name: 'Глубокая чистка',
                        price: 800,
                        duration: 45,
                        isPopular: true,
                        description: 'Тщательная очистка всех слоев'
                    },
                    {
                        id: 'allergen-removal',
                        name: 'Удаление аллергенов',
                        price: 500,
                        duration: 30,
                        description: 'Специальная обработка против аллергенов'
                    }
                ]
            }
        ]

        return SERVICES_DATA;
    }
}

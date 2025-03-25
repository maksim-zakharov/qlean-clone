export type ServiceType = 'cleaning' | 'drycleaning'

export type Service = {
  id: string
  name: string
  basePrice: number
  backgroundColor?: string
  icon?: string
  type?: ServiceType
}

export type ServiceOption = {
  id: string
  name: string
  price: number
  description?: string
  isPopular?: boolean
}

export type ServiceTab = {
  id: string
  name: string
  services: Service[]
}

export const CLEANING_TABS: ServiceTab[] = [
  {
    id: 'regular',
    name: 'Поддерживающая',
    services: [
      {
        id: 'regular-cleaning',
        type: 'cleaning',
        name: 'Поддерживающая',
        basePrice: 3000
      }
    ]
  },
  {
    id: 'general',
    name: 'Генеральная',
    services: [
      {
        id: 'general-cleaning',
        type: 'cleaning',
        name: 'Генеральная',
        basePrice: 5000
      }
    ]
  },
  {
    id: 'after-repair',
    name: 'После ремонта',
    services: [
      {
        id: 'after-repair',
        type: 'cleaning',
        name: 'После ремонта',
        basePrice: 6000
      }
    ]
  },
  {
    id: 'cottage',
    name: 'Уборка коттеджей',
    services: [
      {
        id: 'cottage',
        type: 'cleaning',
        name: 'Уборка коттеджей',
        basePrice: 8000
      }
    ]
  },
  {
    id: 'commercial',
    name: 'Коммерческие помещения',
    services: [
      {
        id: 'commercial',
        type: 'cleaning',
        name: 'Коммерческие помещения',
        basePrice: 10000
      }
    ]
  }
]

export const DRYCLEANING_TABS: ServiceTab[] = [
  {
    id: 'clothes',
    name: 'Одежда',
    services: [
      {
        id: 'clothes-cleaning',
        type: 'drycleaning',
        name: 'Химчистка и стирка одежды',
        basePrice: 2000
      }
    ]
  },
  {
    id: 'furniture',
    name: 'Мебель',
    services: [
      {
        id: 'furniture-cleaning',
        type: 'drycleaning',
        name: 'Химчистка мебели',
        basePrice: 3500
      }
    ]
  },
  {
    id: 'carpet',
    name: 'Ковры',
    services: [
      {
        id: 'carpet-cleaning',
        type: 'drycleaning',
        name: 'Чистка ковров',
        basePrice: 2500
      }
    ]
  },
  {
    id: 'shoes',
    name: 'Обувь',
    services: [
      {
        id: 'shoe-cleaning',
        type: 'drycleaning',
        name: 'Чистка и ремонт обуви',
        basePrice: 1500
      }
    ]
  }
]

export const SERVICE_OPTIONS: Record<ServiceType, ServiceOption[]> = {
  'cleaning': [
    {
      id: 'windows',
      name: 'Мытье окон',
      price: 500,
      isPopular: true
    },
    {
      id: 'ironing',
      name: 'Глажка белья',
      price: 700,
      isPopular: true
    },
    {
      id: 'fridge',
      name: 'Уборка холодильника',
      price: 300
    },
    {
      id: 'cat-litter',
      name: 'Уборка кошачьего лотка',
      price: 200
    },
    {
      id: 'balcony',
      name: 'Уборка балкона',
      price: 800
    },
    {
      id: 'dust-removal',
      name: 'Удаление пыли',
      price: 1000,
      isPopular: true
    },
    {
      id: 'territory',
      name: 'Уборка территории',
      price: 1500,
      isPopular: true
    }
  ],
  'drycleaning': [
    {
      id: 'express',
      name: 'Срочная чистка',
      price: 500,
      isPopular: true,
      description: 'Выполнение заказа в течение 24 часов'
    },
    {
      id: 'stains',
      name: 'Выведение пятен',
      price: 300,
      isPopular: true,
      description: 'Удаление сложных загрязнений'
    },
    {
      id: 'deodorization',
      name: 'Дезодорация',
      price: 400,
      description: 'Устранение неприятных запахов'
    },
    {
      id: 'stain-protection',
      name: 'Защитное покрытие',
      price: 600,
      isPopular: true,
      description: 'Нанесение защиты от загрязнений'
    },
    {
      id: 'deep-cleaning',
      name: 'Глубокая чистка',
      price: 800,
      isPopular: true,
      description: 'Тщательная очистка всех слоев'
    },
    {
      id: 'allergen-removal',
      name: 'Удаление аллергенов',
      price: 500,
      description: 'Специальная обработка против аллергенов'
    },
    {
      id: 'sole-repair',
      name: 'Ремонт подошвы',
      price: 600,
      description: 'Замена или ремонт подошвы обуви'
    },
    {
      id: 'polishing',
      name: 'Полировка',
      price: 300,
      description: 'Восстановление внешнего вида'
    }
  ]
}

export type ServiceCategory = {
  id: string
  name: string
  services: Service[]
  options: ServiceOption[]
}

export const SERVICES_DATA: ServiceCategory[] = [
  {
    id: 'cleaning',
    name: 'Уборка',
    services: [
      {
        id: 'regular-cleaning',
        name: 'Поддерживающая',
        basePrice: 3000,
        backgroundColor: 'bg-green-50 dark:bg-green-900/30',
        icon: 'Sparkles'
      },
      {
        id: 'general-cleaning',
        name: 'Генеральная',
        basePrice: 5000,
        backgroundColor: 'bg-slate-100 dark:bg-slate-800/60',
        icon: 'Brush'
      },
      {
        id: 'after-repair',
        name: 'После ремонта',
        basePrice: 6000,
        backgroundColor: 'bg-orange-50 dark:bg-orange-900/30',
        icon: 'Hammer'
      },
      {
        id: 'cottage',
        name: 'Уборка коттеджей',
        basePrice: 8000,
        backgroundColor: 'bg-blue-50 dark:bg-blue-900/30',
        icon: 'Home'
      },
      {
        id: 'commercial',
        name: 'Коммерческие помещения',
        basePrice: 10000,
        backgroundColor: 'bg-purple-50 dark:bg-purple-900/30',
        icon: 'Building2'
      }
    ],
    options: [
      {
        id: 'windows',
        name: 'Мытье окон',
        price: 500,
        isPopular: true
      },
      {
        id: 'ironing',
        name: 'Глажка белья',
        price: 700,
        isPopular: true
      },
      {
        id: 'fridge',
        name: 'Уборка холодильника',
        price: 300
      },
      {
        id: 'cat-litter',
        name: 'Уборка кошачьего лотка',
        price: 200
      },
      {
        id: 'balcony',
        name: 'Уборка балкона',
        price: 800
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
        backgroundColor: 'bg-slate-50 dark:bg-slate-800/60',
        icon: 'Shirt'
      },
      {
        id: 'carpet-cleaning',
        name: 'Чистка ковров',
        basePrice: 2500,
        backgroundColor: 'bg-orange-50 dark:bg-orange-900/30',
        icon: 'Grid2x2'
      },
      {
        id: 'furniture-cleaning',
        name: 'Химчистка мебели',
        basePrice: 3500,
        backgroundColor: 'bg-purple-50 dark:bg-purple-900/30',
        icon: 'Sofa'
      },
      {
        id: 'shoe-cleaning',
        name: 'Чистка и ремонт обуви',
        basePrice: 1500,
        backgroundColor: 'bg-red-50 dark:bg-red-900/30',
        icon: 'Footprints'
      }
    ],
    options: [
      {
        id: 'express',
        name: 'Срочная чистка',
        price: 500,
        isPopular: true,
        description: 'Выполнение заказа в течение 24 часов'
      },
      {
        id: 'stains',
        name: 'Выведение пятен',
        price: 300,
        isPopular: true,
        description: 'Удаление сложных загрязнений'
      },
      {
        id: 'deodorization',
        name: 'Дезодорация',
        price: 400,
        description: 'Устранение неприятных запахов'
      },
      {
        id: 'stain-protection',
        name: 'Защитное покрытие',
        price: 600,
        isPopular: true,
        description: 'Нанесение защиты от загрязнений'
      },
      {
        id: 'deep-cleaning',
        name: 'Глубокая чистка',
        price: 800,
        isPopular: true,
        description: 'Тщательная очистка всех слоев'
      },
      {
        id: 'allergen-removal',
        name: 'Удаление аллергенов',
        price: 500,
        description: 'Специальная обработка против аллергенов'
      }
    ]
  }
] 
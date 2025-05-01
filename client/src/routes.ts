type RouteParams = Record<string, string | number>;

const buildPath = (path: string, params?: RouteParams) => {
    if (!params) return path;

    return Object.entries(params).reduce(
        (acc, [key, value]) => acc.replace(`:${key}`, String(value)),
        path
    );
};

export const RoutePaths = {
    Root: '/',
    Orders: '/orders',
    Bonuses: '/bonuses',
    Profile: '/profile',
    Application: '/application',
    Order: {
        Create: '/order',
        Checkout: '/order/checkout',
        Details: (id: string | number) => buildPath('/order/:id', { id }),
    },
    Executor: {
        Orders: '/executor/orders',
        Details: (id: string | number) => buildPath('/executor/orders/:id', { id }),
        Payments: '/executor/payments',
        Schedule: '/executor/schedule',
        Profile: '/executor/profile',
    }
} as const;
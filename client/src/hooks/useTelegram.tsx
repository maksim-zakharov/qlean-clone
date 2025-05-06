import {createContext, ReactNode, useCallback, useContext, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {RoutePaths} from "../routes.ts";

export const safeTgHeight =
    window.innerHeight -
    Telegram.WebApp?.contentSafeAreaInset.bottom -
    Telegram.WebApp?.contentSafeAreaInset.top;

Telegram.WebApp?.ready();

interface TelegramContextType {
    isReady: boolean;
    error?: string;
    tg: typeof Telegram.WebApp;
    isOpenKeyboard: boolean;
    bottomOffset: number;
    photoUrl?: string;
    vibro: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    colorScheme?: string;
    backButton: BackButton | null;
    user: TelegramUser | null;
    userId?: number;
}

interface TelegramUser {
    id?: number;
    photo_url?: string;
    // добавьте другие необходимые свойства пользователя
}

interface TelegramProviderProps {
    children: ReactNode;
}

const TelegramContext = createContext<TelegramContextType | undefined>(undefined);

export const TelegramProvider = ({children}: TelegramProviderProps) => {
    const navigate = useNavigate();
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState<string>();
    const [isOpenKeyboard, setOpenKeyboard] = useState(false);
    const [bottomOffset, setBottomOffset] = useState(0);

    const isReady = (!isLoading && !error);

    const onThemeChangedHandler = useCallback(() => {
        const colorScheme = Telegram.WebApp?.colorScheme;
        if (colorScheme === 'dark') {
            document.documentElement.classList.add('dark');
            Telegram.WebApp.setHeaderColor(
                getComputedStyle(document.documentElement)
                    .getPropertyValue('--tg-theme-bg-color')
                    .trim()
            );
        } else {
            document.documentElement.classList.remove('dark');
            Telegram.WebApp.setHeaderColor(
                getComputedStyle(document.documentElement)
                    .getPropertyValue('--tg-theme-secondary-bg-color')
                    .trim()
            );
        }
    }, []);

    const vibro = useCallback((style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'medium') => {
        Telegram.WebApp.HapticFeedback?.impactOccurred(style);
    }, []);

    const onKeyboard = useCallback(() => {
        const offset = safeTgHeight - Telegram.WebApp?.viewportHeight;
        setOpenKeyboard(offset > 200);
        setBottomOffset(offset);
    }, []);

    useEffect(() => {
        Telegram.WebApp?.ready();
    }, []);

    useEffect(() => {
        let tryies = 0;
        const check = () => {
            tryies++;
            if (Telegram.WebApp?.themeParams?.bg_color) {
                setLoading(false);
                return;
            }
            if (tryies > 30) {
                setLoading(false);
                setError('Telegram.WebApp not found');
                return;
            }
            setTimeout(check, 100);
        };

        check();
    }, []);

    useEffect(() => {
        if (!isReady) return;

        Telegram.WebApp.onEvent('themeChanged', onThemeChangedHandler);
        onThemeChangedHandler();

        Telegram.WebApp.SettingsButton.onClick(() => navigate(RoutePaths.Profile));
        Telegram.WebApp.SettingsButton.show();

        return () => {
            Telegram.WebApp.offEvent('themeChanged', onThemeChangedHandler);
        };
    }, [isReady, navigate, onThemeChangedHandler]);

    useEffect(() => {
        Telegram.WebApp.onEvent('viewportChanged', onKeyboard);
        return () => {
            Telegram.WebApp.offEvent('viewportChanged', onKeyboard);
        };
    }, [onKeyboard]);

    const value = {
        isReady,
        error,
        tg: Telegram.WebApp,
        isOpenKeyboard,
        bottomOffset,
        photoUrl: Telegram.WebApp?.initDataUnsafe?.user?.photo_url,
        vibro,
        colorScheme: Telegram.WebApp?.colorScheme,
        backButton: Telegram.WebApp?.BackButton as BackButton ?? null,
        user: Telegram.WebApp?.initDataUnsafe?.user ?? null,
        userId: Telegram.WebApp?.initDataUnsafe?.user?.id,
    };

    return (
        <TelegramContext.Provider value={value}>
            {children}
        </TelegramContext.Provider>
    );
};

export function useTelegram() {
    const context = useContext(TelegramContext);
    if (!context) {
        throw new Error('useTelegram must be used within a TelegramProvider');
    }
    return context;
}

interface BackButton {
    isVisible: boolean;
    onClick: (callback: () => void) => BackButton;
    offClick: (callback: () => void) => BackButton;
    show: () => BackButton;
    hide: () => BackButton;
}
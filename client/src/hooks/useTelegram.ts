import {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";

export const safeTgHeight =
    window.innerHeight -
    Telegram.WebApp?.contentSafeAreaInset.bottom -
    Telegram.WebApp?.contentSafeAreaInset.top;


Telegram.WebApp?.ready();

export function useTelegram() {
    const navigate = useNavigate()
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState<string>();
    const [isOpenKeyboard, setOpenKeyboard] = useState(false);
    const [bottomOffset, setBottomOffset] = useState(0);

    const isReady = !isLoading && !Boolean(error);

    const onThemeChangedHandler = () => {
        Telegram.WebApp.setHeaderColor(getComputedStyle(document.documentElement).getPropertyValue('--tg-theme-secondary-bg-color').trim());
        // Устанавливаем тему в соответствии с Telegram
        if (colorScheme === 'dark') {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }

    useEffect(() => {
        if (!isReady) {
            return;
        }

        Telegram.WebApp.onEvent('themeChanged', onThemeChangedHandler)

        onThemeChangedHandler();

        Telegram.WebApp.SettingsButton.onClick(() => navigate('/profile'))
        Telegram.WebApp.SettingsButton.show();
    }, [isReady]);

    const vibro = (
        style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'medium'
    ) => {
        Telegram.WebApp.HapticFeedback?.impactOccurred(style);
    };

    const userId = Telegram.WebApp?.initDataUnsafe?.user?.id;
    const photoUrl = Telegram.WebApp?.initDataUnsafe?.user?.photo_url; //  || 'https://t.me/i/userpic/320/cm409T17pD0hEWX5m_tmMBGNTbHnhP0b6tZG6o887b0.svg';
    const colorScheme = Telegram.WebApp?.colorScheme;

    function onKeyboard() {
        // Вычисляем величину сдвига нижней границы
        const offset = safeTgHeight - Telegram.WebApp?.viewportHeight;

        // Определяем, открыта ли клавиатура
        const isKeyboardOpen = offset > 200;

        setOpenKeyboard(isKeyboardOpen);
        setBottomOffset(offset);
    }

    let tryies = 0;
    useEffect(() => {
        const check = () => {
            tryies++;
            if (Telegram.WebApp && Telegram.WebApp?.themeParams && Telegram.WebApp?.themeParams.bg_color) {
                setLoading(false);
                // localStorage.setItem('Telegram.WebApp?', JSON.stringify(Telegram.WebApp?));
                return;
            }
            if (tryies > 30) {
                setLoading(false);
                setError('Telegram.WebApp? not found');
                return;
            }
            setTimeout(check, 100);
        };

        check();

        // Чистка эффекта
        return () => {
            tryies = 0; // Сбросить количество попыток при размонтировании
        };
    }, [Telegram.WebApp]);

    useEffect(() => {
        Telegram.WebApp.onEvent('viewportChanged', onKeyboard);

        return () => {
            Telegram.WebApp.offEvent('viewportChanged', onKeyboard); // Очистка при размонтировании
        };
    }, []);

    return {
        isLoading,
        error,
        tg: Telegram.WebApp,
        isOpenKeyboard,
        bottomOffset,
        photoUrl,
        vibro,
        colorScheme,
        backButton: Telegram.WebApp ? (Telegram.WebApp?.BackButton as BackButton) : null,
        user: Telegram.WebApp ? Telegram.WebApp?.initDataUnsafe?.user : null,
        userId,
    };
}

interface BackButton {
    isVisible: boolean;
    onClick: (callback: () => void) => BackButton;
    offClick: (callback: () => void) => BackButton;
    show: () => BackButton;
    hide: () => BackButton;
}
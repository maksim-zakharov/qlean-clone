import { useEffect, useState } from 'react';

export const safeTgHeight =
    window.innerHeight -
    Telegram.WebApp?.contentSafeAreaInset.bottom -
    Telegram.WebApp?.contentSafeAreaInset.top;


Telegram.WebApp?.ready();

export function useTelegram() {
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState<string>();
    const [isOpenKeyboard, setOpenKeyboard] = useState(false);
    const [bottomOffset, setBottomOffset] = useState(0);

    const vibro = (
        style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'medium'
    ) => {
        Telegram.WebApp.HapticFeedback?.impactOccurred(style);
    };

    const userId = Telegram.WebApp?.initDataUnsafe?.user?.id.toString();
    const photoUrl = Telegram.WebApp?.initDataUnsafe?.user?.photo_url;

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
            if (Telegram.WebApp? && Telegram.WebApp?.themeParams && Telegram.WebApp?.themeParams.bg_color) {
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
    }, []);

    useEffect(() => {
        Telegram.WebApp.onEvent('viewportChanged', onKeyboard);

        return () => {
            Telegram.WebApp.offEvent('viewportChanged', onKeyboard); // Очистка при размонтировании
        };
    }, []);

    return {
        isLoading,
        error,
        Telegram.WebApp?,
        isOpenKeyboard,
        bottomOffset,
        photoUrl,
        vibro,
        backButton: Telegram.WebApp? ? (Telegram.WebApp?.BackButton as BackButton) : null,
        user: Telegram.WebApp? ? Telegram.WebApp?.initDataUnsafe?.user : null,
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

export interface TelegramUser {
    id: number;
    is_bot?: boolean;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
    is_premium?: true;
    added_to_attachment_menu?: true;
    allows_write_to_pm?: true;
    photo_url?: string;
}
import {Injectable} from '@nestjs/common';
import {UserService} from "../user/user.service";
import {createHmac} from 'crypto';
import * as process from "node:process";
import {JwtService} from "@nestjs/jwt";

export function validateInitData(initData: string) {

    // 1. Получаем секретный ключ
    const secret_key = HMAC_SHA256(process.env.TELEGRAM_BOT_TOKEN, 'WebAppData')

    // 2. Извлекаем параметры
    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    params.delete('hash');

    // 3. Сортируем параметры
    const dataCheckString = Array.from(params.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, val]) => `${key}=${val}`)
        .join('\n');

    function HMAC_SHA256(value, key) {
        return createHmac('sha256', key).update(value).digest()
    }

    function hex(bytes) {
        return bytes.toString('hex');
    }

    // 4. Вычисляем хеш
    const hashGenerate = hex(HMAC_SHA256(dataCheckString, secret_key))

    // Return bool value is valid
    return Boolean(hashGenerate === hash)
}

@Injectable()
export class AuthService {

    constructor(private jwtService: JwtService, private userService: UserService) {
    }

    async validateUser(telegramProfile: any) {
        let user = await this.userService.getById(telegramProfile.id.toString());

        if (!user) {
            user = await this.userService.create(telegramProfile);
        }

        return user;
    }

    async login(user: any) {
        return {
            access_token: this.jwtService.sign(user)
        };
    }
}

import {Controller, Get, Req, UseGuards, Headers, UnauthorizedException} from '@nestjs/common';
import {AuthGuard} from "@nestjs/passport";
import {AuthService, validateInitData} from "./auth.service";

@Controller('/api/auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {
    }

    @Get('/login')
    async login(@Headers() headers) {
        const initData = headers['telegram-init-data'] as string;

        if (!validateInitData(initData)) {
            throw new UnauthorizedException({ message: 'Invalid Telegram data' });
        }

        const params = new URLSearchParams(initData);
        const userData = JSON.parse(decodeURIComponent(params.get('user')));

        const user = await this.authService.validateUser(userData);

        return this.authService.login(user);
    }

    @Get('/userinfo')
    @UseGuards(AuthGuard('jwt'))
    async getUserInfo(@Req() req) {
        return req.user;
    }
}

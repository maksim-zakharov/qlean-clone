import {Body, Controller, Get, Headers, Patch, Req, UnauthorizedException, UseGuards} from '@nestjs/common';
import {AuthGuard} from "@nestjs/passport";
import {AuthService, validateInitData} from "./auth.service";
import {User} from "@prisma/client";
import {UserService} from "../user/user.service";
import {Telegraf} from "telegraf";

@Controller('/api/auth')
export class AuthController {

    constructor(private readonly bot: Telegraf, private readonly authService: AuthService, private readonly userService: UserService) {
        bot.on('contact', async (ctx) => {
            const contact = ctx.message.contact;

            // Проверка, что контакт принадлежит отправителю
            if (contact.user_id === ctx.from.id) {
                const phone = contact.phone_number;
                const item = await this.userService.getById(BigInt(ctx.from.id));

                item.phone = phone;

                // Действия с номером (сохранение в БД и т.д.)
                await this.userService.update(item);
            } else {
                ctx.reply('Это не ваш номер!');
            }
        });
    }

    @Get('/login')
    async login(@Headers() headers) {
        const initData = headers['telegram-init-data'] as string;

        if (!validateInitData(initData)) {
            throw new UnauthorizedException({message: 'Invalid Telegram data'});
        }

        const params = new URLSearchParams(initData);
        const userData = JSON.parse(decodeURIComponent(params.get('user')));

        const user = await this.authService.validateUser(userData);

        return this.authService.login(user);
    }

    // @Patch('/phone')
    // @UseGuards(AuthGuard('jwt'))
    // async patchPhone(@Req() req, @Body() body: User) {
    //     const item = await this.userService.getById(req.user.id);
    //
    //     if (body.phone)
    //         item.phone = body.phone;
    //
    //     await this.userService.update(item);
    // }

    @Get('/userinfo')
    @UseGuards(AuthGuard('jwt'))
    async getUserInfo(@Req() req) {
        return req.user;
    }
}

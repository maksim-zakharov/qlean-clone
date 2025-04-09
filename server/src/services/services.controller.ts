import {Controller, Get, Logger, OnModuleInit, UseInterceptors} from '@nestjs/common';
import {ServicesService} from "./services.service";
import {CacheInterceptor, CacheKey, CacheTTL} from "@nestjs/cache-manager";
import {Context, Markup, Telegraf} from "telegraf";
import {PrismaService} from "../prisma.service";
import {OpenaiService} from "../openai/openai.service";
import * as process from "node:process";

@Controller('/api/services')
@UseInterceptors(CacheInterceptor) // Добавляем интерсептор
export class ServicesController implements OnModuleInit {
    private logger = new Logger(ServicesController.name);
    private keywordCache: Map<string, number> = new Map();

    constructor(
        private readonly prisma: PrismaService,
        private readonly bot: Telegraf,
        private readonly servicesService: ServicesService,
        private readonly openaiService: OpenaiService
    ) {
        this.bot.on('text', this.handleMessage.bind(this));
    }

    async onModuleInit() {
        // await this.refreshCache();
        // setInterval(() => this.refreshCache(), 300_000);
    }

    private async refreshCache() {
        const keywords = await this.prisma.keyword.findMany({
            select: {value: true, serviceId: true}
        });

        this.keywordCache.clear();
        keywords.forEach(kw => {
            this.keywordCache.set(kw.value.toLowerCase(), kw.serviceId);
        });
    }

    async handleMessage(ctx: Context) {
        try {
            const message = (ctx.message as any)?.text;
            if (!message) return;
            console.log(message)

            // Получаем ID сообщения для ответа
            const replyToId = message.message_id;

            // Проверка ключевых слов
            const keywords: any[] = await this.prisma.keyword.findMany();
            const foundKeyword = keywords.find(kw =>
                message.toLowerCase().includes(kw.value.toLowerCase())
            );

            let service = foundKeyword?.service;
            console.log(service?.name)

            if (!service) {
                service = await this.openaiService.detectBaseService(message);
            }
            console.log(service?.name)

            // 2. Определяем ServiceVariant через ChatGPT
            const variant = await this.openaiService.detectServiceVariant(message, service.variants);
            // if (!variant) {
            //     await ctx.reply("Не удалось определить конкретный тип услуги, уточните пожалуйста");
            //     return;
            // }

            if (!variant) {
                this.logger.warn(`No variants found for service ${service.id}`);
                return;
            }

            await ctx.replyWithMarkdown(
                `Привет! Мы нашли ${service.executors.length} исполнителей для ${variant.nameAccusative}.`,
                {
                    // Ответ на конкретное сообщение
                    reply_parameters: {
                        message_id: replyToId
                    },
                    reply_markup: {
                        inline_keyboard: [
                            [Markup.button.url('Заказать', `https://t.me/qlean_clone_bot?startapp=service_${service.id}_variant_${variant.id}`)]
                        ]
                    }
                }
            );
        } catch (error) {
            console.error('Message handling error:', error);
        }
    }

    @Get('/')
    @CacheKey('SERVICES')
    @CacheTTL(3600 * 24)
    getAll() {
        return this.servicesService.getAll();
    }

    // @Post('/')
    // addAddress(@Body() {id, ...body}: Service): any {
    //     return this.servicesService.create(body);
    // }
    //
    // @Put('/:id')
    // editAddress(@Param('id') id: number, @Body() body: any): any {
    //     return this.servicesService.update(body);
    // }
    //
    // @Delete('/:id')
    // deleteAddress(@Param('id') id: number): any {
    //     return this.servicesService.delete(Number(id));
    // }
}

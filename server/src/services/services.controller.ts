import {Controller, Get, Logger, UseInterceptors} from '@nestjs/common';
import {ServicesService} from "./services.service";
import {CacheInterceptor, CacheKey, CacheTTL} from "@nestjs/cache-manager";
import {Context, Markup, Telegraf} from "telegraf";
import {PrismaService} from "../prisma.service";
import {OpenaiService} from "../openai/openai.service";
import {PorterStemmerRu} from 'natural';

@Controller('/api/services')
@UseInterceptors(CacheInterceptor)
export class ServicesController {
    private logger = new Logger(ServicesController.name);
    private keywordCache: Map<string, number> = new Map();

    constructor(
        private readonly prisma: PrismaService,
        private readonly bot: Telegraf,
        private readonly servicesService: ServicesService,
        private readonly openaiService: OpenaiService
    ) {
        // Обработчик кнопки "Не нужно, спасибо"
        bot.action('delete_message', async (ctx) => {
            try {
                await ctx.deleteMessage();
            } catch (error) {
                this.logger.error('Delete error:', error);
            }
        });
        this.bot.on('text', this.handleMessage.bind(this));
    }

    private normalizeText(text: string): string {
        return PorterStemmerRu.tokenizeAndStem(text)
            .join(' ')
            .replace(/[^а-яё\s]/gi, '');
    }

    async handleMessage(ctx: Context) {
        try {
            const text = (ctx.message as any)?.text;
            if (!text) return;

            // Получаем ID сообщения для ответа
            const replyToId = ctx.message.message_id;

            // Проверка ключевых слов
            const keywords: any[] = await this.prisma.keyword.findMany();
            const foundKeyword = keywords.find(kw =>
                this.normalizeText(text.toLowerCase()).includes(kw.value.toLowerCase())
            );

            let service;
            // Если найдено ключевое слово - идем в базу за сервисом
            if (foundKeyword?.serviceId) {
                service = await this.prisma.baseService.findUnique({
                    where: {id: foundKeyword.serviceId},
                    include: {
                        variants: true,
                        executors: true
                    }
                })
                this.logger.log(`Найдена услуга ${service?.name}`)
            }

            if (!service) {
                this.logger.log('Не нашли услугу по ключевому слову, идем в GPT')
                service = await this.openaiService.detectBaseService(text);
            }

            // 2. Определяем ServiceVariant через ChatGPT
            const {
                variant,
                displayName,
                keyPhrases
            } = await this.openaiService.detectServiceVariant(text, service.variants);

            this.logger.log(`Вариант: ${variant.name}, отображение: ${displayName}, найдено ${keyPhrases.length} фраз.`)
            if (keyPhrases.length) {
                await this.prisma.keyword.createMany({
                    data: keyPhrases.map(value => ({
                        value,
                        serviceId: service.id,
                        // variantId: detection.variantId
                    })),
                    skipDuplicates: true
                });
            }

            if (!variant) {
                this.logger.warn(`Нет вариантов для сервиса ${service.name}`);
                return;
            }

            await ctx.replyWithMarkdown(
                `Привет! Мы нашли ${service.executors.length} исполнителей для ${displayName}.`,
                {
                    // Ответ на конкретное сообщение
                    reply_parameters: {
                        message_id: replyToId
                    },
                    reply_markup: {
                        inline_keyboard: [
                            [Markup.button.url('🔍 Выбрать исполнителя', `https://t.me/qlean_clone_bot?startapp=service_${service.id}_variant_${variant.id}`)],
                            [
                                Markup.button.callback(
                                    '❌ Не нужно, спасибо',
                                    'delete_message'
                                )
                            ]
                        ]
                    }
                }
            );
        } catch (error) {
            this.logger.error('Message handling error:', error);
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

import {Controller, Post} from '@nestjs/common';
import {map} from "rxjs";

@Controller('openai-proxy')
export class OpenaiProxyController {
    constructor(
        private readonly httpService: HttpService,
        private readonly config: ConfigService
    ) {}

    @Post('*')
    async proxyOpenAI(
        @Body() body: any,
        @Headers('authorization') authHeader: string
    ) {
        const apiKey = this.config.get('OPENAI_API_KEY');
        const openaiUrl = 'https://api.openai.com/v1/' + this.getRequestPath();

        return this.httpService.post(
            openaiUrl,
            body,
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        ).pipe(
            map(response => response.data)
        );
    }

    private getRequestPath(): string {
        // Получаем путь из оригинального URL запроса
        const originalUrl = this.request.url;
        return originalUrl.replace('/openai-proxy/', '');
    }
}

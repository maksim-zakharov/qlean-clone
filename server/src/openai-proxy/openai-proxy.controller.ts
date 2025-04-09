import {Body, Controller, Post, Req, Headers} from '@nestjs/common';
import {map} from "rxjs";
import {HttpService} from "@nestjs/axios";
import * as process from "node:process";

@Controller('openai-proxy')
export class OpenaiProxyController {
    constructor(
        private readonly httpService: HttpService
    ) {}

    @Post('*')
    async proxyOpenAI(
        @Body() body: any,
        @Req() req,
        @Headers() headers
    ) {
        const authorization = headers['authorization'] as string;
        const apiKey = process.env.OPENAI_API_KEY;
        const openaiUrl = 'https://api.openai.com/v1/' + req.url.replace('/openai-proxy/', '');

        return this.httpService.post(
            openaiUrl,
            body,
            {
                headers: {
                    'Authorization': authorization || `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        ).pipe(
            map(response => response.data)
        );
    }
}

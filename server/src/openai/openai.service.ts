import {Injectable, Logger} from '@nestjs/common';
import OpenAI from "openai";
import {PrismaService} from "../prisma.service";

@Injectable()
export class OpenaiService {
    private logger = new Logger(OpenaiService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly openai: OpenAI
    ) {
    }

    async classifyService(text: string): Promise<string | null> {
        const services = await this.prisma.baseService.findMany({
            select: { name: true }
        });
        const serviceNames = services.map(s => s.name);
        try {
            const completion = await this.openai.chat.completions.create({
                messages: [{
                    role: "system",
                    content: `Определи услугу из списка: ${serviceNames.join(', ')}. Ответ только в JSON: {service: "название"}`
                }, {
                    role: "user",
                    content: text
                }],
                model: "gpt-3.5-turbo-0125",
                response_format: { type: "json_object" },
                max_tokens: 50
            });

            const result = JSON.parse(completion.choices[0].message.content);
            return serviceNames.includes(result.service) ? result.service : null;
        } catch (error) {
            this.logger.error(`OpenAI API error: ${error.message}`);
            return null;
        }
    }
}

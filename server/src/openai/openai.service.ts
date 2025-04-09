import {Injectable, Logger} from '@nestjs/common';
import OpenAI from "openai";
import {PrismaService} from "../prisma.service";
import {BaseService, ServiceVariant} from "@prisma/client";

@Injectable()
export class OpenaiService {
    private logger = new Logger(OpenaiService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly openai: OpenAI
    ) {
    }


    async detectBaseService(text: string): Promise<BaseService | null> {
        const services = await this.prisma.baseService.findMany({
            include: {executors: true, variants: true}
        });

        const prompt = `Определи основную услугу из списка: ${services.map(s => JSON.stringify({id: s.id, name: s.name})).join(', ')}. 
    Ответ в JSON: {serviceId: number}`;

        const result = await this.chatGptRequest(prompt, text);
        return services.find(s => s.id === result.serviceId);
    }

    async detectServiceVariant(text: string, variants: ServiceVariant[]): Promise<ServiceVariant | null> {
        const prompt = `Определи тип услуги из вариантов: ${variants.map(s => JSON.stringify({id: s.id, name: s.name})).join(', ')}. 
    Ответ в JSON: {variantId: number}`;

        const result = await this.chatGptRequest(prompt, text);
        return variants.find(v => v.id === result.variantId);
    }

    private async chatGptRequest(systemPrompt: string, userText: string): Promise<any> {
        try {
            const completion = await this.openai.chat.completions.create({
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userText }
                ],
                model: "gpt-3.5-turbo",
                response_format: { type: "json_object" }
            });

            return JSON.parse(completion.choices[0].message.content);
        } catch (error) {
            this.logger.error(`ChatGPT error: ${error.message}`);
            return null;
        }
    }
}

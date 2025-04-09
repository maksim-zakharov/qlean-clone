import {Injectable, Logger} from '@nestjs/common';
import OpenAI from "openai";
import {PrismaService} from "../prisma.service";
import {BaseService, ServiceVariant} from "@prisma/client";
import {BayesClassifier, PorterStemmerRu} from "natural";

@Injectable()
export class OpenaiService {
    private logger = new Logger(OpenaiService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly openai: OpenAI
    ) {
    }

    private normalizeText(text: string): string {
        return PorterStemmerRu.tokenizeAndStem(text)
            .join(' ')
            .replace(/[^а-яё\s]/gi, '');
    }

    async detectBaseService(text: string): Promise<BaseService | null> {
        const services = await this.prisma.baseService.findMany({
            include: {executors: true, variants: true}
        });

        const prompt = `Определи основную услугу из списка: ${services.map(s => JSON.stringify({
            id: s.id,
            name: s.name
        })).join(', ')}. 
    Ответ в JSON: {
        serviceId: number,
        matchedText: string // оригинальное найденное словосочетание из текста
    }`;

        const result = await this.chatGptRequest(prompt, text);
        return services.find(s => s.id === result?.serviceId);
    }

    async detectServiceVariant(text: string, variants: ServiceVariant[]): Promise<{
        variant: ServiceVariant | null,
        displayName?: string,
        keyPhrases: string[]
    }> {
        const prompt = `Определи тип услуги из вариантов: ${variants.map(s => JSON.stringify({
            id: s.id,
            name: s.name
        })).join(', ')}. 
    Ответ в JSON: {
    "variantId": number?,
    "displayName": string,
    "keyPhrases": string[] // основные фразы из текста, относящиеся к услуге
  }

  Правила:
  1. В keyPhrases - только фразы, напрямую связанные с конкретными услугами. Игнорируй общие слова: "контакты", "подскажите", "нужен" и т.д. Максимальная длина фразы - 3 слова. Приводи фразы к начальной форме.
  2. В displayName - всегда включай базовое название услуги в displayName.  Приводи фразы к родительному падежу, например "генеральной уборки квартиры"
  
  Примеры:
  Текст: "Нужна химчистка дивана и кресел"
  Ответ: {
    "serviceId": 2,
    "displayName": "химчистки мягкой мебели",
    "keyPhrases": ["химчистка диван", "чистка кресла"]
  }
  `;

        const result = await this.chatGptRequest(prompt, text);

        // Фильтрация и нормализация фраз
        const processedPhrases = result.keyPhrases
            .map(phrase => this.normalizeText(phrase))
            .filter(phrase =>
                phrase.length >= 3
            );

        return {
            variant: variants.find(v => v.id === result?.variantId),
            displayName: result?.displayName,
            keyPhrases: [...new Set<string>(processedPhrases)] // Удаление дубликатов
        };
    }

    private async chatGptRequest(systemPrompt: string, userText: string): Promise<any> {
        try {
            const completion = await this.openai.chat.completions.create({
                messages: [
                    {role: "system", content: systemPrompt},
                    {role: "user", content: userText}
                ],
                model: "gpt-3.5-turbo",
                response_format: {type: "json_object"}
            });

            return JSON.parse(completion.choices[0].message.content);
        } catch (error) {
            this.logger.error(`ChatGPT error: ${error.message}`);
            return null;
        }
    }
}

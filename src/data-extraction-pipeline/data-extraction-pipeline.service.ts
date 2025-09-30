import { Injectable, NotFoundException } from '@nestjs/common';
import { DataExtractorService } from '../data-extractor/data-extractor.service.js';
import { LeadsExtractionInputDTO, providerInputMapType, TableExtractionInputDTO } from './dto/inputs.dto.js';
import { DataProcessorService } from '../data-processor/data-processor.service.js';
import { providerInputMap } from '../testing-data/providerInputs.js';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class DataExtractionPipelineService {

    constructor(
        private dataExtractor: DataExtractorService,
        private dataProcessor: DataProcessorService
    ){}

    async extractLogs(provider: string, file: Express.Multer.File){
        const providerInput = await this.getProviderInput<"logs">(provider, "logs")
        const postValidation = await this.dataExtractor.extractLogs(file, providerInput)
        return {
            provider: provider,
            data: this.dataProcessor.processLogs(postValidation)
        }
    }

    async extractLeads(provider: string, file: Express.Multer.File){
        const providerInput = await this.getProviderInput<"leads">(provider, "leads")
        const postValidation = await this.dataExtractor.extractLeads(file, providerInput)

        return {
            provider: provider,
            data: this.dataProcessor.processLeads(postValidation, providerInput.processingSteps)
        }
    }

    private async getProviderInput<T extends keyof providerInputMapType>(
        provider: string,
        type: "logs" | "leads"
    ): Promise<providerInputMapType[T]> {
        // db pulling simulation here
        const providerInput = providerInputMap[provider]
        if (!providerInput) {
            throw new NotFoundException("no such provider exists")
        }
        return await this.validateProviderInput(providerInput, type)
    }

    private async validateProviderInput<T extends keyof providerInputMapType>(
        input: unknown,
        type: "logs" | "leads"
    ): Promise<providerInputMapType[T]> {

        let dto: TableExtractionInputDTO | LeadsExtractionInputDTO

        if (type === "logs") {
            dto = plainToInstance(TableExtractionInputDTO, input);
        } else {
            dto = plainToInstance(LeadsExtractionInputDTO, input);
        }

        const errors = await validate(dto)
        if (errors.length > 0) {
            throw new Error(`Provider Input Validation failed: ${JSON.stringify(errors)}`);
        }
        const cleanedDto = instanceToPlain(dto, { exposeUnsetFields: false });
        return cleanedDto as providerInputMapType[T];
    }
}

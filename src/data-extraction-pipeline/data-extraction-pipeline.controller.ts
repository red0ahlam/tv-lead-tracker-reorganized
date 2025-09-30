import { Body, Controller, HttpCode, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DataExtractionPipelineService } from './data-extraction-pipeline.service.js';

@Controller('extract')
export class DataExtractionPipelineController {

    constructor(private dataExtractionPipeline: DataExtractionPipelineService){}

    @Post('logs')
    @HttpCode(200)
    @UseInterceptors(FileInterceptor('file'))
    extractLogs(
        @Body('provider') provider: string,
        @UploadedFile() file: Express.Multer.File) {
        return this.dataExtractionPipeline.extractLogs(provider, file)
    }

    @Post('leads')
    @HttpCode(200)
    @UseInterceptors(FileInterceptor('file'))
    extractLeads(
        @Body('provider') provider: string,
        @UploadedFile() file: Express.Multer.File) {
        return this.dataExtractionPipeline.extractLeads(provider, file)
    }
}

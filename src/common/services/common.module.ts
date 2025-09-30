import { Global, Module } from '@nestjs/common';
import { UtilityService } from './utility-service/utility.service.js';

@Module({
    providers: [UtilityService],
    exports: [UtilityService]
})
export class CommonModule {}

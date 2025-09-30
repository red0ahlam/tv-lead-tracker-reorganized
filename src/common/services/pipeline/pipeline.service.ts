import { Injectable } from '@nestjs/common';

export type PipelineStep = (input: any) => any | Promise<any>;

@Injectable()
export class PipelineService {

    async run(initial: any, steps: PipelineStep[]): Promise<any> {
        let result = initial;
        for (const step of steps) {
            result = await step(result);
        }
        return result;
    }
}

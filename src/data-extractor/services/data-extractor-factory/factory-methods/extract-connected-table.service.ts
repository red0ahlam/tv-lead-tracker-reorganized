
import { Injectable } from "@nestjs/common";
import { TableExtractor } from "./table-extractor.abstract.js";
import { TableCoords } from "../../../../data-extractor/iterfaces/interfaces.js";
import { HeaderInfoDTO, TableSeparationPatternDTO } from "../../../../data-extraction-pipeline/dto/inputs.dto.js";
import { ValidatorService } from "../../validator/validator.service.js";
import { SeparatorValidationError } from "../../../../data-extractor/exceptions/table-extractor.exceptions.js";

@Injectable()
export class ExtractConnectedTable extends TableExtractor {

    /** 
    * - called for one connected table type files
    * - extracts the end pattern if it exists, if it doesn't assumes the end of the file is the end then builds the tables coords from the header coords and the end pattern coords (or to the end if no end pattern exists)
    * - validation rules used:
    *     - if end pattern exists:
    *         - if there was an error extracting the end pattern throw an error (for more info on the 
    *             extraction error see the function getSepartorCoords)
    *         - if the are is no seperator row coord between two headers, row coords throw an error (no need for checking if they 
    *             match since i already check in headerValidator that if table is connected there should be only one instance of it
    *             in the whole file, so this error only throws if there's something wrong in patterDeduplicator)
    *     - if end pattern doesn't exist, build table from header coords to end of file
    */
    constructor(validator: ValidatorService) {
        super(validator)
    }

    extractCoords(
        aoa: any[][],
        input: { tableSeparationPattern?: TableSeparationPatternDTO, headerInfo: HeaderInfoDTO }
    ): TableCoords {
        
        const { tableSeparationPattern } = input
        const headerDetails = this.getHeaderCoords(aoa, input.headerInfo)
        let deduplicatedPatternIdx: number[] | null = null;

        if (!input.tableSeparationPattern) {
            throw new SeparatorValidationError({
                success: false,
                message: "no separation pattern object passed",
                details: { passedObject: input.tableSeparationPattern }
            })
        }

        if (tableSeparationPattern?.endPattern) {
            const endPatternValidationResult = this.validator.validateAndGetSeparatorCoords(aoa, tableSeparationPattern!.endPattern)
            if (!endPatternValidationResult.success) {
                throw new SeparatorValidationError({
                    success: false,
                    message: endPatternValidationResult.message,
                    details: endPatternValidationResult.details ?? {}
                })
            }

            const endPatternDetails = endPatternValidationResult.details
            let headerIndices = headerDetails.map((element) => element.row)
            let endPatternIndices = endPatternDetails.map((element) => element.row)

            deduplicatedPatternIdx = this.getDeduplicatedIdx(tableSeparationPattern, headerIndices, endPatternIndices)
        }

        return this.buildTableCoords(headerDetails, deduplicatedPatternIdx, aoa.length)

    }
}

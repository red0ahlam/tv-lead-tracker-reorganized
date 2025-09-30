
import { Injectable } from "@nestjs/common";
import { TableExtractor } from "./table-extractor.abstract.js";
import { TableCoords } from "../../../../data-extractor/iterfaces/interfaces.js";
import { HeaderInfoDTO, TableSeparationPatternDTO } from "../../../../data-extraction-pipeline/dto/inputs.dto.js";
import { SeparatorValidationError } from "../../../../data-extractor/exceptions/table-extractor.exceptions.js";
import { ValidatorService } from "../../validator/validator.service.js";

@Injectable()
export class ExtractManyTables extends TableExtractor {

    /**
    * - called for many table type files
    * - extracts the end pattern that specify where a table ends then builds the tables coords from the header coords and the end pattern coords
    * - validation rules used:
    *       1. if no end pattern specified throw error
    *       2. if there was an error extracting the end pattern throw an error (for more info on the 
    *          extraction error see the function getSepartorCoords)
    *       3. if the are is no seperator row coord between two header row coords throw an error
    *       4. i the count of header coords and pattern coords don't match throw an error
    */
    constructor(validator: ValidatorService){
        super(validator)
    }

    extractCoords(
        aoa: any[][],
        input: { tableSeparationPattern: TableSeparationPatternDTO, headerInfo: HeaderInfoDTO },
    ): TableCoords {

        const { tableSeparationPattern } = input
        const headerDetails = this.getHeaderCoords(aoa, input.headerInfo)

        if (!tableSeparationPattern.endPattern) {
            throw new SeparatorValidationError({
                success: false,
                message: "failed at extracting tables due to no end pattern being specified",
                details: {}
            })
        }

        const endPatternValidationResult = this.validator.validateAndGetSeparatorCoords(aoa, tableSeparationPattern!.endPattern)
        if (!endPatternValidationResult.success) {
            throw new SeparatorValidationError({
                success: false,
                message: endPatternValidationResult.message,
                details: endPatternValidationResult.details ?? {}
            })
        }

        const endPatternDetails = endPatternValidationResult.details!
        let headerIndices = headerDetails.map((element) => element.row)
        let endPatternIndices = endPatternDetails.map((element) => element.row)

        let deduplicatedPatternIdx: number[] = this.getDeduplicatedIdx(tableSeparationPattern, headerIndices, endPatternIndices)

        if (headerDetails.length !== deduplicatedPatternIdx.length) {
            throw new SeparatorValidationError({
                success: false,
                message: "extracted header and end pattern counts do not match",
                details: { headerCount: headerDetails.length, endPatternCount: deduplicatedPatternIdx.length }
            })
        }

        return this.buildTableCoords(headerDetails, deduplicatedPatternIdx)
    }
}
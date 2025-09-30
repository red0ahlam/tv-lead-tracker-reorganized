
import { Injectable } from '@nestjs/common';
import { DataValidationResult, HeaderValidationResult, RelevantSideInfoValidationResult, separatorValidationResult } from '../../../data-extractor/iterfaces/interfaces.js';
import { checkingFnType } from '../../../data-extraction-pipeline/dto/constants.dto.js';
import { DataInfoDTO, HeaderInfoDTO, RelevantSideInfoDTO, SeparatorPatternDTO } from '../../../data-extraction-pipeline/dto/inputs.dto.js';
import { UtilityService } from '../../../common/services/utility-service/utility.service.js';
import { UtilityValidationResult } from '../../../common/interfaces/interfaces.global.js';

@Injectable()
export class ValidatorService {

    /**
     * implements three validation and coordinate extraction functions:
     *  1. header validator/extractor
     *  2. pattern validator/extractor
     *  3. data validator
     */
    constructor(
        private utilityService: UtilityService
    ) { }

    /**
     * validates and gets the coordinates of the header row(s)
     */
    validateAndGetHeaderCoords(aoa: any[][], input: HeaderInfoDTO): HeaderValidationResult {
        const fields = input.headerValues.map(f => this.utilityService.normalizeText(f.value));
        const sortedValues = [...input.headerValues].sort((a, b) => a.column - b.column);
        const columnCoords = sortedValues.map(v => v.column);

        // Find rows that contain all header values
        const headers: { row: any[], index: number }[] = []
        for (let i = 0; i < aoa.length; i++) {
            const row = aoa[i];
            const isHeader = fields.every((field) => row.some(cell => this.utilityService.normalizeText((cell ?? "")) === field))
            if (isHeader) {
                headers.push({ row: row, index: i })
            }
        }

        // No matching header row
        if (headers.length === 0) {
            return {
                success: false,
                message: "no row includes schema header values",
                details: {}
            }
        }

        // check if first header value all belong to the same schema specified column
        const headerStartColumn = headers.map((headerRow) => headerRow.row.findIndex((value) => this.utilityService.normalizeText(value ?? "") === fields[0]))
        if (!headerStartColumn.every((value) => value === headerStartColumn[0]) || headerStartColumn[0] !== input.startColumn) {
            return {
                success: false,
                message: "header starting column does not match the provided schema",
                details: {}
            }
        }

        // found Multiple header rows but schema specifies the existence of only one
        if (headers.length > 1 && !input.isRepeated) {
            return {
                success: false,
                message: "multiple header rows found, but only one expected",
                details: { found: headers.length }
            }
        }

        // First header row starts in a different row from the schema specifed row
        if (headers[0].index !== input.startRow) {
            return {
                success: false,
                message: "first header row starts at an unexpected row index",
                details: {
                    expectedStartRow: input.startRow,
                    found: headers[0].index
                }
            }
        }

        // Extract only relevant columns
        // i added this because of tegna which has all these merges for one column that are completely unnecessary
        // so you end up with a bunch of columns between the headers that have null in them (xlsx puts the value of 
        // merged cells into the first cell in the range)
        const relevantHeaderValues = headers.map(headerRow =>
            columnCoords.map(idx => headerRow.row[idx] ?? "")
        );

        // Check all headers have same length
        const firstLength = relevantHeaderValues[0].length;
        if (!relevantHeaderValues.every(r => r.length === firstLength)) {
            return {
                success: false,
                message: "detected headers with inconsistent lengths",
                details: {}
            }
        }

        // Compare headers against expected header values
        // basically go through cell by cell making sure that header values are at the expected cell and in the expected order
        for (let i = 0; i < relevantHeaderValues.length; i++) {
            for (let j = 0; j < columnCoords.length; j++) {
                if (this.utilityService.normalizeText(sortedValues[j].value) !== this.utilityService.normalizeText(relevantHeaderValues[i][j])) {
                    return {
                        success: false,
                        message: `header mismatch at row: ${headers[i].index}, column: ${columnCoords[j]}`,
                        details: {
                            expected: sortedValues[j].value,
                            got: relevantHeaderValues[i][j],
                            rowIndex: headers[i].index,
                            columnIndex: columnCoords[j]
                        }
                    }
                }
            }
        }

        return {
            success: true,
            message: "header validation successful",
            details: headers.map((headerRow) => ({
                row: headerRow.index,
                startColumn: input.startColumn,
                endColumn: Math.max(...columnCoords)
            }))
        }

    }

    /**
     * get the separator pattern coords
     */
    validateAndGetSeparatorCoords(aoa: any[][], input: SeparatorPatternDTO): separatorValidationResult {
        const patternRegex = new RegExp(`^${this.utilityService.escapeRegex(input.pattern)}\\s*.*`, 'i')
        const coords: { rowIndex: number, columnIndex: number }[] = []

        // get rows that contain the pattern
        for (let i = 0; i < aoa.length; i++) {
            for (let j = 0; j < (aoa[i]?.length ?? 0); j++) {
                let value = (aoa[i][j] ?? "").toString()
                if (patternRegex.test(value)) {
                    coords.push({ rowIndex: i, columnIndex: j })
                    break
                }
            }
        }

        // check if no pattern is found
        if (coords.length === 0) {
            return {
                success: false,
                message: `found zero instances of pattern ${input.pattern}`,
                details: {}
            }
        }

        // check if pattern doesn't show up in one uniform column
        if (!coords.every((value) => value.columnIndex === coords[0].columnIndex)) {
            return {
                success: false,
                message: `pattern: ${input.pattern} found in multiple columns, expected one uniform column`,
                details: {
                    patternCoords: coords
                }
            }
        }

        // check if pattern only shows up in the specified schema column
        if ((coords[0].columnIndex !== input.column)) {
            return {
                success: false,
                message: `pattern found in column ${coords[0].columnIndex}, expected column ${input.column}`,
                details: {
                    patternCoords: coords
                }
            }
        }

        return {
            success: true,
            message: "separator extraction successful",
            details: coords.map((coord) => ({ row: coord.rowIndex, column: coord.columnIndex }))
        }
    }


    /**
     * - this validates the data from the extracted columns using specified functions that are passed through the provider input
     * - again because of tegna i need to add the actual columns that the data exists on so i can validate that one specific cell and not ones that are read as null bacause of the merge
     * - the validation: 
        1. if the column can be empty we don't care if its empty but if there's a value check it against the 
        checking function specified
        2. if the columns can't be empty it needs to pass the checking function
        3. throw error on any cell that doesn't pass its validation
     */
    dataValidator(
        originalCoords: { startRow: number, endRow: number }, rows: any[][], headerInfo: HeaderInfoDTO, dataInfo: DataInfoDTO
    ): DataValidationResult {

        const { dataValues } = dataInfo;
        const headerValues = headerInfo.headerValues
        const populatedRows = this.utilityService.emptyRowsCleaner(rows)
        const columns = this.utilityService.rowToColumnTranspose(populatedRows);
        const finalValues: any[][] = []

        // Match each dataValue config to its actual column values
        const targetColumns = dataValues.map(value => ({
            ...value,
            values: columns[value.column],
            headerName: headerValues.filter((element) => element.column === value.headerColumn)[0].value
        }));

        for (const { column, headerName, checkingFn, constant, canBeEmpty, values } of targetColumns) {
            const validate = checkingFn && this.utilityService.validators[checkingFn] ? this.utilityService.validators[checkingFn] : this.utilityService.validators.default;
            const newValues: any[] = []
            for (let rowIndex = 0; rowIndex < values.length; rowIndex++) {
                const cellValue = values[rowIndex];
                const isNull: UtilityValidationResult<unknown> = this.utilityService.isNull(cellValue);
                const result: UtilityValidationResult<unknown> = canBeEmpty && isNull.isValid 
                    ? {isValid: true, details: {passedValue: isNull.details.passedValue, returnedValue: isNull.details.returnedValue}}
                    : checkingFn === "isConstant" as unknown as checkingFnType
                        ? validate(cellValue, constant)
                        : validate(cellValue);


                if (!result.isValid) {
                    const errorMessage = `Validation failed on '${headerName}' (col ${column + 1}, row ${originalCoords.startRow + rowIndex + 1}): value '${cellValue}' failed '${checkingFn}' check.`;
                    return {
                        success: false,
                        message: errorMessage,
                        details: {
                            cell: {
                                row: originalCoords.startRow + rowIndex + 1,
                                column: column + 1,
                                header: headerName,
                                value: cellValue,
                                typeValidationFn: checkingFn
                            }
                        }
                    }
                }

                newValues[rowIndex] = result.details.returnedValue!
            }
            finalValues.push(newValues)
        }
        
        const formattedRows = this.utilityService.columnToRowTranspose(populatedRows, finalValues).map((row, index) => ({ rowIndex: originalCoords.startRow + index + 1, rowData: row }))
        return {
            success: true,
            message: "data validation successful",
            details: formattedRows
        }
    }

    /**
     * - extracts relevant side info which is not available in the table but are important for pre-log calculation
     * - then map that value/values to needed column name
     * - validations:
        1. check if side info extraction is successful
        2. if schema specifies that there's only one instance of it in the file, check that the extracted coords length is one
     */
    validateAndGetRelevantSideInfo(
        aoa: any[][],
        relevantSideInfo: RelevantSideInfoDTO
    ): RelevantSideInfoValidationResult {

        let relevantSideInfoCoords = this.validateAndGetSeparatorCoords(aoa, { pattern: relevantSideInfo.pattern, column: relevantSideInfo.column, isRepeated: relevantSideInfo.isRepeated })
        if (!relevantSideInfoCoords.success) {
            return {
                success: false,
                message: relevantSideInfoCoords.message,
                details: relevantSideInfoCoords.details
            }
        }

        let relevantSideInfoDetails = relevantSideInfoCoords.details
        if (relevantSideInfoDetails.length > 1 && relevantSideInfo.isRepeated == false) {
            return {
                success: false,
                message: 'found many instances of relevant mapped property, expecting only one',
                details: { found: relevantSideInfoDetails.length }
            }
        }

        const patternRegex = new RegExp(`^${this.utilityService.escapeRegex(relevantSideInfo.pattern)}\\s*(.*)`, 'i')
        let info = {
            mappedProperty: relevantSideInfo.mappedProperty,
            values: relevantSideInfoDetails.map((item) => {
                const match = aoa[item.row][item.column].match(patternRegex)
                return match[1]
            })
        }
        return {
            success: true,
            message: "side info validation successful",
            details: info
        }
    }

}


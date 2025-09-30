
import { ValidationResultFailure } from "../../common/interfaces/interfaces.global.js";

export interface HeaderDetails {
    row: number,
    startColumn: number,
    endColumn: number
}

export interface HeaderValidationSuccess {
    success: true;
    message: string;
    details: HeaderDetails[];
}

export interface SeparatorDetails {
    row: number,
    column: number,
}

export interface SeparatorValidationSuccess {
    success: true;
    message: string;
    details: SeparatorDetails[];
}

export interface DataDetails {
    rowIndex: number,
    rowData: any[],
}

export interface DataValidationSuccess {
    success: true;
    message: string;
    details: DataDetails[];
}

export interface RelevantSideInfoDetails {
    mappedProperty: string,
    values: string[]
}

export interface RelevantSideInfoValidatorSuccess {
    success: true,
    message: string,
    details: RelevantSideInfoDetails
}

export type HeaderValidationResult<T = any> = HeaderValidationSuccess | ValidationResultFailure<T>;
export type separatorValidationResult<T = any> = SeparatorValidationSuccess | ValidationResultFailure<T>;
export type DataValidationResult<T = any> = DataValidationSuccess | ValidationResultFailure<T>;
export type RelevantSideInfoValidationResult<T = any> = RelevantSideInfoValidatorSuccess | ValidationResultFailure<T>;

export interface dataCoords { 
    startRow: number, 
    endRow: number 
}

export interface TableCoords {
    headerCoords: HeaderDetails[]
    dataCoords: dataCoords[]
}



import { HttpException, HttpStatus } from "@nestjs/common";
import { ValidationResultFailure } from "../../common/interfaces/interfaces.global.js";

export class TableSchemaValidationError extends HttpException {
    constructor(error: ValidationResultFailure<unknown>){
        super(
            {
                errorCode: "TABLE_SCHEMA_VALIDATION_ERROR",
                message: error.message,
                details: error.details? error.details : {}
            },
            HttpStatus.UNPROCESSABLE_ENTITY
        )
    }
}

export class HeaderValidationError extends HttpException {
    constructor(error: ValidationResultFailure<unknown>){
        super(
            {
                errorCode: "HEADER_VALIDATION_ERROR",
                message: error.message,
                details: error.details? error.details : {}
            },
            HttpStatus.UNPROCESSABLE_ENTITY
        )
    }
}

export class SeparatorValidationError extends HttpException {
    constructor(error: ValidationResultFailure<unknown>){
        super(
            {
                errorCode: "SEPERATOR_PATTERN_VALIDATION_ERROR",
                message: error.message,
                details: error.details? error.details : {}
            },
            HttpStatus.UNPROCESSABLE_ENTITY
        )
    }
}

export class RelevantSideInfoValidationError extends HttpException {
    constructor(error: ValidationResultFailure<unknown>){
        super(
            {
                errorCode: "RELEVANT_SIDE_INFO_VALIDATION_ERROR",
                message: error.message,
                details: error.details? error.details : {}
            },
            HttpStatus.UNPROCESSABLE_ENTITY
        )
    }
}

export class RowDataValidationError extends HttpException {
    constructor(error: ValidationResultFailure<unknown>){
        super(
            {
                errorCode: "ROW_DATA_VALIDATION_ERROR",
                message: error.message,
                details: error.details? error.details : {}
            },
            HttpStatus.UNPROCESSABLE_ENTITY
        )
    }
}
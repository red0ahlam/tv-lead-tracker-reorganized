
import { HttpException, HttpStatus } from "@nestjs/common";
import { ValidationResultFailure } from "../../common/interfaces/interfaces.global.js";

export class TimeExtractionError extends HttpException {
    constructor(error: ValidationResultFailure<unknown>) {
        super(
            {
                errorCode: "TIME_EXTRACTION_FAILED",
                message: error.message,
                details: error.details
            },
            HttpStatus.UNPROCESSABLE_ENTITY
        )
    }
}

import { HttpException, HttpStatus } from "@nestjs/common"
import { ValidationResultFailure } from "../interfaces/interfaces.global.js"

export class PermissionDeniedError extends HttpException {
    constructor(error: ValidationResultFailure<unknown>) {
        super(
            {
                errorCode: "PERMISSION_DENIED_ERROR",
                message: error.message,
                details: error.details ? error.details : {}
            },
            HttpStatus.FORBIDDEN
        )
    }
}
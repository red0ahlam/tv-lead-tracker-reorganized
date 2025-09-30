
import { HttpException, HttpStatus } from "@nestjs/common"
import { ValidationResultFailure } from "../interfaces/interfaces.global.js"

export class TokenNotFoundError extends HttpException {
    constructor(error: ValidationResultFailure<unknown>) {
        super(
            {
                errorCode: "TOKEN_NOT_FOUND_ERROR",
                message: error.message,
                details: error.details ? error.details : {}
            },
            HttpStatus.UNAUTHORIZED
        )
    }
}

export class InvalidTokenError extends HttpException {
    constructor(error: ValidationResultFailure<unknown>) {
        super(
            {
                errorCode: "INVALID_TOKEN_ERROR",
                message: error.message,
                details: error.details ? error.details : {}
            },
            HttpStatus.UNAUTHORIZED
        )
    }
}

export class ExpiredTokenError extends HttpException {
    constructor(error: ValidationResultFailure<unknown>) {
        super(
            {
                errorCode: "EXPIRED_TOKEN_ERROR",
                message: error.message,
                details: error.details ? error.details : {}
            },
            HttpStatus.UNAUTHORIZED
        )
    }
}

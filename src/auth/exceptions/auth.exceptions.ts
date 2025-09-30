
import { HttpException, HttpStatus } from "@nestjs/common";
import { ValidationResultFailure } from "../../common/interfaces/interfaces.global.js";

export class EmailAlreadyExistsError extends HttpException {
    constructor(error: ValidationResultFailure<unknown>) {
        super(
            {
                errorCode: "EMAIL_ALREADY_EXISTS_ERROR",
                message: error.message,
                details: error.details ? error.details : {}
            },
            HttpStatus.CONFLICT
        )
    }
}

export class EmailDoesNotExistError extends HttpException {
    constructor(error: ValidationResultFailure<unknown>) {
        super(
            {
                errorCode: "EMAIL_DOES_NOT_EXIST_ERROR",
                message: error.message,
                details: error.details ? error.details : {}
            },
            HttpStatus.NOT_FOUND
        )
    }
}

export class InvalidCredentialsError extends HttpException {
    constructor(error: ValidationResultFailure<unknown>) {
        super(
            {
                errorCode: "INVALID_CREDENTIALS_ERROR",
                message: error.message,
                details: error.details ? error.details : {}
            },
            HttpStatus.CONFLICT
        )
    }
}

export class InvalidUserError extends HttpException {
    constructor(error: ValidationResultFailure<unknown>) {
        super(
            {
                errorCode: "INVALID_USER_ERROR",
                message: error.message,
                details: error.details ? error.details : {}
            },
            HttpStatus.NOT_FOUND
        )
    }
}
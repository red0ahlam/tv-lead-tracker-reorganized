
export interface ValidationResultFailure<T = any> {
    success: false;
    message: string;
    details: T;
}

export interface UtilityValidationResult<T> {
    isValid: boolean,
    details: {
        passedValue: any,
        returnedValue?: {
            value: T,
            period?: string,
        }
    }
}
import { Injectable } from '@nestjs/common';
import { UtilityValidationResult } from '../../../common/interfaces/interfaces.global.js';

@Injectable()
export class UtilityService {
    validators: Record<string, (value: any, constant?: string | string[]) => UtilityValidationResult<Date | string | number | RegExpMatchArray>>
    count: number = 0

    constructor() {
        this.validators = {
            parseDate: this.parseDate.bind(this),
            parseTime: this.parseTime.bind(this),
            isTimeRange: this.isTimeRange.bind(this),
            isUsaCalenderDateTime: this.isUsaCalenderDateTime.bind(this),
            isEmail: this.isEmail.bind(this),
            isDay: this.isDay.bind(this),
            isCityState: this.isCityState.bind(this),
            isNumber: this.isNumber.bind(this),
            isRate: this.isRate.bind(this),
            isLength: this.isLength.bind(this),
            isNull: this.isNull.bind(this),
            isConstant: (value, constant) => this.isConstant(value, constant!),
            default: this.isNotNull.bind(this),
        };
    }

    // general utility
    private runRegex(value: string, regex: RegExp): boolean {
        return regex.test(value.toString().trim())
    }
    escapeRegex(str: string): string {
        return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
    normalizeText(text: unknown): string {
        return String(text ?? "").trim().toLowerCase();
    }
    emptyRowsCleaner(rows: any[][]): any[][] {
        return rows.filter(
            (row) => !row.every((cell) => cell === null || cell === undefined || cell === "")
        );
    }
    rowToColumnTranspose(matrix: any[][]): any[][] {
        return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
    }
    columnToRowTranspose(ogMatrix: any[][], transposedMatrix: any[][]): any[][] {
        return ogMatrix.map((_, rowIndex) => transposedMatrix.map((col) => col[rowIndex]));
    }

    private excelSerialToDate(serial: number): Date {
        const excelEpoch = Date.UTC(1899, 11, 30); // UTC timestamp in ms
        return new Date(excelEpoch + serial * 86400000);
    }

    // Parse a date (year, month, day, maybe time)
    parseDate(value: any): UtilityValidationResult<string> {
        if (value instanceof Date && !isNaN(value.getTime())) return { isValid: true, details: { passedValue: value, returnedValue: { value: value.toISOString() } } }
        if (typeof value === "number" && !isNaN(value)) return { isValid: false, details: { passedValue: value } }
        if (typeof value !== "string") return { isValid: false, details: { passedValue: value } }

        const v = value.trim();

        // ISO: 2025-02-15T13:45:00
        let m = v.match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?/);
        if (m) {
            return {
                isValid: true,
                details: {
                    passedValue: value,
                    returnedValue: {
                        value: new Date(Date.UTC(
                            Number(m[1]),
                            Number(m[2]) - 1,
                            Number(m[3]),
                            m[4] ? Number(m[4]) : 0,
                            m[5] ? Number(m[5]) : 0,
                            m[6] ? Number(m[6]) : 0
                        )).toISOString()
                    }
                }
            }
        }

        // US datetime: 02/15/2025 11:45 PM // 02/15/2025 16:59
        m = v.match(/^(0?[1-9]|1[0-2])[\/-](\d{1,2})[\/-](\d{2,4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM|XM)?)?$/i);
        if (m) {
            let year = m[3].length === 2 ? Number(m[3]) + 2000 : Number(m[3]);
            let month = Number(m[1]) - 1;
            let day = Number(m[2]);
            let hour = m[4] ? Number(m[4]) : 0;
            let minute = m[5] ? Number(m[5]) : 0;
            let second = m[6] ? Number(m[6]) : 0;

            if (m[7]) {
                const period = m[7].trim().toLowerCase();
                if (period === "pm") hour = (hour % 12) + 12
                if (period === "am" || period === "xm") hour = hour % 12
            }
            return {
                isValid: true,
                details: {
                    passedValue: value,
                    returnedValue: {
                        value: new Date(Date.UTC(year, month, day, hour, minute, second)).toISOString()
                    }
                }
            }
        }

        // Date only: 02/15/2025
        m = v.match(/^(0?[1-9]|1[0-2])[\/-](\d{1,2})[\/-](\d{2,4})$/);
        if (m) {
            let year = m[3].length === 2 ? Number(m[3]) + 2000 : Number(m[3]);
            return {
                isValid: true,
                details: {
                    passedValue: value,
                    returnedValue: {
                        value: new Date(Date.UTC(year, Number(m[1]) - 1, Number(m[2]))).toISOString()
                    }
                }
            }
        }

        return { isValid: false, details: { passedValue: value } }
    }

    // Parse a time (hours, minutes, seconds only)
    parseTime(value: any): UtilityValidationResult<string> {
        if (value instanceof Date && !isNaN(value.getTime())) return { isValid: true, details: { passedValue: value, returnedValue: { value: value.toISOString() } } }
        if (typeof value === "number" && !isNaN(value)) return { isValid: false, details: { passedValue: value } }
        if (typeof value !== "string") return { isValid: false, details: { passedValue: value } }

        const v = value.trim()

        // ISO: 2025-02-15T13:45:00
        let m = v.match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?/);
        if (m) {
            // console.log("inside iso with m: ",m);
            return {
                isValid: true,
                details: {
                    passedValue: value,
                    returnedValue: {
                        value: new Date(Date.UTC(
                            Number(m[1]),
                            Number(m[2]) - 1,
                            Number(m[3]),
                            m[4] ? Number(m[4]) : 0,
                            m[5] ? Number(m[5]) : 0,
                            m[6] ? Number(m[6]) : 0
                        )).toISOString()
                    }
                }
            }
        }

        // 12h: 11:45 PM or 11:45:00 PM
        m = v.match(/^(0?[1-9]|1[0-2]):([0-5]\d)(?::(\d{2}))?\s*(AM|PM|XM)$/i);
        if (m) {
            // console.log("inside 12h with m: ",m);

            let hour = Number(m[1]);
            let minute = Number(m[2]);
            let second = m[3] ? Number(m[3]) : 0;
            const period = m[4].toUpperCase();
            if (period === "PM" && hour < 12) hour += 12;
            if (period === "AM" && hour === 12) hour = 0;
            return {
                isValid: true,
                details: {
                    passedValue: value,
                    returnedValue: {
                        value: new Date(Date.UTC(1970, 0, 1, hour, minute, second)).toISOString(),
                        period: period
                    }
                }
            }
        }

        // 24h: 23:15 or 23:15:45
        m = v.match(/^([01]?\d|2[0-3]):([0-5]\d)(?::(\d{2}))?$/);
        if (m) {
            // console.log("inside 24h with m: ",m);
            return {
                isValid: true,
                details: {
                    passedValue: value,
                    returnedValue: {
                        value: new Date(Date.UTC(1970, 0, 1, Number(m[1]), Number(m[2]), m[3] ? Number(m[3]) : 0)).toISOString()
                    }
                }
            }
        }

        return { isValid: false, details: { passedValue: value } }
    }

    isTimeRange(value: string): UtilityValidationResult<RegExpMatchArray> {
        const match = value.match(/\(?(\d{1,2}(?::\d{1,2}(?::\d{1,2})?)?\s?(?:am|pm|xm|a|p|x)?)\s*-\s*(\d{1,2}(?::\d{1,2}(?::\d{1,2})?)?\s?(?:am|pm|xm|a|p|x)?)\)?/i)
        if (match) {
            return {
                isValid: true,
                details: {
                    passedValue: value,
                    returnedValue: {
                        value: match
                    }
                }
            }
        }
        return { isValid: false, details: { passedValue: value } }
    }

    // other validators
    isEmail(value: string): UtilityValidationResult<string> {
        return {
            isValid: this.runRegex(value, /^[^\s@]+@[^\s@]+\.[^\s@]+$/),
            details: {
                passedValue: value,
                returnedValue: { value }
            }
        }

    }
    isDay(value: string): UtilityValidationResult<string> {
        return {
            isValid: this.runRegex(value, /^(Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday)$/i),
            details: {
                passedValue: value,
                returnedValue: { value }
            }
        }
    }
    isRate(value: string): UtilityValidationResult<string | number> {
        return {
            isValid: this.runRegex(value, /^\$?(\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?|\d+(?:\.\d{1,2})?)$/),
            details: {
                passedValue: value,
                returnedValue: { value }
            }
        }
    }
    isCityState(value: string): UtilityValidationResult<string> {
        return {
            isValid: this.runRegex(value, /^[A-Za-z\s.'-]+,\s?[A-Za-z]{2}$/i),
            details: {
                passedValue: value,
                returnedValue: { value }
            }
        }
    }
    isConstant(value: string, constants: string | string[]): UtilityValidationResult<string> {
        const normalizedValue = this.normalizeText(value);
        const constantList = Array.isArray(constants) ? constants : [constants];
        const isValid = constantList.some(c => this.normalizeText(c) === normalizedValue);

        return {
            isValid,
            details: {
                passedValue: value,
                returnedValue: { value }
            }
        }
    }
    isNotNull(value: any): UtilityValidationResult<unknown> {
        return {
            isValid: value !== null && value !== undefined && value !== '',
            details: {
                passedValue: value,
                returnedValue: { value }
            }
        }
    }
    isNull(value: any): UtilityValidationResult<unknown> {
        return {
            isValid: value === null || value === undefined || value === "",
            details: {
                passedValue: value,
                returnedValue: { value }
            }
        }
    }
    isNumber(value: any): UtilityValidationResult<number> {
        const cast = Number(value);
        return {
            isValid: !Number.isNaN(cast) && value !== null,
            details: {
                passedValue: value,
                returnedValue: { value: cast }
            }
        }
    }
    isLength(value: any): UtilityValidationResult<string | number> {
        if (value === null || value === undefined) return { isValid: false, details: { passedValue: value } }
        const str = typeof value === "number" ? value.toString() : value.trim();
        return {
            isValid: this.runRegex(value, /^\d{1,2}:[0-5]\d$/) || this.runRegex(value, /^:?\d+$/),
            details: {
                passedValue: value,
                returnedValue: { value }
            }
        }
    }
    isUsaCalenderDateTime(value: string): UtilityValidationResult<RegExpMatchArray> {
        const match = value.match(/^(0?[1-9]|1[0-2])[\/-](0?[1-9]|[12][0-9]|3[01])[\/-](\d{2}|\d{4})\s(0?[0-9]|1[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/)
        if (match) {
            return {
                isValid: true,
                details: {
                    passedValue: value,
                    returnedValue: {
                        value: match
                    }
                }
            }
        }
        return { isValid: false, details: { passedValue: value } }
    }
}

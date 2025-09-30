import { Injectable } from '@nestjs/common';
import { PostProcessingLogExtractionOutput, PostValidationLogDataOutput, PostValidationLogExtractionOutput } from '../../../data-extraction-pipeline/interfaces/interface.js';
import { TimeExtractionError } from '../../../data-processor/exceptions/data-processor.exceptions.js';

@Injectable()
export class LogsDataProcessorService {

    process(rows: PostValidationLogExtractionOutput[]): PostProcessingLogExtractionOutput[] {
        return rows.map((row) => {
            const isXm = this.detectXmRows(row.rowData)
            return {
                rowIndex: row.rowIndex,
                rowData: {
                    station: row.rowData.station.value,
                    airDate: this.formatAirDate(row.rowData, isXm),
                    airTime: this.formatAirTime(row.rowData),
                    spot: row.rowData.spot.value,
                    rate: row.rowData.rate.value,
                    status: row.rowData.status?.value ?? ''
                }
            }
        })
    }

    private detectXmRows(row: PostValidationLogDataOutput): boolean {
        const xmPattern = /XM/ig
        const period = row.airTime.period ?? ""
        const match = period.trim().toLowerCase().match(xmPattern)
        if (match) {
            return true
        }
        return false
    }

    private formatAirDate(
        row: PostValidationLogDataOutput,
        isXm: boolean
    ): { year: number, month: number, dayOfMonth: number, dayOfWeek: number } {
        const airDate = row.airDate.value
        const airDateObject = new Date(airDate)

        if (isXm) airDateObject.setUTCDate(airDateObject.getUTCDate() + 1)
        return {
            year: airDateObject.getUTCFullYear(),
            month: airDateObject.getUTCMonth() + 1,
            dayOfMonth: airDateObject.getUTCDate(),
            dayOfWeek: airDateObject.getUTCDay()
        }
    }

    private formatAirTime(row: PostValidationLogDataOutput): { hour: number } {
        const airTime = row.airTime.value

        if (airTime) {
            const airTimeObject = new Date(airTime)
            return { hour: airTimeObject.getUTCHours() }

        } else {
            const timePeriod = row.timePeriod?.value ?? undefined

            if (timePeriod) {
                const [_, startTime] = timePeriod
                const normalizedStartTime = startTime.trim().toLowerCase()

                let hour: string | null
                if (normalizedStartTime.includes(":")) {
                    hour = normalizedStartTime.split(":")[0];
                } else {
                    const match = normalizedStartTime.match(/^\d+/);
                    hour = match ? match[0] : null
                }

                if (!(hour !== null && (/^\d+$/).test(String(hour)))) {
                    throw new TimeExtractionError({
                        success: false,
                        message: `Invalid timePeriod format: "${timePeriod}"`,
                        details: { timePeriod: timePeriod, row },
                    })
                }

                if (normalizedStartTime.toLowerCase().includes('pm') || normalizedStartTime.toLowerCase().includes('p')) {
                    return ({ hour: (Number(hour) % 12) + 12 });
                }

                return ({ hour: Number(hour) % 12 })
            }

            throw new TimeExtractionError({
                success: false,
                message: "Could not extract a valid time from airTime or timePeriod for the provided row",
                details: { row },
            });
        }
    }
}

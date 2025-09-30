import { Injectable } from '@nestjs/common';
import { AniDeduplicatorService } from '../ani-deduplicator/ani-deduplicator.service.js';
import { AnyCallCenterLead, FormattedCallCenterLead, LeadProcessorStep, LeadRowData, StepConfig } from '../../../data-extraction-pipeline/interfaces/interface.js';
import { callCenter2PostValidationExtractionOutput, callCenter1PostValidationExtractionOutput } from '../../../testing-data/postValidationExtractionOutput.js';

@Injectable()
export class LeadDataProcessorService {

    // ask ayoub about campaign ringa255 which is in the callcenter sheet but not listed as a valid campaign in the files
    private TVCampaignsPatterns: RegExp[] = [/local\s+\d+/i, /national\s+\d+/i, /spanish nat\s+\d+/i, /LifeBrands SP\s+\d+/i, /l\d+/i, /rop\s+\d+/i, /cpl\s+\d+/i, /Four J['`]*s Media/i, /Ring230/i, /Ring240/i]
    private stepRegistry: Record<string, LeadProcessorStep> = {
        extractTvCampaigns: (rows, opts) => this.extractTvCampaigns(rows, opts),
        formatColumnValue: (rows, opts) => {
            if (opts?.regexExp && typeof opts.regexExp === "string") {
                const parts = opts.regexExp.match(/^\/(.+)\/([gimsuy]*)$/)
                if (!parts) throw new Error("Invalid regex format: " + opts.regexExp)
                opts.regexExp = new RegExp(parts[1], parts[2])
            }
            return this.formatColumnValue(rows, opts);
        },
        setEmptyANI: (rows) => this.setEmptyANI(rows),
        dropPolicyHolders: (rows) => this.dropPolicyHolders(rows),
        deduplicateANI: (rows, opts) => this.deduplicateANI(rows, opts),
        handleSaveAllLeads: (rows, opts) => this.handleSaveAllLeads(rows, opts),
        dropDispositionDroppedCall: (rows) => this.dropDispositionDroppedCall(rows)
    };

    constructor(
        private aniDeduplicator: AniDeduplicatorService
    ) { }

    process(rows: AnyCallCenterLead[], pipeline: StepConfig[]): FormattedCallCenterLead[] {
        const sorted = pipeline.sort((a, b) => a.order - b.order)
        const processedRows = sorted.reduce((acc, stepConfig) => {
            const stepFn = this.stepRegistry[stepConfig.name];
            if (!stepFn) throw new Error(`Unknown step: ${stepConfig.name}`);
            return stepFn(acc, stepConfig.options);
        }, rows);

        return this.format(processedRows)
    }

    format(rows: AnyCallCenterLead[]): FormattedCallCenterLead[] {
        return rows.map((row) => ({
            rowIndex: row.rowIndex,
            rowData: {
                Call_DTS: this.formatDate(row.rowData['call dts'].value),
                SourceName: row.rowData.sourcename.value,
                Disposition: row.rowData.disposition?.value ?? null,
                Address1: row.rowData.address1.value,
                Address2: row.rowData.address2.value,
                City: row.rowData.city.value,
                State: row.rowData.state.value,
                ZIP: row.rowData.zip.value,
                UpdatePhone: row.rowData.updatephone.value,
                ANI: row.rowData.ani.value
            }
        }))
    }

    private formatDate(callDts: string): { dayOfMonth: number, month: number, year: number, hour: number } {
        const callDtsDateObject = new Date(callDts)
        return {
            year: callDtsDateObject.getUTCFullYear(),
            month: callDtsDateObject.getUTCMonth() + 1,
            dayOfMonth: callDtsDateObject.getUTCDate(),
            hour: callDtsDateObject.getUTCHours()
        }
    }

    // filters out none tv campaigns
    private extractTvCampaigns(rows: AnyCallCenterLead[], { columnKey }: { columnKey: string }): AnyCallCenterLead[] {
        return rows.filter(row => this.isTvCampaign(row.rowData, { columnKey }))
    }
    private isTvCampaign(row: LeadRowData, { columnKey }: { columnKey: string }): boolean {
        return this.TVCampaignsPatterns.some((regex) => regex.test(row[columnKey].value?.toString().trim() ?? ''))
    }

    // formats a column value a certain way (was made because our campaign types are spanish nat but call center sends spanish national)
    private formatColumnValue(
        rows: AnyCallCenterLead[],
        {
            columnKey,
            regexExp,
            replacement
        }: {
            columnKey: string
            regexExp: RegExp
            replacement: string
        }
    ): AnyCallCenterLead[] {
        return rows.map((row) => {
            const value = row.rowData[columnKey].value?.toString() ?? ''
            const match = value.match(regexExp)
            if (match) {
                const newValue = match[0].replace(regexExp, (_, group1) => replacement.replace("$1", group1));
                row.rowData[columnKey].value = newValue
            }

            return row
        })
    }


    // this only populates ANI cells that evaluate to empty (null,'') it does not check if it's a valid ANI
    // in case a lead doesn't have both ANI and phone number it just returns the lead as is.
    private setEmptyANI(rows: AnyCallCenterLead[]): AnyCallCenterLead[] {
        return rows.map((row) => {
            if (!row.rowData.ani.value && row.rowData.updatephone.value) {
                row.rowData.ani.value = row.rowData.updatephone.value
            }
            return row
        })
    }

    // get rid of rows that list a lead as a policy holder
    private dropPolicyHolders(leads: AnyCallCenterLead[]): AnyCallCenterLead[] {
        return leads.filter((lead) => !((lead.rowData.comments.value ?? '').toLowerCase().includes('policy holder')))
    }

    // get rid of dropped call in disposition in call center 1
    private dropDispositionDroppedCall(leads: AnyCallCenterLead[]): AnyCallCenterLead[] {
        return leads.filter((lead) => !((lead.rowData.disposition.value ?? '').trim().toLowerCase() === 'dropped call (sl)'))
    }

    // checks for duplicate ANI leads and chooses the one with most information present or many if they have differing information
    private deduplicateANI(
        leads: AnyCallCenterLead[],
        { aniExcludedKeys, campaignKey }: { aniExcludedKeys: string[], campaignKey: string }
    ): AnyCallCenterLead[] {
        const groupedANI: Record<string, AnyCallCenterLead[]> = {};

        for (const item of leads) {
            const key = Number(item.rowData.ani.value) ? String(item.rowData.ani.value) : "unknown"
            if (!groupedANI[key]) {
                groupedANI[key] = [];
            }
            groupedANI[key].push(item);
        }
        return Object.entries(groupedANI).map(([_, value]) => {
            if (value.length > 1) {
                return this.aniDeduplicator.extract(value, aniExcludedKeys, campaignKey)
            }
            return value[0]
            // return false
        }).flat()
    }

    // dos the logic for the save all leads sourcename
    private handleSaveAllLeads(
        rows: AnyCallCenterLead[],
        { mainKey, secondKey }: { mainKey: string, secondKey: string }
    ): AnyCallCenterLead[] {
        let filteredRows: AnyCallCenterLead[] = []
        for (let i = 0; i < rows.length; i++) {
            const rowData = rows[i].rowData
            const mainValue = rowData[mainKey.toLocaleLowerCase()].value?.toString() ?? ''
            const secondValue = rowData[secondKey.toLocaleLowerCase()].value?.toString() ?? ''
            if (mainValue.trim().toLocaleLowerCase() === 'save all leads') {
                if ((rowData.firstname?.value?.toLocaleLowerCase() == "dropped"
                    && rowData.lastname?.value?.toLocaleLowerCase() == "call")
                ) {
                    continue
                }
                else if (this.isTvCampaign(rowData, { columnKey: secondKey })) {
                    filteredRows.push({
                        ...rows[i],
                        rowData: {
                            ...rowData,
                            [mainKey]: { value: secondValue }
                        }
                    })
                }
                else {
                    filteredRows.push(rows[i])
                }
            } else {
                filteredRows.push(rows[i])
            }
        }
        return filteredRows
    }
}
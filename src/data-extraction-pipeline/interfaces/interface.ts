
type ISOString = string & { __brand: "ISOString" };
type Field<T> = { value: T };

export interface PostValidationLogDataOutput {
    station: Field<string>
    airDate: Field<ISOString>
    airTime: {
        value: ISOString
        period?: string
    }
    timePeriod?: Field<string>
    spot: Field<string>
    rate: Field<string>
    status?: Field<string>
}


export interface PostProcessingLogDataOutput {
    station: string
    airDate: {
        year: number, 
        month: number, 
        dayOfMonth: number, 
        dayOfWeek: number
    }
    airTime: {
        hour: number
    }
    spot: string
    rate: number | string
    status?: string
}

export interface PostValidationLogExtractionOutput {
    rowIndex: number,
    rowData: PostValidationLogDataOutput
}

export interface PostProcessingLogExtractionOutput {
    rowIndex: number,
    rowData: PostProcessingLogDataOutput
}

export interface DataExtractorLogOutput {
    provider: string,
    data: PostValidationLogExtractionOutput[]
}

export interface DataProcessorLogOutput{
    provider: string,
    data: PostProcessingLogExtractionOutput[]
}

interface BaseLeadFields {
    firstname: Field<string | null>;
    lastname: Field<string | null>;
    address1: Field<string | null>;
    address2: Field<string | null>;
    city: Field<string | null>;
    state: Field<string | null>;
    zip: Field<string | number | null>;
    ani: Field<string | number | null>;
    updatephone: Field<string | number | null>;
    dob: Field<string | null>;
    'call dts': Field<string>;
    sourcename: Field<string>;
    comments: Field<string | null>;
    nameofagent: Field<string | null>;
    email: Field<string | null>;
}

type BaseLead = BaseLeadFields & {
    [key: string]: Field<any>;
};

export interface CallCenter1Lead extends BaseLead {
    'session id': Field<string>;
    disposition: Field<string | null>;
    'cs comments': Field<string | null>;
    type: Field<string | null>;
    'lead type': Field<string | null>;
}

export interface CallCenter2Lead extends BaseLead {
    originatingcampaign: Field<string | null>;
    appointment: Field<string | null>;
}

export type LeadRowData = CallCenter1Lead | CallCenter2Lead

export interface AnyCallCenterLead {
    rowIndex: number,
    rowData: LeadRowData
}

export interface FormattedCallCenterLeadRowData {
    Call_DTS: {
        year: number,
        month: number,
        dayOfMonth: number,
        hour: number
    }
    SourceName: string
    Disposition: string | null
    Address1: string | null
    Address2: string | null
    City: string | null
    State: string | null
    ZIP: string | number | null
    UpdatePhone: string | number | null
    ANI: string | number | null
}


export interface FormattedCallCenterLead {
    rowIndex: number,
    rowData: FormattedCallCenterLeadRowData
}

export interface DataExtractorLeadOutput {
    provider: string,
    data: AnyCallCenterLead[]
}

export interface DataProcessorLeadOutput{
    provider: string,
    data: FormattedCallCenterLead[]
}

export type LeadProcessorStep = (rows: AnyCallCenterLead[], options?: any) => AnyCallCenterLead[];

export interface StepConfig {
  name: string
  order: number
  options?: any
}

// export type ProviderExtractedRowType = {
//     logs: ExtractedRowDTO
//     leads: ExtractedLeadRowDTO
// }

// export type ProviderOutputMapType = {
//     logs: TableExtractionOutputDTO,
//     leads: LeadsExtractionOutputDTO
// }
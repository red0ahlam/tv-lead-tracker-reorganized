import {
    IsString,
    IsOptional,
    IsEnum,
    IsBoolean,
    IsInt,
    ValidateNested,
    ArrayNotEmpty,
    ValidateIf,
    IsArray,
    IsDefined,
    IsNotEmpty,
    IsNumber,
    Validate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TableExtractionMode, checkingFnType } from './constants.dto.js';

class TableHeaderMappingMapDTO {
    @IsOptional() @IsString() station?: string
    @IsDefined() @IsString() airDate: string
    @IsDefined() @IsString() airTime: string
    @IsOptional() @IsString() timePeriod?: string
    @IsDefined() @IsString() spot: string
    @IsDefined() @IsString() rate: string
    @IsOptional() @IsString() status?: string
}

class TableHeaderMappingConstantsDTO {
    @IsOptional() @IsString() station?: string
    @IsOptional() @IsString() airDate?: string
    @IsOptional() @IsString() airTime?: string
    @IsOptional() @IsString() timePeriod?: string
    @IsOptional() @IsString() spot?: string
    @IsOptional() @IsString() rate?: string
    @IsOptional() @IsString() status?: string
}

export class TableHeaderMappingDTO {
    @IsDefined()
    @ValidateNested()
    @Type(() => TableHeaderMappingMapDTO)
    map: TableHeaderMappingMapDTO

    @IsOptional()
    @ValidateNested()
    @Type(() => TableHeaderMappingConstantsDTO)
    constants?: TableHeaderMappingConstantsDTO
}

class HeaderValueDTO {
    @IsDefined() @IsInt() column: number
    @IsDefined() @IsString() value: string
}

export class HeaderInfoDTO {
    @IsDefined() @IsInt() startRow: number
    @IsDefined() @IsInt() startColumn: number

    @IsDefined()
    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => HeaderValueDTO)
    headerValues: HeaderValueDTO[]

    @IsDefined() @IsBoolean() isRepeated: boolean
}

class DataValueDTO {
    @IsDefined() @IsInt() column: number
    @IsDefined() @IsInt() headerColumn: number
    @IsOptional() @IsEnum(checkingFnType) checkingFn?: checkingFnType
    @IsDefined() @IsBoolean() canBeEmpty: boolean

    @IsOptional()
    @ValidateIf(o => o.checkingFn === checkingFnType.isConstant)
    @Validate(o =>
        typeof o.constant === 'string' ||
        Array.isArray(o.constant)
    )
    constant?: string | string[]
}

class SumRowDTO {
    @IsDefined() @IsInt() column: number
    @IsDefined() @IsEnum(checkingFnType) checkingFn: checkingFnType

    @IsOptional()
    @IsString()
    @ValidateIf(o => o.checkingFn === checkingFnType.isConstant)
    constant?: string
}

export class DataInfoDTO {
    @IsDefined()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => DataValueDTO)
    dataValues: DataValueDTO[]

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SumRowDTO)
    sumRows?: SumRowDTO[]
}

export class SeparatorPatternDTO {
    @IsDefined() @IsString() pattern: string
    @IsDefined() @IsInt() column: number
    @IsBoolean() isRepeated: boolean
}

export class TableSeparationPatternDTO {
    @IsOptional()
    @ValidateNested()
    @Type(() => SeparatorPatternDTO)
    startPattern?: SeparatorPatternDTO

    @IsOptional()
    @ValidateNested()
    @Type(() => SeparatorPatternDTO)
    endPattern?: SeparatorPatternDTO
}

export class RelevantSideInfoDTO {
    @IsDefined() @IsString() mappedProperty: string
    @IsDefined() @IsString() pattern: string
    @IsDefined() @IsBoolean() isRepeated: boolean
    @IsDefined() @IsInt() column: number
}

export class TableExtractionInputDTO {
    @IsDefined()
    @ValidateNested()
    @Type(() => TableHeaderMappingDTO)
    headerMapping: TableHeaderMappingDTO

    @IsDefined()
    @IsString()
    providerName: string

    @IsDefined()
    @IsEnum(TableExtractionMode)
    tableType: TableExtractionMode

    @IsDefined()
    @ValidateNested()
    @Type(() => HeaderInfoDTO)
    headerInfo: HeaderInfoDTO

    @IsDefined()
    @ValidateNested()
    @Type(() => DataInfoDTO)
    dataInfo: DataInfoDTO

    @IsOptional()
    @ValidateNested()
    @Type(() => TableSeparationPatternDTO)
    tableSeparationPattern?: TableSeparationPatternDTO

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => RelevantSideInfoDTO)
    relevantSideInfo?: RelevantSideInfoDTO[]
}

export class StepConfigDTO {
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    name: string

    @IsDefined()
    @IsNumber()
    @IsNotEmpty()
    order: number

    @IsOptional()
    options?: any
}

export class LeadsExtractionInputDTO {

    @IsDefined()
    @IsString()
    providerName: string

    @IsDefined()
    @IsEnum(TableExtractionMode)
    tableType: TableExtractionMode

    @IsDefined()
    @ValidateNested()
    @Type(() => HeaderInfoDTO)
    headerInfo: HeaderInfoDTO

    @IsDefined()
    @ValidateNested()
    @Type(() => DataInfoDTO)
    dataInfo: DataInfoDTO

    @IsOptional()
    @ValidateNested()
    @Type(() => TableSeparationPatternDTO)
    tableSeparationPattern?: TableSeparationPatternDTO

    @IsDefined()
    @ValidateNested({ each: true })
    @Type(() => StepConfigDTO)
    processingSteps: StepConfigDTO[]
}

export type providerInputMapType = {
    logs: TableExtractionInputDTO,
    leads: LeadsExtractionInputDTO
}
import { Injectable } from '@nestjs/common';
import { AnyCallCenterLead } from '../../../data-extraction-pipeline/interfaces/interface.js';

@Injectable()
export class AniDeduplicatorService {

    extract(input: AnyCallCenterLead[], excludedKeys: string[], campaignKey: string): AnyCallCenterLead[] {
        let allKeys: string[] = this.getRelevantKeys(input, excludedKeys)
        let valueMap: Map<any, number> = new Map()
        let mapIndex: number = 1

        const { campaignKeyIdx, vectors } = this.createVectors(input, allKeys, valueMap, mapIndex, campaignKey)     
        const { cleanedVectors, keptIndices} = this.removeUniformColumns(vectors)
        const uniqueIndices = this.filterAllEmptyWithSameSource(cleanedVectors, this.getMaximalVectors(cleanedVectors), campaignKeyIdx, keptIndices)
        return uniqueIndices.map((i) => input[i])
    }

    private getRelevantKeys(leads: AnyCallCenterLead[], excludedKeys: string[]): string[] {
        const keySet = new Set<string>()
        const normalizedKeys = new Set(excludedKeys.map(k => k.toLowerCase()))
        Object.keys(leads[0].rowData).forEach((key) => {
            if (!(normalizedKeys.has(key.toLowerCase()))) {
                keySet.add(key)
            }
        })
        return Array.from(keySet)
    }

    private createVectors(
        leads: AnyCallCenterLead[], 
        allKeys: string[], 
        valueMap: Map<any, number>, 
        mapIndex: number, 
        campaignKey: string
    ): { campaignKeyIdx: number, vectors: number[][] } {
        
        let campaignKeyIdx = 0
        const vectors = leads.map((lead) => {
            return allKeys.map((key, index) => {
                if(key.trim().toLowerCase() === campaignKey.trim().toLowerCase()) campaignKeyIdx = index
                let data = lead.rowData[key].value
                if (data === null) return 0
                if (!valueMap.has(data)) {
                    valueMap.set(data, mapIndex++)
                }
                return valueMap.get(data)!
            })
        })

        return {
            campaignKeyIdx: campaignKeyIdx,
            vectors: vectors
        }
    }

    private removeUniformColumns(matrix: number[][]): { cleanedVectors: number[][], keptIndices: number[]} {
        if (matrix.length === 0) return { cleanedVectors: [], keptIndices: []};
        const transposed = matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));

        const keptIndices: number[] = [];
        const filtered = transposed.filter((col, idx) => {
            const kept = !col.every(val => val === col[0])
            if(kept) keptIndices.push(idx)
            return kept
        });
        const result = matrix.map((_, rowIndex) => filtered.map(col => col[rowIndex]))
        let isEmpty = result.every((row) => Array.isArray(row) && row.length === 0)

        return { cleanedVectors: isEmpty ? [matrix[0]] : result, keptIndices}
    }

    private isSuperSet(vector: number[], reference: number[]): boolean {
        return reference.every((val, i) => val === 0 || val === vector[i])
    }

    private getMaximalVectors(vectors: number[][]): number[] {
        let uniqueIndices = new Set<number>()
        let skippedIndices = new Set<number>()

        if (vectors.length === 0) return []
        if (vectors.length === 1) return [0]

        vectors.forEach((currentVec, currentIdx) => {
            if (skippedIndices.has(currentIdx)) return

            let isMaximal = true
            for (let nextIdx = 0; nextIdx < vectors.length; nextIdx++) {
                if (nextIdx === currentIdx || skippedIndices.has(nextIdx)) continue

                let nextVec = vectors[nextIdx]
                if (this.isSuperSet(nextVec, currentVec)) {
                    isMaximal = false
                    skippedIndices.add(currentIdx)
                    break
                }

                if (this.isSuperSet(currentVec, nextVec)) {
                    skippedIndices.add(nextIdx)
                }
            }

            if (isMaximal) uniqueIndices.add(currentIdx)
        })
        return Array.from(uniqueIndices).length > 0 ? Array.from(uniqueIndices) : [0]
    }

    private filterAllEmptyWithSameSource(
        vectors: number[][], 
        uniqueIndices: number[],
        campaignKeyIdx: number,
        keptIndices: number[]
    ): number[] {
        let emptyIndices: number[] = [];
        let nonEmptyIndices: number[] = [];
        const skippedIndex = keptIndices.findIndex((idx)=> idx == campaignKeyIdx)
        
        for (const idx of uniqueIndices) {
            const vector = vectors[idx];
            let allZeros = true;
            
            for (let i = 0; i < vector.length; i++) {
                if(i === skippedIndex) continue
                if (vector[i] !== 0) {
                    allZeros = false;
                    break;
                }
            }

            if (allZeros) {
                emptyIndices.push(idx);
            } else {
                nonEmptyIndices.push(idx);
            }
        }

        if (nonEmptyIndices.length === 0) {
            nonEmptyIndices.push(emptyIndices[0]);
        }
        return nonEmptyIndices;
    }
}
import { BadRequestException, Injectable } from '@nestjs/common';
import { promises as fs } from 'fs'
import { writeFile } from 'fs/promises'
import { tmpdir } from 'os';
import { basename, join } from 'path';
import * as XLSX from 'xlsx'
import { execFile } from 'child_process';

@Injectable()
export class FileReaderService {

    /**
     * - reads an excel file
     * - checks if the extension is .xls and turns it to xlsx using libreoffice
     * - throws an error for none (.xls, .xlsx) files
     */
    public async excelReader(file: Express.Multer.File): Promise<any[][]> {
        if (!file) {
            throw new BadRequestException("no file was passed in the request")
        }

        if (!(file.originalname.endsWith(".xls") || file.originalname.endsWith(".xlsx") || file.originalname.endsWith(".csv"))) {
            throw new BadRequestException("only file the following files types are accepted: (.csv, .xlsx, .xls)")
        }

        let tempFiles: string[] = []
        try {
            let buffer = file.buffer
            if (file.originalname.endsWith(".xls")) {
                buffer = await this.convertXlsToXlsx(buffer, file.originalname, tempFiles)
            }

            // cellDate:true so that date values are read as dates by xlsx (using 1900 or 1904)
            const workbook = XLSX.read(buffer, { type: "buffer", cellDates: true, cellNF: false, cellText: false, cellHTML: false, cellStyles: false });
            const sheet = workbook.Sheets[workbook.SheetNames[0]]

            // raw:true so i get the actual value not (sometimes) weird formatting
            // UTC:true so the dates i get back are in UTC not local time
            const aoa = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null, raw: true, UTC: true}) as any[][]
            return aoa

        } catch (error) {
            throw error

        } finally {
            for (const filePath of tempFiles) {
                fs.unlink(filePath).catch(() => { })
            }
        }
    }

    private async convertXlsToXlsx(fileBuffer: Buffer, fileName: string, tempFiles: string[]) {
        const inputPath = join(tmpdir(), fileName)

        await writeFile(inputPath, fileBuffer)
        tempFiles.push(inputPath)

        const convertedPath = await convertXlsToXlsxLibreOffice(inputPath)
        tempFiles.push(convertedPath)

        const buffer = await fs.readFile(convertedPath)
        return buffer
    }
}

async function convertXlsToXlsxLibreOffice(inputPath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const outputDir = tmpdir();
    execFile(
      "soffice",
      [
        "--headless",
        "--convert-to",
        "xlsx:Calc MS Excel 2007 XML",
        "--outdir",
        outputDir,
        inputPath,
      ],
      (error) => {
        if (error) {
          return reject(error);
        }
        const outputPath = join(outputDir, basename(inputPath, ".xls") + ".xlsx");
        resolve(outputPath);
      }
    );
  });
}
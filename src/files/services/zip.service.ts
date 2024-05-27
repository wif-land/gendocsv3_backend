import { Injectable } from '@nestjs/common'
import * as AdmZip from 'adm-zip'

@Injectable()
export class ZipService {
  extractZip(zipBuffer: Buffer, extractTo: string): void {
    const zip = new AdmZip(zipBuffer)
    zip.extractAllTo(extractTo, true)
  }
}

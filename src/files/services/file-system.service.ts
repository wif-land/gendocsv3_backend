import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { GcpService } from '../../gcp/gcp.service'
import * as fs from 'fs'
import * as path from 'path'
import * as admZip from 'adm-zip'
import { Readable } from 'stream'
import { MIMETYPES } from '../../shared/constants/mime-types'

@Injectable()
export class FileSystemService {
  constructor(private readonly gcpService: GcpService) {}

  async saveDownloadedDocument(
    title: string,
    tempDocxPath: string,
    blob: Blob,
  ): Promise<string> {
    const tempPath = path.resolve(tempDocxPath)

    // Suponiendo que el path tiene este formato `${council.module.name}/${council.submoduleYearModule.yearModule.year}/councils/${council.id}-${council.name}`

    if (!fs.existsSync(tempPath)) {
      fs.mkdirSync(tempPath)
    }

    const filepath = path.resolve(tempPath, `${title}.docx`)

    const writer = fs.createWriteStream(filepath)
    writer.write(Buffer.from(await blob.arrayBuffer()))

    return new Promise<string>((resolve, reject) => {
      writer.on('finish', () => {
        console.log('File downloaded', filepath)
        resolve(filepath)
      })
      writer.on('error', (error) => {
        console.error('Error downloading file:', error)
        reject(error)
        throw new HttpException(
          `Error al guardar el archivo ${title}`,
          HttpStatus.CONFLICT,
        )
      })
    })
  }

  async createDocument() {
    const { data: blob } = await this.gcpService.exportAsset(
      '13s4a8v42LocLrT-6oPh0N5OKmW96vssjL2V9exXAd3U',
      MIMETYPES.DOCX,
    )

    if (!blob) {
      throw new Error('No data received from GCP service')
    }

    const tempDir = path.resolve(process.cwd(), 'temp-assets')
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir)
    }

    const filepath = path.resolve(tempDir, 'document.zip')
    const writer = fs.createWriteStream(filepath)

    // Convertir Blob a ReadableStream
    const readableStream = new Readable()
    // eslint-disable-next-line @typescript-eslint/no-empty-function, no-underscore-dangle
    readableStream._read = () => {} // _read is required but you can noop it
    readableStream.push(Buffer.from(await blob.arrayBuffer()))
    readableStream.push(null)

    readableStream.pipe(writer)

    return new Promise<void>((resolve, reject) => {
      writer.on('finish', () => {
        console.log('File downloaded', filepath)
        resolve()
      })
      writer.on('error', (error) => {
        console.error('Error downloading file:', error)
        reject(error)
      })
    })
  }

  async unzipAndTakeFile(zipFilePath: string, relativeTakeFilePath: string) {
    const zip = new admZip(zipFilePath)
    const zipEntries = zip.getEntries()

    const entry = zipEntries.find((e) => e.entryName === relativeTakeFilePath)

    if (!entry) {
      return null
    }

    const buffer = entry.getData()

    return buffer
  }

  async resolveDirectory(directory: string) {
    const directoryResolved = path.resolve(directory)

    if (!fs.existsSync(directoryResolved)) {
      fs.mkdirSync(directoryResolved)
    }

    return directoryResolved
  }

  async getFilesFromDirectory(directory: string) {
    const files = fs.readdirSync(directory, { encoding: 'buffer' })

    return files
  }
}

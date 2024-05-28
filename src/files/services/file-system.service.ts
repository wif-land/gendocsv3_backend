import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import * as fs from 'fs'
import * as path from 'path'
import * as admZip from 'adm-zip'
@Injectable()
export class FileSystemService {
  async saveDownloadedDocument(
    title: string,
    tempDocxPath: string,
    blob: Blob,
  ): Promise<string> {
    // Suponiendo que el path tiene este formato `${council.module.name}/${council.submoduleYearModule.yearModule.year}/councils/${council.id}-${council.name}`

    const filepath = path.resolve(tempDocxPath, `${title}.docx`)

    const writer = fs.createWriteStream(filepath)

    return new Promise<string>(async (resolve, reject) => {
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

      writer.write(Buffer.from(await blob.arrayBuffer()))
      writer.end()
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
      fs.mkdirSync(directoryResolved, { recursive: true })
    }

    return directoryResolved
  }

  async getFilesFromDirectory(directory: string) {
    // should return absolute paths

    const files = fs
      .readdirSync(directory)
      .map((file) => path.resolve(directory, file))

    return files
  }
}

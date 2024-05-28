import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { GcpService } from '../../gcp/gcp.service'
import { FileSystemService } from './file-system.service'
import { DEFAULT_VARIABLE } from '../../shared/enums/default-variable'
import { DocxService } from './docx.service'
import { MIMETYPES } from '../../shared/constants/mime-types'
// eslint-disable-next-line import/no-unresolved
// import * as fs from 'fs/promises'
// // import * as DocxMerger from '@scholarcy/docx-merger'
// import * as builder from 'docx-builder'
// eslint-disable-next-line import/no-unresolved

@Injectable()
export class FilesService {
  constructor(
    private readonly gcpService: GcpService,
    private readonly fileSystemService: FileSystemService,
    private readonly docxService: DocxService,
  ) {}

  // async mergeDocuments(
  //   title: string,
  //   documents: Buffer[],
  //   generatedCouncilPath: string,
  // ) {
  //   const merger = new DocxMerger()
  //   console.log('documents', documents)
  //   await merger.merge(documents)

  //   const mergedDocument = await merger.save()
  //   console.log('documents', mergedDocument)

  //   if (!mergedDocument) {
  //     throw new HttpException(
  //       'No se pudo generar los documentos recopilados',
  //       HttpStatus.CONFLICT,
  //     )
  //   }

  //   const tempDocxPath = `${generatedCouncilPath}/${title}.docx`

  //   await fs.writeFile(tempDocxPath, mergedDocument)
  // }
  async mergeDocuments(
    title: string,
    documentPaths: string[],
    generatedCouncilPath: string,
  ) {
    // // Lee los archivos en Buffers
    // const documents = await Promise.all(
    //   documentPaths.map((path) => fs.readFile(path, 'binary')),
    // )
    // const merger = new DocxMerger()
    // await merger.initialize({}, documents)

    const tempDocxPath = `${generatedCouncilPath}/${title}.docx`
    // const tempZipPath = `${generatedCouncilPath}/${title}.zip`

    console.log('data')

    // await merger.save('nodebuffer', async (data: Buffer) => {
    //   console.log('data', data)
    //   try {
    //     await fs.writeFile(tempDocxPath, data)
    //   } catch (err) {
    //     throw new HttpException(
    //       'No se pudo generar los documentos recopilados',
    //       HttpStatus.CONFLICT,
    //     )
    //   }
    // })

    // const data = await merger.save('nodebuffer')

    this.docxService.mergeDocuments(documentPaths, tempDocxPath)

    // You can also do this asynchronously using the insertDocx method.

    // await Promise.all(
    //   documentPaths.map(async (path) => {
    //     await docx.insertDocxSync(path)
    //   }),
    // )
    // SAVING THE DOCX FILE

    // await fs.writeFile(`${tempZipPath}`, data)
    // await fs.writeFile(tempDocxPath, data)
    return tempDocxPath
  }

  async getFilesFromDirectory(tempDocxPath: string): Promise<string[]> {
    const files = await this.fileSystemService.getFilesFromDirectory(
      tempDocxPath,
    )

    if (!files) {
      throw new HttpException(
        'Error obteniendo archivos del directorio',
        HttpStatus.CONFLICT,
      )
    }

    return files
  }

  async createDocument(title: string) {
    const document = await this.gcpService.createDocument(title)

    if (!document) {
      throw new HttpException('Error creating document', HttpStatus.CONFLICT)
    }

    return document
  }

  async createDocumentByParentId(title: string, parentId: string) {
    const document = await this.gcpService.createDocumentByParentId(
      title,
      parentId,
    )

    if (!document) {
      throw new HttpException('Error creating document', HttpStatus.CONFLICT)
    }

    return document
  }

  async createDocumentByParentIdAndCopy(
    title: string,
    parentId: string,
    documentId: string,
  ) {
    const document = await this.gcpService.createDocumentByParentIdAndCopy(
      title,
      parentId,
      documentId,
    )

    if (!document) {
      throw new HttpException('Error creating document', HttpStatus.CONFLICT)
    }

    return document
  }

  async renameAsset(documentId: string, title: string) {
    const document = await this.gcpService.renameAsset(documentId, title)

    if (!document) {
      throw new HttpException('Error renaming document', HttpStatus.CONFLICT)
    }

    return document
  }

  async moveAsset(documentId: string, parentId: string) {
    const document = await this.gcpService.moveAsset(documentId, parentId)

    if (!document) {
      throw new HttpException('Error moving document', HttpStatus.CONFLICT)
    }

    return document
  }

  async createFolderByParentId(title: string, parentId: string) {
    const folder = await this.gcpService.createFolderByParentId(title, parentId)

    if (!folder) {
      throw new HttpException('Error creating folder', HttpStatus.CONFLICT)
    }

    return folder
  }

  async replaceTextOnDocument(data: object, documentId: string) {
    const result = await this.gcpService.replaceTextOnDocument(data, documentId)

    if (!result) {
      throw new HttpException(
        'Error replacing text on document',
        HttpStatus.CONFLICT,
      )
    }

    return result
  }

  async remove(assetId: string) {
    const result = await this.gcpService.remove(assetId)

    if (!result) {
      throw new HttpException('Error removing asset', HttpStatus.CONFLICT)
    }

    return result
  }

  async exportAsset(driveId: string, DOCX: MIMETYPES) {
    const { data: blob } = await this.gcpService.exportAsset(driveId, DOCX)

    if (!blob) {
      throw new HttpException(
        'No se recibieron datos del servicio de GCP',
        HttpStatus.CONFLICT,
      )
    }

    return blob
  }

  async getValuesFromSheet(sheetId: string, range: string) {
    const { data } = await this.gcpService.getValuesFromSheet(sheetId, range)

    const values = data
    return values
  }

  async saveDownloadedDocument(
    title: string,
    tempDocxPath: string,
    blob: Blob,
  ) {
    const savedDocument = await this.fileSystemService.saveDownloadedDocument(
      title,
      tempDocxPath,
      blob,
    )

    if (!savedDocument) {
      throw new HttpException(
        `Se produjo un error al guardar el documento descargado${title}`,
        HttpStatus.CONFLICT,
      )
    }

    return savedDocument
  }
  async filterDocument(
    savedDownloadedDocumentPath: string,
    FROM: DEFAULT_VARIABLE,
    TO: DEFAULT_VARIABLE,
  ) {
    const filteredDocumentPath = await this.docxService.filterDocx(
      savedDownloadedDocumentPath,
      FROM,
      TO,
    )

    if (!filteredDocumentPath) {
      throw new HttpException(
        'Error filtrando el documento',
        HttpStatus.CONFLICT,
      )
    }

    return filteredDocumentPath
  }

  async removePageBreaks(filteredDocumentPath: string) {
    const removedPageBreaks = await this.docxService.removePageBreaks(
      filteredDocumentPath,
    )

    if (!removedPageBreaks) {
      throw new HttpException(
        'Error eliminando saltos de página',
        HttpStatus.CONFLICT,
      )
    }

    return removedPageBreaks
  }

  async resolveDirectory(councilPath: string) {
    const path = await this.fileSystemService.resolveDirectory(councilPath)

    if (!path) {
      throw new HttpException(
        'Error resolviendo el directorio',
        HttpStatus.CONFLICT,
      )
    }

    return path
  }
}

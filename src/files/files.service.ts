import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { GcpService } from '../gcp/gcp.service'

@Injectable()
export class FilesService {
  constructor(private readonly gcpService: GcpService) {}

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
}

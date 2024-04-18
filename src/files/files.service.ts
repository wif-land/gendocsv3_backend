import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { GcpService } from '../gcp/gcp.service'

@Injectable()
export class FilesService {
  constructor(private readonly gcpService: GcpService) {}

  async createDocument(title: string) {
    try {
      const document = await this.gcpService.createDocument(title)

      if (!document) {
        throw new HttpException('Error creating document', HttpStatus.CONFLICT)
      }

      return document
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async createDocumentByParentId(title: string, parentId: string) {
    try {
      const document = await this.gcpService.createDocumentByParentId(
        title,
        parentId,
      )

      if (!document) {
        throw new HttpException('Error creating document', HttpStatus.CONFLICT)
      }

      return document
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async createDocumentByParentIdAndCopy(
    title: string,
    parentId: string,
    documentId: string,
  ) {
    try {
      const document = await this.gcpService.createDocumentByParentIdAndCopy(
        title,
        parentId,
        documentId,
      )

      if (!document) {
        throw new HttpException('Error creating document', HttpStatus.CONFLICT)
      }

      return document
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async renameAsset(documentId: string, title: string) {
    try {
      const document = await this.gcpService.renameAsset(documentId, title)

      if (!document) {
        throw new HttpException('Error renaming document', HttpStatus.CONFLICT)
      }

      return document
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async moveAsset(documentId: string, parentId: string) {
    try {
      const document = await this.gcpService.moveAsset(documentId, parentId)

      if (!document) {
        throw new HttpException('Error moving document', HttpStatus.CONFLICT)
      }

      return document
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async createFolderByParentId(title: string, parentId: string) {
    try {
      const folder = await this.gcpService.createFolderByParentId(
        title,
        parentId,
      )

      if (!folder) {
        throw new HttpException('Error creating folder', HttpStatus.CONFLICT)
      }

      return folder
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async replaceTextOnDocument(data: object, documentId: string) {
    try {
      const result = await this.gcpService.replaceTextOnDocument(
        data,
        documentId,
      )

      if (!result) {
        throw new HttpException(
          'Error replacing text on document',
          HttpStatus.CONFLICT,
        )
      }

      return result
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async remove(assetId: string) {
    try {
      const result = await this.gcpService.remove(assetId)

      if (!result) {
        throw new HttpException('Error removing asset', HttpStatus.CONFLICT)
      }

      return result
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}

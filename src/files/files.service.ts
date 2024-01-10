import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { GcpService } from '../gcp/gcp.service'

@Injectable()
export class FilesService {
  constructor(private readonly gcpService: GcpService) {}

  async createDocument(title: string): Promise<string> {
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

  async createDocumentByParentId(
    title: string,
    parentId: string,
  ): Promise<string> {
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
  ): Promise<string> {
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

  async renameAsset(documentId: string, title: string): Promise<string> {
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

  async createFolderByParentId(
    title: string,
    parentId: string,
  ): Promise<string> {
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
}

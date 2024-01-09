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

  async createFolder(title: string, parents: string[]): Promise<string> {
    try {
      const folder = await this.gcpService.createFolder(title, parents)

      if (!folder) {
        throw new HttpException('Error creating folder', HttpStatus.CONFLICT)
      }

      return folder
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}

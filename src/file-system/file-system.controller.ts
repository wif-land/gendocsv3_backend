import { Controller, Post } from '@nestjs/common'
import { FileSystemService } from './file-system.service'

@Controller('file-system')
export class FileSystemController {
  constructor(private readonly fileSystemService: FileSystemService) {}
  @Post()
  async createDocument() {
    try {
      return await this.fileSystemService.createDocument()
    } catch (error) {
      console.error(error)
      return error
    }
  }
}

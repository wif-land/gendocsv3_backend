import { Controller, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { FilesService } from './services/files.service'
import { Auth } from '../auth/decorators/auth-decorator'
import { FileSystemService } from './services/file-system.service'

@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(
    private filesService: FilesService,
    private readonly filesSystemService: FileSystemService,
  ) {}

  @Auth()
  @Post()
  async createDocument() {
    const document = await this.filesService.createDocument('Test from JAIR!')

    return document
  }

  @Post('file-system')
  async createDocumentFileSystem() {
    try {
      return await this.filesSystemService.createDocument()
    } catch (error) {
      console.error(error)
      return error
    }
  }
}

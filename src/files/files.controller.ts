import { Controller, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { FilesService } from './files.service'
import { Auth } from '../auth/auth-decorator'

@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(private filesService: FilesService) {}

  @Auth()
  @Post()
  async createDocument(): Promise<string> {
    return await this.filesService.createDocument('Test from JAIR!')
  }
}

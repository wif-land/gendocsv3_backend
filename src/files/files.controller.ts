import { Controller, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { FilesService } from './files.service'
import { Auth } from '../auth/decorators/auth-decorator'
import { ApiResponse } from '../shared/interfaces/response.interface'

@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(private filesService: FilesService) {}

  @Auth()
  @Post()
  async createDocument(): Promise<ApiResponse<string>> {
    const document = await this.filesService.createDocument('Test from JAIR!')

    return document
  }
}

import { Body, Controller, Logger, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { FilesService } from './services/files.service'
import { Auth } from '../auth/decorators/auth-decorator'

@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(private filesService: FilesService) {}

  @Auth()
  @Post()
  async createDocument() {
    const document = await this.filesService.createDocument('Test from JAIR!')

    return document
  }

  @Post('share')
  async shareAsset(
    @Body() { email, driveId }: { email: string; driveId: string },
  ) {
    try {
      const result = await this.filesService.shareAsset(driveId, email)

      return result
    } catch (error) {
      Logger.error(error)
    }
  }
}

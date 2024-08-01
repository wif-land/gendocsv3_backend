import { Body, Controller, Delete, Logger, Param, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { FilesService } from './services/files.service'
import { Auth } from '../auth/decorators/auth.decorator'

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
      const result = await this.filesService.shareAsset(
        driveId,
        email,
        'writer',
      )

      return result
    } catch (error) {
      Logger.error(error)
    }
  }

  @Post('folder/:id')
  async createFolder(@Param('id') id: string, @Body() body: { name: string }) {
    const folder = await this.filesService.createFolderByParentId(body.name, id)

    return folder
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const result = await this.filesService.remove(id)

    return result
  }
}

import { Controller, Post, Body } from '@nestjs/common'
import { GcpService } from './gcp.service'

export interface ITestDto {
  templateId: string
  numdoc: string
  year: string
}

export interface CreateRecopilationDto {
  templateId: string
  documentsInfo: {
    id: string
    year: string
    numdoc: string
  }[]
}

@Controller('gcp')
export class GcpController {
  constructor(private gcpService: GcpService) {}

  @Post()
  async templateContent(@Body() data: ITestDto) {
    const recopilation = await this.gcpService.resolveTemplateSeparator(
      data.templateId,
      data.numdoc,
      data.year,
    )

    return recopilation
  }

  @Post('gpt')
  async gpt(@Body() data: CreateRecopilationDto) {
    try {
      const recopilation = await this.gcpService.compileSections(
        data.documentsInfo,
        data.templateId,
      )

      return recopilation
    } catch (error) {
      console.error(error)
      return error
    }
  }
}

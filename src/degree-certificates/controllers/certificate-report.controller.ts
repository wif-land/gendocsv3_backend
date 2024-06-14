import { Get } from '@nestjs/common/decorators/http/request-mapping.decorator'
import {
  Param,
  Query,
} from '@nestjs/common/decorators/http/route-params.decorator'
import { ApiTags } from '@nestjs/swagger'
import { CertificateReportsService } from '../services/certificate-reports.service'
import { Controller } from '@nestjs/common/decorators/core/controller.decorator'
import { ParseIntPipe } from '@nestjs/common'
import { ApiResponseDto } from '../../shared/dtos/api-response.dto'

@ApiTags('degree-certificates/reports')
@Controller('degree-certificates/reports')
export class CertificateReportsController {
  constructor(
    private readonly certificateReportsService: CertificateReportsService,
  ) {}

  @Get(':careerId')
  async getCertificateReport(
    @Param('careerId', ParseIntPipe) careerId: string,
    @Query('is-end') isEnd?: string,
  ) {
    const certificates =
      await this.certificateReportsService.getCertificatesReport(
        +careerId,
        isEnd === 'true',
      )

    return new ApiResponseDto('Reporte inicial encontrado', certificates)
  }
}

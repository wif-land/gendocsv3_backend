import { Get } from '@nestjs/common/decorators/http/request-mapping.decorator'
import { Query } from '@nestjs/common/decorators/http/route-params.decorator'
import { ApiTags } from '@nestjs/swagger'
import { CertificateReportsService } from '../services/certificate-reports.service'
import { Controller } from '@nestjs/common/decorators/core/controller.decorator'
import { HttpException, HttpStatus, Logger } from '@nestjs/common'
import { ApiResponseDto } from '../../shared/dtos/api-response.dto'
import { MIMETYPES } from '../../shared/constants/mime-types'
import { IDegreeCertificateFilters } from '../constants'

@ApiTags('degree-certificates/reports')
@Controller('degree-certificates/reports')
export class CertificateReportsController {
  constructor(
    private readonly certificateReportsService: CertificateReportsService,
  ) {}

  @Get()
  async getCertificateReport(@Query() filters: IDegreeCertificateFilters) {
    const certificates =
      await this.certificateReportsService.getCertificatesReport(filters)

    return new ApiResponseDto(
      `Reporte de certificados ${filters.endDate ? 'final' : 'inicial'}`,
      certificates,
    )
  }

  @Get('generate')
  async generateCertificateReport(@Query() filters: IDegreeCertificateFilters) {
    try {
      const buffer =
        await this.certificateReportsService.generateCertificateReport(filters)

      return new ApiResponseDto('Reporte generado', {
        file: buffer.toString('base64'),
        fileName: `Reporte-${filters.endDate ? 'final' : 'inicial'}.xlsx`,
        mimeType: MIMETYPES.XLSX,
      })
    } catch (error) {
      Logger.error(error)
      throw new HttpException(
        'Error al generar el reporte',
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      )
    }
  }
}

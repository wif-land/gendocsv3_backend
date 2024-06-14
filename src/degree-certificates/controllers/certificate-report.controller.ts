import { Get } from '@nestjs/common/decorators/http/request-mapping.decorator'
import {
  Param,
  Query,
} from '@nestjs/common/decorators/http/route-params.decorator'
import { ApiTags } from '@nestjs/swagger'
import { CertificateReportsService } from '../services/certificate-reports.service'
import { Controller } from '@nestjs/common/decorators/core/controller.decorator'
import { HttpException, HttpStatus, Logger, ParseIntPipe } from '@nestjs/common'
import { ApiResponseDto } from '../../shared/dtos/api-response.dto'
import { MIMETYPES } from '../../shared/constants/mime-types'

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

  @Get('generate/:careerId')
  async generateCertificateReport(
    @Param('careerId', ParseIntPipe) careerId: string,
    @Query('is-end') isEnd?: string,
  ) {
    try {
      const buffer =
        await this.certificateReportsService.generateCertificateReport(
          +careerId,
          isEnd === 'true',
        )

      return new ApiResponseDto('Reporte generado', {
        file: buffer.toString('base64'),
        fileName: `Reporte-${isEnd === 'true' ? 'final' : 'inicial'}.xlsx`,
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

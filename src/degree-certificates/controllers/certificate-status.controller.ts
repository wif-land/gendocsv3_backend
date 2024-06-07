import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common'
import { CertificateStatusService } from '../services/certificate-status.service'
import { CreateCertificateStatusDto } from '../dto/create-certificate-status.dto'
import { UpdateCertificateStatusDto } from '../dto/update-certificate-status.dto'
import { ApiResponseDto } from '../../shared/dtos/api-response.dto'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('degree-certificates/certificate-status')
@Controller('degree-certificates/certificate-status')
export class CertificateStatusController {
  constructor(
    private readonly certificateStatusService: CertificateStatusService,
  ) {}

  @Get()
  async getCertificateStatus() {
    return await this.certificateStatusService.findAllCertificateStatus()
  }

  @Post()
  async createCertificateStatus(@Body() dto: CreateCertificateStatusDto) {
    return await this.certificateStatusService.createCertificateStatus(dto)
  }

  @Patch('/:id')
  async updateCertificateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCertificateStatusDto,
  ) {
    return await this.certificateStatusService.updateCertificateStatus(id, dto)
  }

  @Delete('/:id')
  async deleteCertificateStatus(@Param('id', ParseIntPipe) id: number) {
    return await this.certificateStatusService.deleteCertificateStatus(id)
  }

  @Get('/:certificateTypeId')
  async showCertificateStatusByType(
    @Param('certificateTypeId', ParseIntPipe) certificateTypeId: number,
  ) {
    const certificateStatus =
      await this.certificateStatusService.getCertificateStatusByType(
        certificateTypeId,
      )

    return new ApiResponseDto(
      'Listado de estados de certificado obtenido exitosamente',
      certificateStatus,
    )
  }

  @Get('certificate-status-type/:certificateTypeId/:statusId')
  async showCertificateStatusByTypeAndStatus(
    @Param('certificateTypeId', ParseIntPipe) certificateTypeId: number,
    @Param('statusId', ParseIntPipe) statusId: number,
  ) {
    const certificateStatus =
      await this.certificateStatusService.findCertificateStatusType(
        certificateTypeId,
        statusId,
      )

    return new ApiResponseDto(
      'Listado de estados de certificado obtenido exitosamente',
      certificateStatus,
    )
  }
}

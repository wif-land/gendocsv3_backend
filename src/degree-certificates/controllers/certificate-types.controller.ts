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
import { ApiResponseDto } from '../../shared/dtos/api-response.dto'
import { CreateCertificateTypeDto } from '../dto/create-certificate-type.dto'
import { UpdateCertificateTypeDto } from '../dto/update-certificate-type.dto'
import { CertificateTypeService } from '../services/certificate-type.service'

@Controller('degree-certificates/certificate-types')
export class CertificateTypesController {
  constructor(
    private readonly certificateTypeService: CertificateTypeService,
  ) {}

  @Get()
  async getCertificateTypes() {
    return await this.certificateTypeService.findAllCertificateTypes()
  }

  @Post()
  async createCertificateType(@Body() dto: CreateCertificateTypeDto) {
    return await this.certificateTypeService.createCertificateType(dto)
  }

  @Patch('/:id')
  async updateCertificateType(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCertificateTypeDto,
  ) {
    return await this.certificateTypeService.updateCertificateType(id, dto)
  }

  @Delete('/:id')
  async deleteCertificateType(@Param('id', ParseIntPipe) id: number) {
    return await this.certificateTypeService.deleteCertificateType(id)
  }

  @Get('certifitace-types-career/:careerId')
  async showCertificateTypesCarrerByCarrer(
    @Param('careerId', ParseIntPipe) careerId: number,
  ) {
    const certificateTypes =
      await this.certificateTypeService.getCertificateTypesCarrerByCarrer(
        careerId,
      )

    return new ApiResponseDto(
      'Listado de modalidades de grado obtenido exitosamente',
      certificateTypes,
    )
  }

  @Get('certificate-type-status-career')
  async showCertificateTypeStatusCareer() {
    const certificateTypeStatusCareer =
      await this.certificateTypeService.getCertificateTypeStatusCareer()

    return new ApiResponseDto(
      'Listado de modalidades de grado, estados de certificado y carreras obtenido exitosamente',
      certificateTypeStatusCareer,
    )
  }
}

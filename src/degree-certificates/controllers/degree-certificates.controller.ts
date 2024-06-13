import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { CreateDegreeCertificateDto } from '../dto/create-degree-certificate.dto'
import { UpdateDegreeCertificateDto } from '../dto/update-degree-certificate.dto'
import { ApiResponseDto } from '../../shared/dtos/api-response.dto'
import { PaginationDto } from '../../shared/dtos/pagination.dto'
import { Auth } from '../../auth/decorators/auth-decorator'
import { RolesType } from '../../auth/decorators/roles-decorator'
import { DegreeCertificatesService } from '../degree-certificates.service'
import { CertificateBulkService } from '../services/certificate-bulk.service'
import { CreateDegreeCertificateBulkDto } from '../dto/create-degree-certificate-bulk.dto'
import { ApiTags } from '@nestjs/swagger'
import { CertificateNumerationService } from '../services/certificate-numeration.service'

@ApiTags('degree-certificates')
@Controller('degree-certificates')
export class DegreeCertificatesController {
  constructor(
    private readonly degreeCertificatesService: DegreeCertificatesService,
    private readonly certificateBulkService: CertificateBulkService,
    private readonly certificateNumerationService: CertificateNumerationService,
  ) {}

  // #region DegreeCertificates
  @Auth(RolesType.ADMIN, RolesType.READER)
  @Get('carrer/:carrerId')
  async getDegreeCertificates(
    @Param('carrerId', ParseIntPipe) carrerId: number,
    @Query() paginationDto: PaginationDto,
  ) {
    return await this.degreeCertificatesService.findAll(paginationDto, carrerId)
  }

  @Auth(RolesType.ADMIN, RolesType.READER, RolesType.WRITER, RolesType.API)
  @Post()
  async createDegreeCertificate(@Body() dto: CreateDegreeCertificateDto) {
    return await this.degreeCertificatesService.create(dto)
  }

  @Auth(RolesType.ADMIN, RolesType.READER, RolesType.WRITER, RolesType.API)
  @Patch(':id')
  async updateDegreeCertificate(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDegreeCertificateDto,
  ) {
    return await this.degreeCertificatesService.update(id, dto)
  }

  @Auth(RolesType.ADMIN, RolesType.READER, RolesType.WRITER, RolesType.API)
  @Patch('numeration/generate/:careerId')
  async generateNumeration(@Param('careerId', ParseIntPipe) careerId: number) {
    return await this.certificateNumerationService.generateNumeration(careerId)
  }

  @Get('numeration/last-number-to-register/:careerId')
  async getLastNumberToRegister(
    @Param('careerId', ParseIntPipe) careerId: number,
  ) {
    const number =
      await this.certificateNumerationService.getLastNumberToRegister(careerId)

    return new ApiResponseDto('Siguiente número de registro encontrado', number)
  }

  @Get('numeration/enqueued/:careerId')
  async getNumerationEnqueued(
    @Param('careerId', ParseIntPipe) careerId: number,
  ) {
    const number =
      await this.certificateNumerationService.getNumerationEnqueued(careerId)

    return new ApiResponseDto('Siguiente número de registro encolado', number)
  }

  @Patch('generate-document/:id')
  async generateDocument(@Param('id', ParseIntPipe) id: number) {
    return await this.degreeCertificatesService.generateDocument(id)
  }

  @Patch('bulk/load/:userId')
  async loadBulk(
    @Body() createCertificatesDtos: CreateDegreeCertificateBulkDto[],
    @Param('userId', ParseIntPipe) userId: number,
    @Query('retry-id') retryId?: number,
  ) {
    const certificates =
      await this.certificateBulkService.createBulkCertificates(
        createCertificatesDtos,
        userId,
        retryId ? +retryId : undefined,
      )

    return new ApiResponseDto('Certificados cargados', certificates)
  }
}

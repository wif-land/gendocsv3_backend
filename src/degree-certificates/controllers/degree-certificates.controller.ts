import {
  Body,
  Controller,
  Delete,
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
import { Auth } from '../../auth/decorators/auth.decorator'
import {
  RolesThatCanMutate,
  RolesThatCanQuery,
} from '../../shared/constants/roles'
import { DegreeCertificatesService } from '../services/degree-certificates.service'
import { CertificateBulkService } from '../services/certificate-bulk.service'
import { CreateDegreeCertificateBulkDto } from '../dto/create-degree-certificate-bulk.dto'
import { ApiTags } from '@nestjs/swagger'
import { CertificateNumerationService } from '../services/certificate-numeration.service'
import { IDegreeCertificateFilters } from '../constants'

@ApiTags('degree-certificates')
@Controller('degree-certificates')
export class DegreeController {
  constructor(
    private readonly degreeService: DegreeCertificatesService,
    private readonly certificateBulkService: CertificateBulkService,
    private readonly certificateNumerationService: CertificateNumerationService,
  ) {}

  // #region DegreeCertificates
  @Auth(...RolesThatCanQuery)
  @Get()
  async getDegreeCertificates(
    @Query() paginationDto: IDegreeCertificateFilters,
  ) {
    return await this.degreeService.findAll(paginationDto)
  }

  @Auth(...RolesThatCanMutate)
  @Post()
  async createDegreeCertificate(@Body() dto: CreateDegreeCertificateDto) {
    return await this.degreeService.create(dto)
  }

  @Auth(...RolesThatCanMutate)
  @Patch(':id')
  async updateDegreeCertificate(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDegreeCertificateDto,
  ) {
    return await this.degreeService.update(id, dto)
  }

  @Auth(...RolesThatCanMutate)
  @Patch('numeration/generate/:careerId')
  async generateNumeration(@Param('careerId', ParseIntPipe) careerId: number) {
    return await this.certificateNumerationService.generateNumeration(careerId)
  }

  @Auth(...RolesThatCanQuery)
  @Get('numeration/last-number-to-register/:careerId')
  async getLastNumberToRegister(
    @Param('careerId', ParseIntPipe) careerId: number,
  ) {
    const number =
      await this.certificateNumerationService.getLastNumberToRegister(careerId)

    return new ApiResponseDto('Siguiente número de registro encontrado', number)
  }

  @Auth(...RolesThatCanQuery)
  @Get('numeration/enqueued/:careerId')
  async getNumerationEnqueued(
    @Param('careerId', ParseIntPipe) careerId: number,
  ) {
    const number =
      await this.certificateNumerationService.getNumerationEnqueued(careerId)

    return new ApiResponseDto('Siguiente número de registro encolado', number)
  }

  @Auth(...RolesThatCanMutate)
  @Patch('generate-document/:id')
  async generateDocument(@Param('id', ParseIntPipe) id: number) {
    return await this.degreeService.generateDocument(id)
  }

  @Auth(...RolesThatCanMutate)
  @Patch('bulk/load/:userId')
  async loadBulk(
    @Body() createCertificatesDtos: CreateDegreeCertificateBulkDto[],
    @Param('userId', ParseIntPipe) userId: number,
    @Query('retry-id') retryId?: number,
  ) {
    this.certificateBulkService.createBulkCertificates(
      createCertificatesDtos,
      userId,
      retryId ? +retryId : undefined,
    )
    return new ApiResponseDto('Proceso de carga en ejecución', true)
  }

  @Auth(...RolesThatCanQuery)
  @Get('check-presentation-date')
  async checkPresentationDate(
    @Body()
    {
      presentationDate,
      duration,
      roomId,
    }: {
      presentationDate?: Date
      duration?: number
      roomId?: number
    },
  ) {
    await this.degreeService.checkPresentationDate({
      presentationDate,
      duration,
      roomId,
    })
  }

  @Auth(...RolesThatCanQuery)
  @Get('/get-one/:id')
  async getCertificate(@Param('id', ParseIntPipe) id: number) {
    return new ApiResponseDto(
      'Certificado encontrado',
      await this.degreeService.findById(id),
    )
  }

  @Auth(...RolesThatCanMutate)
  @Delete(':id')
  async deleteDegreeCertificate(@Param('id', ParseIntPipe) id: number) {
    return await this.degreeService.remove(id)
  }
}

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
import { DegreeCertificatesService } from './degree-certificates.service'
import { CreateCertificateStatusDto } from './dto/create-certificate-status.dto'
import { UpdateCertificateStatusDto } from './dto/update-certificate-status.dto'
import { CreateCertificateTypeDto } from './dto/create-certificate-type.dto'
import { UpdateCertificateTypeDto } from './dto/update-certificate-type.dto'
import { CreateDegreeModalityDto } from './dto/create-degree-modality.dto'
import { UpdateDegreeModalityDto } from './dto/update-degree-modality.dto'
import { CreateRoomDto } from './dto/create-room.dto'
import { UpdateRoomDto } from './dto/update-room.dto'
import { CreateDegreeCertificateDto } from './dto/create-degree-certificate.dto'
import { UpdateDegreeCertificateDto } from './dto/update-degree-certificate.dto'
import { ApiResponseDto } from '../shared/dtos/api-response.dto'
import { CreateCellGradeDegreeCertificateTypeDto } from './dto/create-cells-grade-degree-certificate-type.dto'
import { UpdateCellGradeDegreeCertificateTypeDto } from './dto/update-cells-grade-degree-certificate-type.dto'
import { PaginationDto } from '../shared/dtos/pagination.dto'

@Controller('degree-certificates')
export class DegreeCertificatesController {
  constructor(
    private readonly degreeCertificatesService: DegreeCertificatesService,
  ) {}

  // #region DegreeCertificates
  @Get()
  async getDegreeCertificates(@Query() paginationDto: PaginationDto) {
    return await this.degreeCertificatesService.findAll(paginationDto)
  }

  @Post()
  async createDegreeCertificate(@Body() dto: CreateDegreeCertificateDto) {
    return await this.degreeCertificatesService.create(dto)
  }

  @Patch(':id')
  async updateDegreeCertificate(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDegreeCertificateDto,
  ) {
    return await this.degreeCertificatesService.update(id, dto)
  }

  @Patch('numeration/generate/:careerId')
  async generateNumeration(@Param('careerId', ParseIntPipe) careerId: number) {
    return await this.degreeCertificatesService.generateNumeration(careerId)
  }

  @Get('numeration/last-number-to-register/:careerId')
  async getLastNumberToRegister(
    @Param('careerId', ParseIntPipe) careerId: number,
  ) {
    const number = await this.degreeCertificatesService.getLastNumberToRegister(
      careerId,
    )

    return new ApiResponseDto('Siguiente número de registro encontrado', number)
  }

  @Patch('generate-document/:id')
  async generateDocument(@Param('id', ParseIntPipe) id: number) {
    return await this.degreeCertificatesService.generateDocument(id)
  }

  // #endregion

  // #region GradeCells
  @Get('grade-cells/by-certificate-type/:certificateTypeId')
  async showGradeCellsByCertificateType(
    @Param('certificateTypeId', ParseIntPipe) certificateTypeId: number,
  ) {
    const gradeCells =
      await this.degreeCertificatesService.getGradeCellsByCertificateType(
        certificateTypeId,
      )

    return new ApiResponseDto(
      'Listado de celdas de grado obtenido exitosamente',
      gradeCells,
    )
  }

  @Post('grade-cells')
  async createGradeCell(
    @Body()
    createCellGradeDegreeCertificateTypeDto: CreateCellGradeDegreeCertificateTypeDto,
  ) {
    return await this.degreeCertificatesService.createCellGradeByCertificateType(
      createCellGradeDegreeCertificateTypeDto,
    )
  }

  @Patch('grade-cells/:id')
  async updateGradeCell(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCellGradeDegreeCertificateTypeDto,
  ) {
    return await this.degreeCertificatesService.updateCellGradeByCertificateType(
      id,
      dto,
    )
  }

  @Delete('grade-cells/:id')
  async deleteGradeCell(@Param('id', ParseIntPipe) id: number) {
    return await this.degreeCertificatesService.deleteCellGradeByCertificateType(
      id,
    )
  }
  // #endregion

  // @Delete(':id')
  // async deleteDegreeCertificate(@Param('id', ParseIntPipe) id: number) {
  //   return await this.degreeCertificatesService.delete(id)
  // }

  // #region CertificateStatus
  @Get('certificate-status')
  async getCertificateStatus() {
    return await this.degreeCertificatesService.findAllCertificateStatus()
  }

  @Post('certificate-status')
  async createCertificateStatus(@Body() dto: CreateCertificateStatusDto) {
    return await this.degreeCertificatesService.createCertificateStatus(dto)
  }

  @Patch('certificate-status/:id')
  async updateCertificateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCertificateStatusDto,
  ) {
    return await this.degreeCertificatesService.updateCertificateStatus(id, dto)
  }

  @Delete('certificate-status/:id')
  async deleteCertificateStatus(@Param('id', ParseIntPipe) id: number) {
    return await this.degreeCertificatesService.deleteCertificateStatus(id)
  }
  // #endregion

  // #region CertificateTypes
  @Get('certificate-types')
  async getCertificateTypes() {
    return await this.degreeCertificatesService.findAllCertificateTypes()
  }

  @Post('certificate-types')
  async createCertificateType(@Body() dto: CreateCertificateTypeDto) {
    return await this.degreeCertificatesService.createCertificateType(dto)
  }

  @Patch('certificate-types/:id')
  async updateCertificateType(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCertificateTypeDto,
  ) {
    return await this.degreeCertificatesService.updateCertificateType(id, dto)
  }

  @Delete('certificate-types/:id')
  async deleteCertificateType(@Param('id', ParseIntPipe) id: number) {
    return await this.degreeCertificatesService.deleteCertificateType(id)
  }

  @Get('certifitace-types-career/:careerId')
  async showCertificateTypesCarrerByCarrer(
    @Param('careerId', ParseIntPipe) careerId: number,
  ) {
    const certificateTypes =
      await this.degreeCertificatesService.getCertificateTypesCarrerByCarrer(
        careerId,
      )

    return new ApiResponseDto(
      'Listado de modalidades de grado obtenido exitosamente',
      certificateTypes,
    )
  }

  @Get('certificate-status/:certificateTypeId')
  async showCertificateStatusByType(
    @Param('certificateTypeId', ParseIntPipe) certificateTypeId: number,
  ) {
    const certificateStatus =
      await this.degreeCertificatesService.getCertificateStatusByType(
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
      await this.degreeCertificatesService.findCertificateStatusType(
        certificateTypeId,
        statusId,
      )

    return new ApiResponseDto(
      'Listado de estados de certificado obtenido exitosamente',
      certificateStatus,
    )
  }

  @Get('certificate-type-status-career')
  async showCertificateTypeStatusCareer() {
    const certificateTypeStatusCareer =
      await this.degreeCertificatesService.getCertificateTypeStatusCareer()

    return new ApiResponseDto(
      'Listado de modalidades de grado, estados de certificado y carreras obtenido exitosamente',
      certificateTypeStatusCareer,
    )
  }
  // #endregion

  // #region DegreeModalities
  @Get('degree-modalities')
  async getDegreeModalities() {
    return await this.degreeCertificatesService.findAllDegreeModalities()
  }

  @Post('degree-modalities')
  async createDegreeModality(@Body() dto: CreateDegreeModalityDto) {
    return await this.degreeCertificatesService.createDegreeModality(dto)
  }

  @Patch('degree-modalities/:id')
  async updateDegreeModality(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDegreeModalityDto,
  ) {
    return await this.degreeCertificatesService.updateDegreeModality(id, dto)
  }

  @Delete('degree-modalities/:id')
  async deleteDegreeModality(@Param('id', ParseIntPipe) id: number) {
    return await this.degreeCertificatesService.deleteDegreeModality(id)
  }
  // #endregion

  // #region Rooms
  @Get('rooms')
  async getRooms() {
    return await this.degreeCertificatesService.findAllRooms()
  }

  @Post('rooms')
  async createRoom(@Body() dto: CreateRoomDto) {
    return await this.degreeCertificatesService.createRoom(dto)
  }

  @Patch('rooms/:id')
  async updateRoom(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRoomDto,
  ) {
    return await this.degreeCertificatesService.updateRoom(id, dto)
  }

  @Delete('rooms/:id')
  async deleteRoom(@Param('id', ParseIntPipe) id: number) {
    return await this.degreeCertificatesService.deleteRoom(id)
  }

  // #endregion
}

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

@Controller('degree-certificates')
export class DegreeCertificatesController {
  constructor(
    private readonly degreeCertificatesService: DegreeCertificatesService,
  ) {}

  @Get()
  async getDegreeCertificates() {
    return await this.degreeCertificatesService.findAll()
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

  // @Delete(':id')
  // async deleteDegreeCertificate(@Param('id', ParseIntPipe) id: number) {
  //   return await this.degreeCertificatesService.delete(id)
  // }

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
}

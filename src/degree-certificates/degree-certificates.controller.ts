import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DegreeCertificatesService } from './degree-certificates.service';
import { CreateDegreeCertificateDto } from './dto/create-degree-certificate.dto';
import { UpdateDegreeCertificateDto } from './dto/update-degree-certificate.dto';

@Controller('degree-certificates')
export class DegreeCertificatesController {
  constructor(private readonly degreeCertificatesService: DegreeCertificatesService) {}

  @Post()
  create(@Body() createDegreeCertificateDto: CreateDegreeCertificateDto) {
    return this.degreeCertificatesService.create(createDegreeCertificateDto);
  }

  @Get()
  findAll() {
    return this.degreeCertificatesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.degreeCertificatesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDegreeCertificateDto: UpdateDegreeCertificateDto) {
    return this.degreeCertificatesService.update(+id, updateDegreeCertificateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.degreeCertificatesService.remove(+id);
  }
}

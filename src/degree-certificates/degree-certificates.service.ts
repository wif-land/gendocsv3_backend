import { Injectable } from '@nestjs/common';
import { CreateDegreeCertificateDto } from './dto/create-degree-certificate.dto';
import { UpdateDegreeCertificateDto } from './dto/update-degree-certificate.dto';

@Injectable()
export class DegreeCertificatesService {
  create(createDegreeCertificateDto: CreateDegreeCertificateDto) {
    return 'This action adds a new degreeCertificate';
  }

  findAll() {
    return `This action returns all degreeCertificates`;
  }

  findOne(id: number) {
    return `This action returns a #${id} degreeCertificate`;
  }

  update(id: number, updateDegreeCertificateDto: UpdateDegreeCertificateDto) {
    return `This action updates a #${id} degreeCertificate`;
  }

  remove(id: number) {
    return `This action removes a #${id} degreeCertificate`;
  }
}

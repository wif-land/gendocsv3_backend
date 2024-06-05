import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { DegreeCertificateEntity } from '../entities/degree-certificate.entity'

@Injectable()
export class DegreeCertificateRepository {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  private get qb() {
    return this.dataSource
      .getRepository(DegreeCertificateEntity)
      .createQueryBuilder()
  }

  async findAll() {
    return this.qb.getMany()
  }

  async findReplicate({
    topic,
    studentId,
    certificateTypeId,
    degreeModalityId,
  }): Promise<DegreeCertificateEntity> {
    return this.qb
      .leftJoinAndSelect('degreeCertificate.student', 'student')
      .leftJoinAndSelect('degreeCertificate.certificateType', 'certificateType')
      .leftJoinAndSelect('degreeCertificate.degreeModality', 'degreeModality')
      .where('topic = :topic', { topic })
      .andWhere('student.id = :studentId', { studentId })
      .andWhere('certificateType.id = :certificateTypeId', {
        certificateTypeId,
      })
      .andWhere('degreeModality.id = :degreeModalityId', { degreeModalityId })
      .getOne()
  }
}

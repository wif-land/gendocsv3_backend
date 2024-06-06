import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { DegreeCertificateEntity } from '../entities/degree-certificate.entity'

@Injectable()
export class DegreeCertificateRepository extends Repository<DegreeCertificateEntity> {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {
    super(DegreeCertificateRepository, dataSource.manager)
  }

  private get qb() {
    return super.createQueryBuilder()
  }

  async findAll() {
    return this.qb.getMany()
  }

  async findReplicate({
    topic,
    studentId,
    certificateTypeId,
    degreeModalityId,
  }: {
    topic: string
    studentId: number
    certificateTypeId: number
    degreeModalityId: number
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

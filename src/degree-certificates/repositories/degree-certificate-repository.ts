import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource, FindOneOptions, Repository } from 'typeorm'
import { DegreeCertificateEntity } from '../entities/degree-certificate.entity'

@Injectable()
export class DegreeCertificateRepository extends Repository<DegreeCertificateEntity> {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {
    super(
      DegreeCertificateEntity,
      dataSource.getRepository(DegreeCertificateEntity).manager,
    )
  }

  private get qb() {
    return super.createQueryBuilder('degreeCertificate')
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

  async findOneFor(
    options: FindOneOptions<DegreeCertificateEntity>,
  ): Promise<DegreeCertificateEntity> {
    return this.qb
      .leftJoinAndSelect('degreeCertificate.student', 'student')
      .leftJoinAndSelect('degreeCertificate.certificateType', 'certificateType')
      .leftJoinAndSelect('degreeCertificate.degreeModality', 'degreeModality')
      .leftJoinAndSelect(
        'degreeCertificate.certificateStatus',
        'certificateStatus',
      )
      .leftJoinAndSelect('degreeCertificate.career', 'career')
      .leftJoinAndSelect(
        'degreeCertificate.submoduleYearModule',
        'submoduleYearModule',
      )
      .leftJoinAndSelect('degreeCertificate.room', 'room')
      .leftJoinAndSelect('degreeCertificate.user', 'user')
      .where(options.where)
      .getOne()
  }
}

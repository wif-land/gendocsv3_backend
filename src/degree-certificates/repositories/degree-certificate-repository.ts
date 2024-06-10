import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import {
  DataSource,
  FindManyOptions,
  FindOneOptions,
  Repository,
} from 'typeorm'
import { DegreeCertificateEntity } from '../entities/degree-certificate.entity'
import { CreateDegreeCertificateDto } from '../dto/create-degree-certificate.dto'
import { SubmoduleYearModuleEntity } from '../../year-module/entities/submodule-year-module.entity'
import { CERT_STATUS_CODE } from '../../shared/enums/genders'

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
      .leftJoinAndSelect('student.career', 'studentCareer')
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

  async findManyFor(
    options: FindManyOptions<DegreeCertificateEntity>,
  ): Promise<DegreeCertificateEntity[]> {
    return this.qb
      .leftJoinAndSelect('degreeCertificate.student', 'student')
      .leftJoinAndSelect('student.career', 'studentCareer')
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
      .take(options.take)
      .skip(options.skip)
      .getMany()
  }

  async findStrictReplicate(
    dto: CreateDegreeCertificateDto,
    subModuleYearModule: SubmoduleYearModuleEntity,
  ) {
    const degreeCertificate = await this.qb
      .leftJoinAndSelect('degreeCertificates.student', 'student')
      .leftJoinAndSelect('degreeCertificates.career', 'career')
      .leftJoinAndSelect(
        'degreeCertificates.certificateType',
        'certificateType',
      )
      .leftJoinAndSelect(
        'degreeCertificates.certificateStatus',
        'certificateStatus',
      )
      .leftJoinAndSelect('degreeCertificates.degreeModality', 'degreeModality')
      .leftJoinAndSelect('degreeCertificates.room', 'room')
      .leftJoinAndSelect(
        'degreeCertificates.submoduleYearModule',
        'submoduleYearModule',
      )
      .leftJoinAndSelect('degreeCertificates.user', 'user')
      .where('degreeCertificates.deletedAt IS NULL')
      .andWhere('degreeCertificates.presentationDate = :presentationDate', {
        presentationDate: dto.presentationDate,
      })
      .andWhere('degreeCertificates.student = :student', {
        student: dto.studentId,
      })
      .andWhere('degreeCertificates.isClosed = :isClosed', { isClosed: false })
      .andWhere('degreeCertificates.certificateType = :certificateType', {
        certificateType: dto.certificateTypeId,
      })
      .andWhere('degreeCertificates.certificateStatus = :certificateStatus', {
        certificateStatus: dto.certificateStatusId,
      })
      .andWhere('degreeCertificates.degreeModality = :degreeModality', {
        degreeModality: dto.degreeModalityId,
      })
      .andWhere('degreeCertificates.room = :room', {
        room: dto.roomId,
      })
      .andWhere(
        'degreeCertificates.submoduleYearModule = :submoduleYearModule',
        { submoduleYearModule: subModuleYearModule.id },
      )
      .getOne()

    return degreeCertificate
  }

  async findApprovedByStudent(studentId: number) {
    return await this.qb
      .leftJoinAndSelect('degreeCertificate.student', 'student')
      .leftJoinAndSelect('student.career', 'studentCareer')
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
      .where('student.id = :studentId', { studentId })
      .where(`certificateStatus.code = ${CERT_STATUS_CODE.APRO}`)
      .getOne()
  }

  async findCertificatesInDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<DegreeCertificateEntity[]> {
    return this.qb
      .leftJoinAndSelect('degreeCertificate.student', 'student')
      .leftJoinAndSelect('student.career', 'studentCareer')
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
      .where(
        'degreeCertificate.presentationDate BETWEEN :startDate AND :endDate',
        {
          startDate,
          endDate,
        },
      )
      .andWhere('degreeCertificate.deletedAt IS NULL')
      .andWhere('degreeCertificate.isClosed = :isClosed', { isClosed: false })
      .getMany()
  }

  async countCertificatesInDateRangeByRoom(
    startDate: Date,
    endDate: Date,
    roomId: number,
  ): Promise<number> {
    return this.qb
      .where(
        'degreeCertificate.presentationDate BETWEEN :startDate AND :endDate',
        {
          startDate,
          endDate,
        },
      )
      .andWhere('degreeCertificate.deletedAt IS NULL')
      .andWhere('degreeCertificate.isClosed = :isClosed', { isClosed: false })
      .andWhere('degreeCertificate.room = :roomId', { roomId })
      .getCount()
  }
}

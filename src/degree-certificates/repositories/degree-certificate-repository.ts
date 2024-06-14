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

  async findReplicate(studentId: number): Promise<DegreeCertificateEntity> {
    return this.qb
      .leftJoinAndSelect('degreeCertificate.student', 'student')
      .leftJoinAndSelect('degreeCertificate.certificateType', 'certificateType')
      .leftJoinAndSelect('degreeCertificate.degreeModality', 'degreeModality')
      .andWhere('student.id = :studentId', { studentId })
      .andWhere('degreeCertificate.deletedAt IS NULL')
      .orderBy('degreeCertificate.id', 'DESC')
      .getOne()
  }

  async findOneFor(
    options: FindOneOptions<DegreeCertificateEntity>,
  ): Promise<DegreeCertificateEntity> {
    const query = this.qb
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

    if (options.order) {
      query.setFindOptions({
        order: options.order,
      })
    }

    return query.getOne()
  }

  async findManyFor(
    options: FindManyOptions<DegreeCertificateEntity>,
  ): Promise<DegreeCertificateEntity[]> {
    const query = this.qb
      .leftJoinAndSelect('degreeCertificate.student', 'student')
      .leftJoinAndSelect('student.career', 'studentCareer')
      .leftJoinAndSelect('student.canton', 'canton')
      .leftJoinAndSelect('canton.province', 'province')
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

    if (options.order) {
      query.setFindOptions({
        order: options.order,
      })
    }

    if (options.take && options.skip) {
      query.take(options.take)
      query.skip(options.skip)
    }
    return query.getMany()
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
    console.log('studentId', studentId)
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
      .where('degreeCertificate.deletedAt IS NULL')
      .andWhere('student.id = :studentId', { studentId })
      .andWhere(`certificateStatus.code = UPPER('${CERT_STATUS_CODE.APRO}')`)
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
      .where('degreeCertificate.deletedAt IS NULL')
      .andWhere('degreeCertificate.isClosed = :isClosed', { isClosed: false })
      .andWhere(
        'degreeCertificate.presentationDate BETWEEN :startDate AND :endDate',
        {
          startDate,
          endDate,
        },
      )
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

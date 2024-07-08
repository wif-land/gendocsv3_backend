import { Injectable } from '@nestjs/common'
import { CreateDegreeCertificateAttendanceDto } from './dto/create-degree-certificate-attendance.dto'
import { UpdateDegreeCertificateAttendanceDto } from './dto/update-degree-certificate-attendance.dto'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { DegreeCertificateAttendanceEntity } from './entities/degree-certificate-attendance.entity'
import { DataSource, EntityManager, Repository } from 'typeorm'
import { DegreeCertificateAttendanceAlreadyExists } from './errors/degree-certificate-attendance-already-exists'
import { DegreeCertificateBadRequestError } from '../degree-certificates/errors/degree-certificate-bad-request'
import { ApiResponseDto } from '../shared/dtos/api-response.dto'
import { DegreeCertificateThatOverlapValidator } from './validators/degree-that-overlap'

@Injectable()
export class DegreeAttendanceService {
  constructor(
    @InjectRepository(DegreeCertificateAttendanceEntity)
    private readonly degreeCerAttendanceRepository: Repository<DegreeCertificateAttendanceEntity>,

    @InjectEntityManager()
    private entityManager: EntityManager,
    private dataSource: DataSource,
  ) {}

  async create(data: CreateDegreeCertificateAttendanceDto) {
    await this.validateDehreeCertificateAttendanceExists(
      data.degreeCertificateId,
      data.functionaryId,
    )

    const degreeCertificateAttendance =
      this.degreeCerAttendanceRepository.create({
        ...data,
        degreeCertificate: {
          id: data.degreeCertificateId,
        },
        functionary: {
          id: data.functionaryId,
        },
      })

    if (!degreeCertificateAttendance) {
      throw new DegreeCertificateBadRequestError(
        'No se pudo crear la asistencia al acta de grado',
      )
    }
    const newDegreeCertificateAttendance =
      await this.degreeCerAttendanceRepository.save(degreeCertificateAttendance)

    return new ApiResponseDto(
      'Asistencia al acta de grado creada con éxito',
      newDegreeCertificateAttendance,
    )
  }

  async createBulk(
    data: CreateDegreeCertificateAttendanceDto[],
  ): Promise<ApiResponseDto<DegreeCertificateAttendanceEntity[]>> {
    const degreeCertificateAttendance = data.map((attendance) => ({
      ...attendance,
      degreeCertificate: {
        id: attendance.degreeCertificateId,
      },
      functionary: {
        id: attendance.functionaryId,
      },
    }))

    let newDegreeCertificateAttendance = []

    await this.entityManager.transaction(async (transactionalEntityManager) => {
      newDegreeCertificateAttendance = await transactionalEntityManager.save(
        degreeCertificateAttendance,
      )
    })

    return new ApiResponseDto(
      'Asistencia al acta de grado creada con éxito',
      newDegreeCertificateAttendance,
    )
  }

  async findByDegreeCertificate(
    degreeCertificateId: number,
  ): Promise<ApiResponseDto<DegreeCertificateAttendanceEntity[]>> {
    const degreeCertificateAttendance = await this.degreeCerAttendanceRepository
      .createQueryBuilder('degreeCertificateAttendance')
      .leftJoinAndSelect(
        'degreeCertificateAttendance.functionary',
        'functionary',
      )
      .leftJoinAndSelect('functionary.thirdLevelDegree', 'thirdLevelDegree')
      .leftJoinAndSelect('functionary.fourthLevelDegree', 'fourthLevelDegree')
      .leftJoinAndSelect(
        'degreeCertificateAttendance.degreeCertificate',
        'degreeCertificate',
      )
      .where('degreeCertificate.id = :degreeCertificateId', {
        degreeCertificateId,
      })
      .addOrderBy('degreeCertificateAttendance.createdAt', 'ASC')
      .getMany()

    return new ApiResponseDto(
      'Asistencia al acta de grado encontrada con éxito',
      degreeCertificateAttendance,
    )
  }

  async update(
    id: number,
    updateAttendanceDto: UpdateDegreeCertificateAttendanceDto,
  ) {
    const degreeCertificateAttendance =
      await this.degreeCerAttendanceRepository.findOne({
        where: { id },
      })

    if (!degreeCertificateAttendance) {
      throw new DegreeCertificateBadRequestError(
        `No se encontró la asistencia al acta de grado con id ${id}`,
      )
    }

    if (
      'hasAttended' in updateAttendanceDto &&
      updateAttendanceDto.hasAttended
    ) {
      await new DegreeCertificateThatOverlapValidator(this.dataSource).validate(
        {
          degreeId: degreeCertificateAttendance.degreeCertificate.id,
          validateNewPresentationDate: false,
          roomId: degreeCertificateAttendance.degreeCertificate.room?.id,
        },
      )
    }

    if (
      (degreeCertificateAttendance.hasAttended ||
        degreeCertificateAttendance.hasBeenNotified) &&
      updateAttendanceDto.hasAttended === false
    ) {
      throw new DegreeCertificateBadRequestError(
        `No se puede actualizar la asistencia al acta de grado con id ${id} porque ya ha sido notificado o ha asistido`,
      )
    }

    const updatedDegreeCertificateAttendance =
      await this.degreeCerAttendanceRepository.save({
        id,
        ...updateAttendanceDto,
      })

    return new ApiResponseDto(
      'Asistencia al acta de grado actualizada con éxito',
      updatedDegreeCertificateAttendance,
    )
  }

  async updateBulk(
    updateDegreeCertificateAttendanceDto: UpdateDegreeCertificateAttendanceDto[],
  ) {
    const degreeCertificateAttendance =
      updateDegreeCertificateAttendanceDto.map((attendance) => ({
        ...attendance,
        degreeCertificate: {
          id: attendance.degreeCertificateId,
        },
        functionary: {
          id: attendance.functionaryId,
        },
      }))

    let updatedDegreeCertificateAttendance = []

    await this.entityManager.transaction(async (transactionalEntityManager) => {
      updatedDegreeCertificateAttendance =
        await transactionalEntityManager.save(degreeCertificateAttendance)
    })

    return new ApiResponseDto(
      'Asistencia al acta de grado actualizada con éxito',
      updatedDegreeCertificateAttendance,
    )
  }

  async remove(id: number) {
    const degreeCertificateAttendance =
      await this.degreeCerAttendanceRepository.findOne({
        where: { id },
      })

    if (!degreeCertificateAttendance) {
      throw new DegreeCertificateBadRequestError(
        `No se encontró la asistencia al acta de grado con id ${id}`,
      )
    }

    if (
      degreeCertificateAttendance.hasAttended ||
      degreeCertificateAttendance.hasBeenNotified
    ) {
      throw new DegreeCertificateBadRequestError(
        `No se puede eliminar la asistencia al acta de grado con id ${id} porque ya ha sido notificado o ha asistido`,
      )
    }

    await this.degreeCerAttendanceRepository.delete(id)
  }

  async removeAllAttendanceByDegreeCertificateId(degreeCertificateId: number) {
    const degreeCertificateAttendance =
      await this.degreeCerAttendanceRepository.find({
        where: { degreeCertificate: { id: degreeCertificateId } },
      })

    if (
      !degreeCertificateAttendance ||
      degreeCertificateAttendance.length === 0
    ) {
      return
    }

    await this.degreeCerAttendanceRepository.delete({
      degreeCertificate: { id: degreeCertificateId },
    })
  }

  private async validateDehreeCertificateAttendanceExists(
    degreeCertificateId: number,
    functionaryId: number,
  ) {
    const alreadyExists = await this.degreeCerAttendanceRepository.findOne({
      where: {
        degreeCertificate: {
          id: degreeCertificateId,
        },
        functionary: {
          id: functionaryId,
        },
      },
    })

    if (alreadyExists) {
      throw new DegreeCertificateAttendanceAlreadyExists(
        'Ya existe una asistencia al acta de grado para este funcionario y acta de grado',
      )
    }
  }
}

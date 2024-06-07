import { Injectable } from '@nestjs/common'
import { CreateDegreeCertificateAttendanceDto } from './dto/create-degree-certificate-attendance.dto'
import { UpdateDegreeCertificateAttendanceDto } from './dto/update-degree-certificate-attendance.dto'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { DegreeCertificateAttendanceEntity } from './entities/degree-certificate-attendance.entity'
import { EntityManager, Repository } from 'typeorm'
import { DegreeCertificateAttendanceAlreadyExists } from './errors/degree-certificate-attendance-already-exists'
import { DegreeCertificateBadRequestError } from '../degree-certificates/errors/degree-certificate-bad-request'
import { ApiResponseDto } from '../shared/dtos/api-response.dto'

@Injectable()
export class DegreeCertificateAttendanceService {
  constructor(
    @InjectRepository(DegreeCertificateAttendanceEntity)
    private readonly degreeCertificateAttendanceRepository: Repository<DegreeCertificateAttendanceEntity>,

    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {}

  async create(
    createDegreeCertificateAttendanceDto: CreateDegreeCertificateAttendanceDto,
  ) {
    const alreadyExists =
      await this.degreeCertificateAttendanceRepository.findOne({
        where: {
          degreeCertificate: {
            id: createDegreeCertificateAttendanceDto.degreeCertificateId,
          },
          functionary: {
            id: createDegreeCertificateAttendanceDto.functionaryId,
          },
        },
      })

    if (alreadyExists) {
      throw new DegreeCertificateAttendanceAlreadyExists(
        'Ya existe una asistencia al acta de grado para este funcionario y acta de grado',
      )
    }

    const degreeCertificateAttendance =
      this.degreeCertificateAttendanceRepository.create({
        ...createDegreeCertificateAttendanceDto,
        degreeCertificate: {
          id: createDegreeCertificateAttendanceDto.degreeCertificateId,
        },
        functionary: {
          id: createDegreeCertificateAttendanceDto.functionaryId,
        },
      })

    if (!degreeCertificateAttendance) {
      throw new DegreeCertificateBadRequestError(
        'No se pudo crear la asistencia al acta de grado',
      )
    }
    const newDegreeCertificateAttendance =
      await this.degreeCertificateAttendanceRepository.save(
        degreeCertificateAttendance,
      )

    return new ApiResponseDto(
      'Asistencia al acta de grado creada con éxito',
      newDegreeCertificateAttendance,
    )
  }

  async createBulk(
    createDegreeCertificateAttendanceDto: CreateDegreeCertificateAttendanceDto[],
  ): Promise<ApiResponseDto<DegreeCertificateAttendanceEntity[]>> {
    const degreeCertificateAttendance =
      createDegreeCertificateAttendanceDto.map((attendance) => ({
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
    const degreeCertificateAttendance =
      await this.degreeCertificateAttendanceRepository.find({
        where: { degreeCertificate: { id: degreeCertificateId } },
      })

    if (!degreeCertificateAttendance) {
      throw new DegreeCertificateBadRequestError(
        `No se encontró la asistencia al acta de grado con id ${degreeCertificateId}`,
      )
    }

    return new ApiResponseDto(
      'Asistencia al acta de grado encontrada con éxito',
      degreeCertificateAttendance,
    )
  }

  async update(
    id: number,
    updateDegreeCertificateAttendanceDto: UpdateDegreeCertificateAttendanceDto,
  ) {
    const degreeCertificateAttendance =
      await this.degreeCertificateAttendanceRepository.findOne({
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
        `No se puede actualizar la asistencia al acta de grado con id ${id} porque ya ha sido notificado o ha asistido`,
      )
    }

    const updatedDegreeCertificateAttendance =
      await this.degreeCertificateAttendanceRepository.save({
        id,
        ...updateDegreeCertificateAttendanceDto,
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
      await this.degreeCertificateAttendanceRepository.findOne({
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

    await this.degreeCertificateAttendanceRepository.delete(id)
  }

  async removeAllAttendanceByDegreeCertificateId(degreeCertificateId: number) {
    const degreeCertificateAttendance =
      await this.degreeCertificateAttendanceRepository.find({
        where: { degreeCertificate: { id: degreeCertificateId } },
      })

    if (!degreeCertificateAttendance) {
      return
    }

    await this.degreeCertificateAttendanceRepository.delete({
      degreeCertificate: { id: degreeCertificateId },
    })
  }
}

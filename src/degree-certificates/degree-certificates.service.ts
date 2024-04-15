import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CertificateStatusEntity } from './entities/certificate-status.entity'
import { Repository } from 'typeorm'
import { CreateCertificateStatusDto } from './dto/create-certificate-status.dto'
import { DegreeCertificateAlreadyExists } from './errors/degree-certificate-exists'
import { DegreeCertificateBadRequestError } from './errors/degree-certificate-bad-request'
import { UpdateCertificateStatusDto } from './dto/update-certificate-status.dto'
import { DegreeCertificateNotFoundError } from './errors/degree-certificate-not-found'
import { CertificateTypeEntity } from './entities/certificate-type.entity'
import { CreateCertificateTypeDto } from './dto/create-certificate-type.dto'
import { UpdateCertificateTypeDto } from './dto/update-certificate-type.dto'
import { DegreeModalityEntity } from './entities/degree-modality.entity'
import { CreateDegreeModalityDto } from './dto/create-degree-modality.dto'
import { UpdateDegreeModalityDto } from './dto/update-degree-modality.dto'
import { RoomEntity } from './entities/room.entity'
import { CreateRoomDto } from './dto/create-room.dto'
import { UpdateRoomDto } from './dto/update-room.dto'
import { DegreeCertificateEntity } from './entities/degree-certificate.entity'
import { CreateDegreeCertificateDto } from './dto/create-degree-certificate.dto'
import { UpdateDegreeCertificateDto } from './dto/update-degree-certificate.dto'
import { ApiResponse } from '../shared/interfaces/response.interface'
import { SystemYearEntity } from '../year-module/entities/system-year'
import { SubmoduleYearModuleEntity } from '../year-module/entities/submodule-year-module.entity'

@Injectable()
export class DegreeCertificatesService {
  constructor(
    @InjectRepository(SystemYearEntity)
    private readonly systemYearRepository: Repository<SystemYearEntity>,

    @InjectRepository(SubmoduleYearModuleEntity)
    private readonly subModuleYeatModuleRepository: Repository<SubmoduleYearModuleEntity>,

    @InjectRepository(DegreeCertificateEntity)
    private readonly degreeCertificateRepository: Repository<DegreeCertificateEntity>,

    @InjectRepository(CertificateStatusEntity)
    private readonly certificateStatusRepository: Repository<CertificateStatusEntity>,

    @InjectRepository(CertificateTypeEntity)
    private readonly certificateTypeRepository: Repository<CertificateTypeEntity>,

    @InjectRepository(DegreeModalityEntity)
    private readonly degreeModalityRepository: Repository<DegreeModalityEntity>,

    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
  ) {}

  async generateNumeration(): Promise<ApiResponse<number>> {
    const systemYear = await this.systemYearRepository.findOne({
      order: { currentYear: 'DESC' },
    })

    // const submoduleYearModule =
    //   await this.subModuleYeatModuleRepository.findOne({
    //     where: {
    //       systemYear: { id: systemYear.id },
    //     },
    //   })

    const lastDegreeCertificate =
      await this.degreeCertificateRepository.findOne({
        order: { number: 'DESC' },
      })

    const number = lastDegreeCertificate ? lastDegreeCertificate.number + 1 : 1

    return {
      message: 'Numeración generada correctamente',
      data: number,
    }
  }

  async findAll(): Promise<ApiResponse<DegreeCertificateEntity[]>> {
    const degreeCertificates = await this.degreeCertificateRepository.find()

    return {
      message: 'Listado de certificados obtenido exitosamente',
      data: degreeCertificates,
    }
  }

  async create(
    dto: CreateDegreeCertificateDto,
  ): Promise<ApiResponse<DegreeCertificateEntity>> {
    if (this.degreeCertificateRepository.findOneBy({ number: dto.number })) {
      throw new DegreeCertificateAlreadyExists(
        `El certificado con número ${dto.number} ya existe`,
      )
    }

    const degreeCertificate = this.degreeCertificateRepository.create({
      ...dto,
      student: { id: dto.studentId },
      certificateType: { id: dto.certificateTypeId },
      certificateStatus: { id: dto.certificateStatusId },
      degreeModality: { id: dto.degreeModalityId },
      room: { id: dto.roomId },
      submoduleYearModule: { id: dto.submoduleYearModuleId },
    })

    if (!degreeCertificate) {
      throw new DegreeCertificateBadRequestError(
        'Los datos del certificado son incorrectos',
      )
    }

    const newCertificate = await this.degreeCertificateRepository.save(
      degreeCertificate,
    )

    return {
      message: 'Certificado creado correctamente',
      data: newCertificate,
    }
  }

  async update(
    id: number,
    dto: UpdateDegreeCertificateDto,
  ): Promise<ApiResponse<DegreeCertificateEntity>> {
    const degreeCertificate = await this.degreeCertificateRepository.preload({
      id,
      student: { id: dto.studentId },
      certificateType: { id: dto.certificateTypeId },
      certificateStatus: { id: dto.certificateStatusId },
      degreeModality: { id: dto.degreeModalityId },
      room: { id: dto.roomId },
      submoduleYearModule: { id: dto.submoduleYearModuleId },
      ...dto,
    })

    if (!degreeCertificate) {
      throw new DegreeCertificateNotFoundError(
        `El certificado con id ${id} no existe`,
      )
    }

    const certificateUpdated = await this.degreeCertificateRepository.save(
      degreeCertificate,
    )

    return {
      message: 'Certificado actualizado correctamente',
      data: certificateUpdated,
    }
  }

  async findAllCertificateStatus(): Promise<
    ApiResponse<CertificateStatusEntity[]>
  > {
    const certificateStatus = await this.certificateStatusRepository.find()

    return {
      message: 'Listado de estados de certificado obtenido exitosamente',
      data: certificateStatus,
    }
  }

  async createCertificateStatus(
    dto: CreateCertificateStatusDto,
  ): Promise<ApiResponse<CertificateStatusEntity>> {
    if (
      this.certificateStatusRepository.findOneBy({
        code: dto.code,
      })
    ) {
      throw new DegreeCertificateAlreadyExists(
        `El estado de certificado con código ${dto.code} ya existe`,
      )
    }

    const certificateStatus = this.certificateStatusRepository.create(dto)

    if (!certificateStatus) {
      throw new DegreeCertificateBadRequestError(
        'Los datos del estado de certificado son incorrectos',
      )
    }

    const newCertificateStatus = await this.certificateStatusRepository.save(
      certificateStatus,
    )

    return {
      message: 'Estado de certificado creado correctamente',
      data: newCertificateStatus,
    }
  }

  async updateCertificateStatus(
    id: number,
    updateCertificateStatusDto: UpdateCertificateStatusDto,
  ): Promise<ApiResponse<CertificateStatusEntity>> {
    const certificateStatus = await this.certificateStatusRepository.preload({
      id,
      ...updateCertificateStatusDto,
    })

    if (!certificateStatus) {
      throw new DegreeCertificateNotFoundError(
        `El estado de certificado con id ${id} no existe`,
      )
    }

    const certificateStatusUpdated =
      await this.certificateStatusRepository.save(certificateStatus)

    return {
      message: 'Estado de certificado actualizado correctamente',
      data: certificateStatusUpdated,
    }
  }

  async deleteCertificateStatus(id: number): Promise<ApiResponse> {
    const certificateStatus = this.certificateStatusRepository.findOneBy({ id })

    if (!certificateStatus) {
      throw new DegreeCertificateNotFoundError(
        `El estado de certificado con id ${id} no existe`,
      )
    }

    await this.certificateStatusRepository.save({
      ...certificateStatus,
      isActive: false,
    })

    return {
      message: 'Estado de certificado eliminado correctamente',
      data: { success: true },
    }
  }

  async findAllCertificateTypes(): Promise<
    ApiResponse<CertificateTypeEntity[]>
  > {
    const certificateTypes = await this.certificateTypeRepository.find()

    return {
      message: 'Listado de tipos de certificado obtenido exitosamente',
      data: certificateTypes,
    }
  }

  async createCertificateType(
    dto: CreateCertificateTypeDto,
  ): Promise<ApiResponse<CertificateTypeEntity>> {
    if (
      this.certificateTypeRepository.findOneBy({
        code: dto.code,
      })
    ) {
      throw new DegreeCertificateAlreadyExists(
        `El tipo de certificado con código ${dto.code} ya existe`,
      )
    }

    const certificateType = this.certificateTypeRepository.create(dto)

    if (!certificateType) {
      throw new DegreeCertificateBadRequestError(
        'Los datos del tipo de certificado son incorrectos',
      )
    }

    const newCertificateType = await this.certificateTypeRepository.save(
      certificateType,
    )

    return {
      message: 'Tipo de certificado creado correctamente',
      data: newCertificateType,
    }
  }

  async updateCertificateType(
    id: number,
    updateCertificateTypeDto: UpdateCertificateTypeDto,
  ): Promise<ApiResponse<CertificateTypeEntity>> {
    const certificateType = await this.certificateTypeRepository.preload({
      id,
      ...updateCertificateTypeDto,
    })

    if (!certificateType) {
      throw new DegreeCertificateNotFoundError(
        `El tipo de certificado con id ${id} no existe`,
      )
    }

    const certificateTypeUpdated = await this.certificateTypeRepository.save(
      certificateType,
    )

    return {
      message: 'Tipo de certificado actualizado correctamente',
      data: certificateTypeUpdated,
    }
  }

  async deleteCertificateType(id: number): Promise<ApiResponse> {
    const certificateType = this.certificateTypeRepository.findOneBy({ id })

    if (!certificateType) {
      throw new DegreeCertificateNotFoundError(
        `El tipo de certificado con id ${id} no existe`,
      )
    }

    await this.certificateTypeRepository.save({
      ...certificateType,
      isActive: false,
    })

    return {
      message: 'Tipo de certificado eliminado correctamente',
      data: { success: true },
    }
  }

  async findAllDegreeModalities(): Promise<
    ApiResponse<DegreeModalityEntity[]>
  > {
    const degreeModalities = await this.degreeModalityRepository.find()

    return {
      message: 'Listado de modalidades de grado obtenido exitosamente',
      data: degreeModalities,
    }
  }

  async createDegreeModality(
    dto: CreateDegreeModalityDto,
  ): Promise<ApiResponse<DegreeModalityEntity>> {
    if (
      this.degreeModalityRepository.findOneBy({
        code: dto.code,
      })
    ) {
      throw new DegreeCertificateAlreadyExists(
        `La modalidad de grado con código ${dto.code} ya existe`,
      )
    }

    const degreeModality = this.degreeModalityRepository.create(dto)

    if (!degreeModality) {
      throw new DegreeCertificateBadRequestError(
        'Los datos de la modalidad de grado son incorrectos',
      )
    }

    const newDegreeModality = await this.degreeModalityRepository.save(
      degreeModality,
    )

    return {
      message: 'Modalidad de grado creada correctamente',
      data: newDegreeModality,
    }
  }

  async updateDegreeModality(
    id: number,
    dto: UpdateDegreeModalityDto,
  ): Promise<ApiResponse<DegreeModalityEntity>> {
    const degreeModality = await this.degreeModalityRepository.preload({
      id,
      ...dto,
    })

    if (!degreeModality) {
      throw new DegreeCertificateNotFoundError(
        `La modalidad de grado con id ${id} no existe`,
      )
    }

    const degreeModalityUpdated = await this.degreeModalityRepository.save(
      degreeModality,
    )

    return {
      message: 'Modalidad de grado actualizada correctamente',
      data: degreeModalityUpdated,
    }
  }

  async deleteDegreeModality(id: number): Promise<ApiResponse> {
    const degreeModality = this.degreeModalityRepository.findOneBy({ id })

    if (!degreeModality) {
      throw new DegreeCertificateNotFoundError(
        `La modalidad de grado con id ${id} no existe`,
      )
    }

    await this.degreeModalityRepository.save({
      ...degreeModality,
      isActive: false,
    })

    return {
      message: 'Modalidad de grado eliminada correctamente',
      data: { success: true },
    }
  }

  async findAllRooms(): Promise<ApiResponse<RoomEntity[]>> {
    const rooms = await this.roomRepository.find()

    return {
      message: 'Listado de salones obtenido exitosamente',
      data: rooms,
    }
  }

  async createRoom(dto: CreateRoomDto): Promise<ApiResponse<RoomEntity>> {
    if (
      this.roomRepository.findOneBy({
        name: dto.name,
      })
    ) {
      throw new DegreeCertificateAlreadyExists(
        `El salón con nombre ${dto.name} ya existe`,
      )
    }

    const room = this.roomRepository.create(dto)

    if (!room) {
      throw new DegreeCertificateBadRequestError(
        'Los datos del salón son incorrectos',
      )
    }

    const newRoom = await this.roomRepository.save(room)

    return {
      message: 'Salón creado correctamente',
      data: newRoom,
    }
  }

  async updateRoom(
    id: number,
    dto: UpdateRoomDto,
  ): Promise<ApiResponse<RoomEntity>> {
    const room = await this.roomRepository.preload({
      id,
      ...dto,
    })

    if (!room) {
      throw new DegreeCertificateNotFoundError(
        `El salón con id ${id} no existe`,
      )
    }

    const roomUpdated = await this.roomRepository.save(room)

    return {
      message: 'Salón actualizado correctamente',
      data: roomUpdated,
    }
  }

  async deleteRoom(id: number): Promise<ApiResponse> {
    const room = this.roomRepository.findOneBy({ id })

    if (!room) {
      throw new DegreeCertificateNotFoundError(
        `El salón con id ${id} no existe`,
      )
    }

    await this.roomRepository.save({
      ...room,
      isActive: false,
    })

    return {
      message: 'Salón eliminado correctamente',
      data: { success: true },
    }
  }
}

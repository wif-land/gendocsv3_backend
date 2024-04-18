import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateCertificateStatusDto } from './dto/create-certificate-status.dto'
import { CreateCertificateTypeDto } from './dto/create-certificate-type.dto'
import { CreateDegreeCertificateDto } from './dto/create-degree-certificate.dto'
import { CreateDegreeModalityDto } from './dto/create-degree-modality.dto'
import { CreateRoomDto } from './dto/create-room.dto'
import { UpdateCertificateStatusDto } from './dto/update-certificate-status.dto'
import { UpdateCertificateTypeDto } from './dto/update-certificate-type.dto'
import { UpdateDegreeCertificateDto } from './dto/update-degree-certificate.dto'
import { UpdateDegreeModalityDto } from './dto/update-degree-modality.dto'
import { UpdateRoomDto } from './dto/update-room.dto'
import { CertificateStatusEntity } from './entities/certificate-status.entity'
import { CertificateTypeEntity } from './entities/certificate-type.entity'
import { DegreeCertificateEntity } from './entities/degree-certificate.entity'
import { DegreeModalityEntity } from './entities/degree-modality.entity'
import { RoomEntity } from './entities/room.entity'
import { DegreeCertificateBadRequestError } from './errors/degree-certificate-bad-request'
import { DegreeCertificateAlreadyExists } from './errors/degree-certificate-exists'
import { DegreeCertificateNotFoundError } from './errors/degree-certificate-not-found'
import { YearModuleService } from '../year-module/year-module.service'
import { DEGREE_MODULES } from '../shared/constants/degree-certificates'
import { ApiResponseDto } from '../shared/dtos/api-response.dto'

@Injectable()
export class DegreeCertificatesService {
  constructor(
    private readonly yearModuleService: YearModuleService,

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

  async getLastNumberToRegister(): Promise<number> {
    const systemYear = await this.yearModuleService.getCurrentSystemYear()

    const submoduleYearModule =
      await this.yearModuleService.findSubmoduleYearModuleByModule(
        DEGREE_MODULES.MODULE_CODE,
        systemYear,
        DEGREE_MODULES.SUBMODULE_NAME,
      )

    const lastDegreeCertificate =
      await this.degreeCertificateRepository.findOne({
        where: {
          submoduleYearModule: { id: submoduleYearModule.id },
        },
        order: { number: 'DESC' },
      })

    const number = lastDegreeCertificate ? lastDegreeCertificate.number + 1 : 1

    return number
  }

  async showLastNumberToRegister(): Promise<ApiResponseDto<number>> {
    const number = await this.getLastNumberToRegister()

    return new ApiResponseDto('Siguiente número de registro encontrado', number)
  }

  async findAll(): Promise<ApiResponseDto<DegreeCertificateEntity[]>> {
    const degreeCertificates = await this.degreeCertificateRepository.find()

    return new ApiResponseDto(
      'Listado de certificados obtenido exitosamente',
      degreeCertificates,
    )
  }

  async create(dto: CreateDegreeCertificateDto) {
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

    return new ApiResponseDto(
      'Certificado creado correctamente',
      newCertificate,
    )
  }

  async update(id: number, dto: UpdateDegreeCertificateDto) {
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

    return new ApiResponseDto(
      'Certificado actualizado correctamente',
      certificateUpdated,
    )
  }

  async findAllCertificateStatus() {
    const certificateStatus = await this.certificateStatusRepository.find()

    return new ApiResponseDto(
      'Listado de estados de certificado obtenido exitosamente',
      certificateStatus,
    )
  }

  async createCertificateStatus(dto: CreateCertificateStatusDto) {
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

    return new ApiResponseDto(
      'Estado de certificado creado correctamente',
      newCertificateStatus,
    )
  }

  async updateCertificateStatus(
    id: number,
    updateCertificateStatusDto: UpdateCertificateStatusDto,
  ) {
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

    return new ApiResponseDto(
      'Estado de certificado actualizado correctamente',
      certificateStatusUpdated,
    )
  }

  async deleteCertificateStatus(id: number) {
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

    return new ApiResponseDto('Estado de certificado eliminado correctamente', {
      success: true,
    })
  }

  async findAllCertificateTypes() {
    const certificateTypes = await this.certificateTypeRepository.find()

    return new ApiResponseDto(
      'Listado de tipos de certificado obtenido exitosamente',
      certificateTypes,
    )
  }

  async createCertificateType(dto: CreateCertificateTypeDto) {
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

    return new ApiResponseDto(
      'Tipo de certificado creado correctamente',
      newCertificateType,
    )
  }

  async updateCertificateType(
    id: number,
    updateCertificateTypeDto: UpdateCertificateTypeDto,
  ) {
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

    return new ApiResponseDto(
      'Tipo de certificado actualizado correctamente',
      certificateTypeUpdated,
    )
  }

  async deleteCertificateType(id: number) {
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

    return new ApiResponseDto('Tipo de certificado eliminado correctamente', {
      success: true,
    })
  }

  async findAllDegreeModalities() {
    const degreeModalities = await this.degreeModalityRepository.find()

    return new ApiResponseDto(
      'Listado de modalidades de grado obtenido exitosamente',
      degreeModalities,
    )
  }

  async createDegreeModality(dto: CreateDegreeModalityDto) {
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

    return new ApiResponseDto(
      'Modalidad de grado creada correctamente',
      newDegreeModality,
    )
  }

  async updateDegreeModality(id: number, dto: UpdateDegreeModalityDto) {
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

    return new ApiResponseDto(
      'Modalidad de grado actualizada correctamente',
      degreeModalityUpdated,
    )
  }

  async deleteDegreeModality(id: number) {
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

    return new ApiResponseDto('Modalidad de grado eliminada correctamente', {
      success: true,
    })
  }

  async findAllRooms() {
    const rooms = await this.roomRepository.find()

    return new ApiResponseDto('Listado de salones obtenido exitosamente', rooms)
  }

  async createRoom(dto: CreateRoomDto) {
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

    return new ApiResponseDto('Salón creado correctamente', newRoom)
  }

  async updateRoom(id: number, dto: UpdateRoomDto) {
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

    return new ApiResponseDto('Salón actualizado correctamente', roomUpdated)
  }

  async deleteRoom(id: number) {
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

    return new ApiResponseDto('Salón eliminado correctamente', {
      success: true,
    })
  }
}

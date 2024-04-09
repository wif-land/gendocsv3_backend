import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CertificateStatusEntity } from './entities/certificate-status.entity'
import { Repository } from 'typeorm'
import { CreateCertificateStatusDto } from './dto/create-certificate-status.dto'
import { DegreeCertificateAlreadyExist } from './errors/degree-certificate-exists'
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

@Injectable()
export class DegreeCertificatesService {
  constructor(
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

  async findAll() {
    return await this.degreeCertificateRepository.find()
  }

  async create(dto: CreateDegreeCertificateDto) {
    if (this.degreeCertificateRepository.findOneBy({ number: dto.number })) {
      throw new DegreeCertificateAlreadyExist(
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

    return await this.degreeCertificateRepository.save(degreeCertificate)
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

    return await this.degreeCertificateRepository.save(degreeCertificate)
  }

  async findAllCertificateStatus() {
    return await this.certificateStatusRepository.find()
  }

  async createCertificateStatus(dto: CreateCertificateStatusDto) {
    if (
      this.certificateStatusRepository.findOneBy({
        code: dto.code,
      })
    ) {
      throw new DegreeCertificateAlreadyExist(
        `El estado de certificado con código ${dto.code} ya existe`,
      )
    }

    const certificateStatus = this.certificateStatusRepository.create(dto)

    if (!certificateStatus) {
      throw new DegreeCertificateBadRequestError(
        'Los datos del estado de certificado son incorrectos',
      )
    }

    return await this.certificateStatusRepository.save(certificateStatus)
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

    return await this.certificateStatusRepository.save(certificateStatus)
  }

  async deleteCertificateStatus(id: number) {
    const certificateStatus = this.certificateStatusRepository.findOneBy({ id })

    if (!certificateStatus) {
      throw new DegreeCertificateNotFoundError(
        `El estado de certificado con id ${id} no existe`,
      )
    }

    return await this.certificateStatusRepository.save({
      ...certificateStatus,
      isActive: false,
    })
  }

  async findAllCertificateTypes() {
    return await this.certificateTypeRepository.find()
  }

  async createCertificateType(dto: CreateCertificateTypeDto) {
    if (
      this.certificateTypeRepository.findOneBy({
        code: dto.code,
      })
    ) {
      throw new DegreeCertificateAlreadyExist(
        `El tipo de certificado con código ${dto.code} ya existe`,
      )
    }

    const certificateType = this.certificateTypeRepository.create(dto)

    if (!certificateType) {
      throw new DegreeCertificateBadRequestError(
        'Los datos del tipo de certificado son incorrectos',
      )
    }

    return await this.certificateTypeRepository.save(certificateType)
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

    return await this.certificateTypeRepository.save(certificateType)
  }

  async deleteCertificateType(id: number) {
    const certificateType = this.certificateTypeRepository.findOneBy({ id })

    if (!certificateType) {
      throw new DegreeCertificateNotFoundError(
        `El tipo de certificado con id ${id} no existe`,
      )
    }

    return await this.certificateTypeRepository.save({
      ...certificateType,
      isActive: false,
    })
  }

  async findAllDegreeModalities() {
    return await this.degreeModalityRepository.find()
  }

  async createDegreeModality(dto: CreateDegreeModalityDto) {
    if (
      this.degreeModalityRepository.findOneBy({
        code: dto.code,
      })
    ) {
      throw new DegreeCertificateAlreadyExist(
        `La modalidad de grado con código ${dto.code} ya existe`,
      )
    }

    const degreeModality = this.degreeModalityRepository.create(dto)

    if (!degreeModality) {
      throw new DegreeCertificateBadRequestError(
        'Los datos de la modalidad de grado son incorrectos',
      )
    }

    return await this.degreeModalityRepository.save(degreeModality)
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

    return await this.degreeModalityRepository.save(degreeModality)
  }

  async deleteDegreeModality(id: number) {
    const degreeModality = this.degreeModalityRepository.findOneBy({ id })

    if (!degreeModality) {
      throw new DegreeCertificateNotFoundError(
        `La modalidad de grado con id ${id} no existe`,
      )
    }

    return await this.degreeModalityRepository.save({
      ...degreeModality,
      isActive: false,
    })
  }

  async findAllRooms() {
    return await this.roomRepository.find()
  }

  async createRoom(dto: CreateRoomDto) {
    if (
      this.roomRepository.findOneBy({
        name: dto.name,
      })
    ) {
      throw new DegreeCertificateAlreadyExist(
        `El salón con nombre ${dto.name} ya existe`,
      )
    }

    const room = this.roomRepository.create(dto)

    if (!room) {
      throw new DegreeCertificateBadRequestError(
        'Los datos del salón son incorrectos',
      )
    }

    return await this.roomRepository.save(room)
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

    return await this.roomRepository.save(room)
  }

  async deleteRoom(id: number) {
    const room = this.roomRepository.findOneBy({ id })

    if (!room) {
      throw new DegreeCertificateNotFoundError(
        `El salón con id ${id} no existe`,
      )
    }

    return await this.roomRepository.save({
      ...room,
      isActive: false,
    })
  }
}

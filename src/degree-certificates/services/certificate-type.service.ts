import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CertificateTypeEntity } from '../entities/certificate-type.entity'
import { Repository } from 'typeorm'
import { ApiResponseDto } from '../../shared/dtos/api-response.dto'
import { CreateCertificateTypeDto } from '../dto/create-certificate-type.dto'
import { DegreeCertificateAlreadyExists } from '../errors/degree-certificate-already-exists'
import { DegreeCertificateBadRequestError } from '../errors/degree-certificate-bad-request'
import { UpdateCertificateTypeDto } from '../dto/update-certificate-type.dto'
import { DegreeCertificateNotFoundError } from '../errors/degree-certificate-not-found'
import { CertificateTypeCareerEntity } from '../entities/certicate-type-career.entity'

@Injectable()
export class CertificateTypeService {
  constructor(
    @InjectRepository(CertificateTypeEntity)
    private readonly certificateTypeRepository: Repository<CertificateTypeEntity>,

    @InjectRepository(CertificateTypeCareerEntity)
    private readonly cetificateTypeCareerRepository: Repository<CertificateTypeCareerEntity>,
  ) {}
  async findAllCertificateTypes() {
    const certificateTypes = await this.certificateTypeRepository.find()

    return new ApiResponseDto(
      'Listado de tipos de certificado obtenido exitosamente',
      certificateTypes,
    )
  }

  async findCertificateTypeByNameAndCareer(name: string, careerId: number) {
    const certificateTypesCareers =
      await this.getCertificateTypesCarrerByCarrer(careerId)

    const foundCertificateTypeCareer = certificateTypesCareers.find(
      (certificateTypeCareer) =>
        certificateTypeCareer.certificateType.name === name,
    )

    if (!foundCertificateTypeCareer) {
      throw new DegreeCertificateNotFoundError(
        `El tipo de certificado con nombre ${name} no existe`,
      )
    }

    return foundCertificateTypeCareer.certificateType
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

  async getCertificateTypeStatusCareer() {
    const certificateTypeStatusCareer =
      await this.certificateTypeRepository.find({
        relationLoadStrategy: 'join',
        relations: {
          certificateTypeCareers: {
            career: true,
          },
          certificateTypeStatuses: {
            certificateStatus: true,
          },
        },
      })

    if (
      !certificateTypeStatusCareer ||
      certificateTypeStatusCareer.length === 0
    ) {
      return new DegreeCertificateNotFoundError(
        'No se encontraron estados de certificado por carrera',
      )
    }

    return certificateTypeStatusCareer
  }

  async getCertificateTypesCarrerByCarrer(carrerId: number) {
    const certificateTypes = await this.cetificateTypeCareerRepository.find({
      where: {
        career: { id: carrerId },
      },
      relationLoadStrategy: 'join',
      relations: {
        certificateType: true,
      },
    })

    return certificateTypes
  }
}

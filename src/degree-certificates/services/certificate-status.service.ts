import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CertificateStatusEntity } from '../entities/certificate-status.entity'
import { Repository } from 'typeorm'
import { ApiResponseDto } from '../../shared/dtos/api-response.dto'
import { CreateCertificateStatusDto } from '../dto/create-certificate-status.dto'
import { DegreeCertificateAlreadyExists } from '../errors/degree-certificate-already-exists'
import { DegreeCertificateBadRequestError } from '../errors/degree-certificate-bad-request'
import { UpdateCertificateStatusDto } from '../dto/update-certificate-status.dto'
import { DegreeCertificateNotFoundError } from '../errors/degree-certificate-not-found'
import { CertificateTypeStatusEntity } from '../entities/certificate-type-status.entity'

@Injectable()
export class CertificateStatusService {
  constructor(
    @InjectRepository(CertificateStatusEntity)
    private readonly certificateStatusRepository: Repository<CertificateStatusEntity>,
    @InjectRepository(CertificateTypeStatusEntity)
    private readonly certificateTypeStatusRepository: Repository<CertificateTypeStatusEntity>,
  ) {}

  async findCertificateStatusByName(name: string) {
    const certificateStatus = this.certificateStatusRepository.findOneBy({
      femaleName: name,
    })

    if (!certificateStatus) {
      throw new DegreeCertificateNotFoundError(
        `El estado de certificado con nombre ${name} no existe`,
      )
    }

    return certificateStatus
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
  async findCertificateStatusType(
    certificateTypeId: number,
    certificateStatusId: number,
  ) {
    const certificateTypeStatus =
      await this.certificateTypeStatusRepository.findOneBy({
        certificateType: { id: certificateTypeId },
        certificateStatus: { id: certificateStatusId },
      })

    if (!certificateTypeStatus) {
      throw new DegreeCertificateNotFoundError(
        'No se encontró el estado de certificado para el tipo de certificado',
      )
    }

    return certificateTypeStatus
  }

  async getCertificateStatusByType(certificateTypeId: number) {
    const certificateStatus = await this.certificateTypeStatusRepository.findBy(
      {
        certificateType: { id: certificateTypeId },
      },
    )

    if (!certificateStatus || certificateStatus.length === 0) {
      return new DegreeCertificateNotFoundError(
        `No se han encontrado estados de certificado para el tipo de certificado con id ${certificateTypeId}`,
      )
    }

    return certificateStatus
  }
}

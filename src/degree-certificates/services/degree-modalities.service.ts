import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DegreeModalityEntity } from '../entities/degree-modality.entity'
import { Repository } from 'typeorm'
import { ApiResponseDto } from '../../shared/dtos/api-response.dto'
import { CreateDegreeModalityDto } from '../dto/create-degree-modality.dto'
import { DegreeCertificateAlreadyExists } from '../errors/degree-certificate-already-exists'
import { DegreeCertificateBadRequestError } from '../errors/degree-certificate-bad-request'
import { UpdateDegreeModalityDto } from '../dto/update-degree-modality.dto'
import { DegreeCertificateNotFoundError } from '../errors/degree-certificate-not-found'

@Injectable()
export class DegreeModalitiesService {
  constructor(
    @InjectRepository(DegreeModalityEntity)
    private readonly degreeModalityRepository: Repository<DegreeModalityEntity>,
  ) {}

  async findAllDegreeModalities() {
    const degreeModalities = await this.degreeModalityRepository.find()

    return new ApiResponseDto(
      'Listado de modalidades de grado obtenido exitosamente',
      degreeModalities,
    )
  }

  async findDegreeModalityByCode(code: string) {
    const degreeModality = this.degreeModalityRepository.findOneBy({ code })

    if (!degreeModality) {
      throw new DegreeCertificateNotFoundError(
        `La modalidad de grado con código ${code} no existe`,
      )
    }

    return degreeModality
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
}

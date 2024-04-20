import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { CreateVariableDto } from './dto/create-variable.dto'
import { UpdateVariableDto } from './dto/update-variable.dto'
import { DocumentEntity } from '../documents/entities/document.entity'
import { DefaultVariable } from '../shared/enums/default-variable'
import { formatDate, formatDateText } from '../shared/utils/date'
import { getFullName, formatNumeration } from '../shared/utils/string'
import { DocumentFunctionaryEntity } from '../documents/entities/document-functionary.entity'
import { DataSource, Repository } from 'typeorm'
import { PositionEntity } from '../positions/entities/position.entity'
import { VariableEntity } from './entities/variable.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { ApiResponseDto } from '../shared/dtos/api-response.dto'

@Injectable()
export class VariablesService {
  constructor(
    @InjectRepository(VariableEntity)
    private readonly variableRepository: Repository<VariableEntity>,
    private dataSource: DataSource,
  ) {}

  async create(createVariableDto: CreateVariableDto) {
    try {
      const alreadyExists = await this.variableRepository.findOne({
        where: { variable: createVariableDto.variable },
      })

      if (alreadyExists) {
        throw new BadRequestException('Variable already exists')
      }

      const variable = this.variableRepository.create(createVariableDto)

      if (!variable) {
        throw new BadRequestException('Variable not created')
      }

      const newVariable = await this.variableRepository.save(variable)

      return new ApiResponseDto('Variable creada con éxito', newVariable)
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async findAll() {
    try {
      const variables = await this.variableRepository.find()

      return new ApiResponseDto('Variables encontradas con éxito', variables)
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async findOne(id: number) {
    try {
      const variable = await this.variableRepository.findOne({ where: { id } })

      if (!variable) {
        throw new BadRequestException('Variable not found')
      }

      return new ApiResponseDto('Variable encontrada con éxito', variable)
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async update(id: number, updateVariableDto: UpdateVariableDto) {
    try {
      const alreadyExists = await this.variableRepository.findOne({
        where: { variable: updateVariableDto.variable },
      })

      if (alreadyExists) {
        throw new BadRequestException('Variable already exists')
      }

      const variable = await this.variableRepository.save({
        id,
        ...updateVariableDto,
      })

      return new ApiResponseDto('Variable actualizada con éxito', variable)
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async remove(id: number) {
    try {
      await this.variableRepository.delete(id)

      return new ApiResponseDto('Variable eliminada con éxito', {
        success: true,
      })
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async getGeneralVariables(document: DocumentEntity) {
    try {
      const variables = {
        [DefaultVariable.CREADOPOR]: `${document.user.firstName} ${document.user.firstLastName}`,
        [DefaultVariable.NUMDOC]: formatNumeration(
          document.numerationDocument.number,
        ),
        [DefaultVariable.YEAR]: document.createdAt.getFullYear().toString(),
      }

      return new ApiResponseDto(
        'Variables generales encontradas con éxito',
        variables,
      )
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async getCouncilVariables(document: DocumentEntity) {
    try {
      const functionary = document.numerationDocument.council.attendance.find(
        (attendance) => attendance.isPresident,
      ).functionary

      if (!functionary) {
        throw new BadRequestException('El consejo no tiene presidente asignado')
      }

      const variables = {
        [DefaultVariable.FECHA]: formatDate(
          document.numerationDocument.council.date,
        ),
        [DefaultVariable.FECHAUP]: formatDateText(
          document.numerationDocument.council.date,
        ),
        [DefaultVariable.SESION]:
          document.numerationDocument.council.type.toLowerCase(),
        [DefaultVariable.SESIONUP]:
          document.numerationDocument.council.type.toUpperCase(),
        [DefaultVariable.RESPONSABLE]: `${getFullName(functionary)}`,
      }

      return new ApiResponseDto(
        'Variables de consejo encontradas con éxito',
        variables,
      )
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async getStudentVariables(document: DocumentEntity) {
    try {
      const variables = {
        [DefaultVariable.ESTUDIANTE]: getFullName(document.student),
        [DefaultVariable.ESTUDIANTEUP]: getFullName(
          document.student,
        ).toUpperCase(),
        [DefaultVariable.CEDULA]: document.student.dni,
        [DefaultVariable.MATRICULA]: document.student.registration,
        [DefaultVariable.FOLIO]: document.student.folio,
        [DefaultVariable.TELEFONO]: document.student.regularPhoneNumber,
        [DefaultVariable.CELULAR]: document.student.phoneNumber,
        [DefaultVariable.CORREO]: document.student.personalEmail,
        [DefaultVariable.CORREOUTA]: document.student.outlookEmail,
        [DefaultVariable.NOMBRECARRERA]: document.student.career.name,
        [DefaultVariable.NOMBRECARRERAUP]:
          document.student.career.name.toUpperCase(),
        [DefaultVariable.COORDINADOR]: getFullName(
          document.student.career.coordinator,
        ),
      }

      return new ApiResponseDto(
        'Variables de estudiante encontradas con éxito',
        variables,
      )
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async getFunctionaryVariables(
    documentFunctionaries: DocumentFunctionaryEntity[],
  ) {
    try {
      const variables = {}
      documentFunctionaries.forEach(
        (documentFunctionary, index) =>
          // eslint-disable-next-line no-extra-parens
          (variables[
            DefaultVariable.DOCENTE_N.replace('$i', (index + 1).toString())
          ] = getFullName(documentFunctionary.functionary)),
      )

      return new ApiResponseDto(
        'Variables de docentes encontradas con éxito',
        variables,
      )
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async getPositionVariables() {
    try {
      const variables = {}

      const qb = this.dataSource
        .createQueryBuilder(PositionEntity, 'position')
        .leftJoinAndSelect('position.functionary', 'functionary')

      const positions = await qb.getMany()

      positions.forEach(
        (position) =>
          // eslint-disable-next-line no-extra-parens
          (variables[position.variable] = getFullName(position.functionary)),
      )

      return new ApiResponseDto(
        'Variables de posiciones encontradas con éxito',
        variables,
      )
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async getCustomVariables() {
    try {
      const variables: { [DefaultVariable: string]: string } = {}

      const { data: customVariables } = await this.findAll()

      customVariables.forEach(
        (customVariable) =>
          // eslint-disable-next-line no-extra-parens
          (variables[customVariable.variable] = customVariable.value),
      )

      return new ApiResponseDto(
        'Variables personalizadas encontradas con éxito',
        variables,
      )
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}

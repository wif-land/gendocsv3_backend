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
import { ApiResponse } from '../shared/interfaces/response.interface'

@Injectable()
export class VariablesService {
  constructor(
    @InjectRepository(VariableEntity)
    private readonly variableRepository: Repository<VariableEntity>,
    private dataSource: DataSource,
  ) {}

  async create(
    createVariableDto: CreateVariableDto,
  ): Promise<ApiResponse<VariableEntity>> {
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

      return {
        message: 'Variable creada con éxito',
        data: newVariable,
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async findAll(): Promise<ApiResponse<VariableEntity[]>> {
    try {
      const variables = await this.variableRepository.find()

      return {
        message: 'Variables encontradas con éxito',
        data: variables,
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async findOne(id: number): Promise<ApiResponse<VariableEntity>> {
    try {
      const variable = await this.variableRepository.findOne({ where: { id } })

      if (!variable) {
        throw new BadRequestException('Variable not found')
      }

      return {
        message: 'Variable encontrada con éxito',
        data: variable,
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async update(
    id: number,
    updateVariableDto: UpdateVariableDto,
  ): Promise<ApiResponse<VariableEntity>> {
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

      return {
        message: 'Variable actualizada con éxito',
        data: variable,
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async remove(id: number): Promise<ApiResponse> {
    try {
      await this.variableRepository.delete(id)

      return {
        message: 'Variable eliminada con éxito',
        data: {
          success: true,
        },
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async getGeneralVariables(
    document: DocumentEntity,
  ): Promise<ApiResponse<{ [DefaultVariable: string]: string }>> {
    try {
      const variables = {
        [DefaultVariable.CREADOPOR]: `${document.user.firstName} ${document.user.firstLastName}`,
        [DefaultVariable.NUMDOC]: formatNumeration(
          document.numerationDocument.number,
        ),
        [DefaultVariable.YEAR]: document.createdAt.getFullYear().toString(),
      }

      return {
        message: 'Variables generales encontradas con éxito',
        data: variables,
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async getCouncilVariables(
    document: DocumentEntity,
  ): Promise<ApiResponse<{ [DefaultVariable: string]: string }>> {
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

      return {
        message: 'Variables de consejo encontradas con éxito',
        data: variables,
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async getStudentVariables(
    document: DocumentEntity,
  ): Promise<ApiResponse<{ [DefaultVariable: string]: string }>> {
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

      return {
        message: 'Variables de estudiante encontradas con éxito',
        data: variables,
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async getFunctionaryVariables(
    documentFunctionaries: DocumentFunctionaryEntity[],
  ): Promise<ApiResponse<{ [DefaultVariable: string]: string }>> {
    try {
      const variables = {}
      documentFunctionaries.forEach(
        (documentFunctionary, index) =>
          // eslint-disable-next-line no-extra-parens
          (variables[
            DefaultVariable.DOCENTE_N.replace('$i', (index + 1).toString())
          ] = getFullName(documentFunctionary.functionary)),
      )

      return {
        message: 'Variables de docentes encontradas con éxito',
        data: variables,
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async getPositionVariables(): Promise<
    ApiResponse<{ [DefaultVariable: string]: string }>
  > {
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

      return {
        message: 'Variables de posiciones encontradas con éxito',
        data: variables,
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async getCustomVariables(): Promise<
    ApiResponse<{ [DefaultVariable: string]: string }>
  > {
    try {
      const variables: { [DefaultVariable: string]: string } = {}

      const { data: customVariables } = await this.findAll()

      customVariables.forEach(
        (customVariable) =>
          // eslint-disable-next-line no-extra-parens
          (variables[customVariable.variable] = customVariable.value),
      )

      return {
        message: 'Variables personalizadas encontradas con éxito',
        data: variables,
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}

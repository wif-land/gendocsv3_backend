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
import { getFullName, toFirstUpperCase } from '../shared/utils/string'
import { CouncilAttendanceRole } from '../councils/interfaces/council-attendance.interface'
import { DocumentFunctionaryEntity } from '../documents/entities/document-functionary.entity'
import { DataSource, Repository } from 'typeorm'
import { Position } from '../positions/entities/position.entity'
import { VariableEntity } from './entities/variable.entity'
import { InjectRepository } from '@nestjs/typeorm'

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

      return await this.variableRepository.save(variable)
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async findAll() {
    try {
      return await this.variableRepository.find()
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async findOne(id: number) {
    try {
      return await this.variableRepository.findOne({ where: { id } })
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

      return await this.variableRepository.update(id, updateVariableDto)
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async remove(id: number) {
    try {
      return await this.variableRepository.delete(id)
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async getGeneralVariables(document: DocumentEntity) {
    try {
      const variables = {
        [DefaultVariable.CREADOPOR]: `${document.user.firstName} ${document.user.firstLastName}`,
        [DefaultVariable.NUMDOC]: document.numerationDocument.number,
      }

      return variables
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async getCouncilVariables(document: DocumentEntity) {
    try {
      const variables = {
        [DefaultVariable.FECHA]: formatDate(
          document.numerationDocument.council.date,
        ),
        [DefaultVariable.FECHAUP]: formatDateText(
          document.numerationDocument.council.date,
        ),
        [DefaultVariable.SESION]: toFirstUpperCase(
          document.numerationDocument.council.type,
        ),
        [DefaultVariable.SESIONUP]:
          document.numerationDocument.council.type.toUpperCase(),
        [DefaultVariable.RESPONSABLE]: `${getFullName(
          document.numerationDocument.council.attendance.find((attendance) => {
            attendance.role === CouncilAttendanceRole.PRESIDENT
          }).functionary,
        )}`,
      }

      return variables
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
        [DefaultVariable.COORDINADOR]: document.student.career.coordinator,
      }

      return variables
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
            DefaultVariable.DOCENTE_N.replace('$i', index.toString())
          ] = getFullName(documentFunctionary.functionary)),
      )

      return variables
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async getPositionVariables() {
    try {
      const variables = {}

      const qb = this.dataSource
        .createQueryBuilder(Position, 'position')
        .leftJoinAndSelect('position.functionary', 'functionary')

      const positions = await qb.getMany()

      positions.forEach(
        (position) =>
          // eslint-disable-next-line no-extra-parens
          (variables[position.variable] = getFullName(position.functionary)),
      )

      return variables
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async getCustomVariables() {
    try {
      const variables = undefined

      const customVariables = await this.findAll()

      customVariables.forEach(
        (customVariable) =>
          // eslint-disable-next-line no-extra-parens
          (variables[customVariable.variable] = customVariable.value),
      )
      return variables
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}

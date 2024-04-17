import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { CreateTemplateDto } from './dto/create-template.dto'
import { UpdateTemplateDto } from './dto/update-template.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { TemplateProcess } from './entities/template-processes.entity'
import { FilesService } from '../files/files.service'
import { ProcessEntity } from '../processes/entities/process.entity'
import { ResponseTemplateDto } from './dto/response-template.dto'
import { ApiResponseDto } from '../shared/dtos/api-response.dto'

@Injectable()
export class TemplatesService {
  constructor(
    @InjectRepository(TemplateProcess)
    private readonly templateRepository: Repository<TemplateProcess>,

    private readonly filesService: FilesService,

    private readonly dataSource: DataSource,
  ) {}
  async create(createTemplateDto: CreateTemplateDto) {
    try {
      const template = this.templateRepository.create({
        ...createTemplateDto,
        process: { id: createTemplateDto.processId },
        user: { id: createTemplateDto.userId },
      })

      const qb = this.dataSource
        .createQueryBuilder(ProcessEntity, 'process')
        .leftJoinAndSelect('process.module', 'module')
        .where('process.id = :id', { id: createTemplateDto.processId })

      const process = await qb.getOne()

      const { data: templateId } =
        await this.filesService.createDocumentByParentIdAndCopy(
          createTemplateDto.name,
          process.driveId,
          process.module.defaultTemplateDriveId,
        )

      template.driveId = templateId

      const savedTemplate = await this.templateRepository.save(template)

      return new ApiResponseDto(
        'Plantilla creada correctamente',
        new ResponseTemplateDto(savedTemplate),
      )
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async findAll() {
    try {
      const qb = this.dataSource
        .createQueryBuilder(TemplateProcess, 'template')
        .leftJoinAndSelect('template.user', 'user')
        .leftJoinAndSelect('template.process', 'process')

      const templates = await qb.getMany()

      if (!templates) {
        throw new BadRequestException('Templates not found')
      }

      const responseTemplates = templates.map(
        (template) => new ResponseTemplateDto(template),
      )

      return new ApiResponseDto('Plantillas encontradas', responseTemplates)
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async findByProcessId(processId: number) {
    const qb = this.dataSource
      .createQueryBuilder(TemplateProcess, 'template')
      .leftJoinAndSelect('template.user', 'user')
      .leftJoinAndSelect('template.process', 'process')
      .where('process.id = :id', { id: processId })

    const templates = await qb.getMany()

    if (!templates) {
      throw new BadRequestException('Templates not found')
    }

    const responseTemplates = templates.map(
      (template) => new ResponseTemplateDto(template),
    )

    return new ApiResponseDto('Plantillas encontradas', {
      count: responseTemplates.length,
      templates: responseTemplates,
    })
  }

  async findByProcessAndField(processId: number, field: string) {
    const qb = this.dataSource
      .createQueryBuilder(TemplateProcess, 'template')
      .leftJoinAndSelect('template.user', 'user')
      .leftJoinAndSelect('template.process', 'process')
      .where(
        '(UPPER(template.name) like :termName or CAST(template.id AS TEXT) = :termId) and process.id = :processId',
        {
          termName: `%${field.toUpperCase()}%`,
          termId: field,
          processId,
        },
      )

    const templates = await qb.getMany()

    if (!templates) {
      throw new BadRequestException('Templates not found')
    }

    const responseTemplates = templates.map(
      (template) => new ResponseTemplateDto(template),
    )

    return new ApiResponseDto('Plantillas encontradas', {
      count: responseTemplates.length,
      templates: responseTemplates,
    })
  }

  async findOne(id: number) {
    const qb = this.dataSource
      .createQueryBuilder(TemplateProcess, 'template')
      .leftJoinAndSelect('template.user', 'user')
      .leftJoinAndSelect('template.process', 'process')
      .where('template.id = :id', { id })

    const template = await qb.getOne()

    if (!template) {
      throw new BadRequestException('Template not found')
    }

    return new ApiResponseDto(
      'Plantilla encontrada',
      new ResponseTemplateDto(template),
    )
  }

  async update(id: number, updateTemplateDto: UpdateTemplateDto) {
    try {
      const qb = this.dataSource
        .createQueryBuilder(TemplateProcess, 'template')
        .leftJoinAndSelect('template.user', 'user')
        .leftJoinAndSelect('template.process', 'process')
        .where('template.id = :id', { id })

      const template = await qb.getOne()

      if (!template) {
        throw new BadRequestException('Template not found')
      }

      const updatedTemplate = this.templateRepository.merge(
        template,
        updateTemplateDto,
      )

      if (!updatedTemplate) {
        throw new BadRequestException('Template not updated')
      }

      if (
        updateTemplateDto.processId &&
        updateTemplateDto.processId !== template.process.id
      ) {
        const qb = this.dataSource
          .createQueryBuilder(ProcessEntity, 'process')
          .leftJoinAndSelect('process.module', 'module')
          .where('process.id = :id', { id: updateTemplateDto.processId })

        const process = await qb.getOne()

        if (!process) {
          throw new BadRequestException('Process not found')
        }

        const { data: templateId } = await this.filesService.moveAsset(
          template.driveId,
          process.driveId,
        )
        template.driveId = templateId

        updatedTemplate.process = process
      }

      if (updateTemplateDto.name) {
        await this.filesService.renameAsset(
          updatedTemplate.driveId,
          updateTemplateDto.name,
        )
      }

      const savedTemplate = await this.templateRepository.save(updatedTemplate)

      return new ApiResponseDto(
        'Plantilla actualizada correctamente',
        new ResponseTemplateDto(savedTemplate),
      )
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async remove(id: number) {
    const { data: template } = await this.findOne(id)

    template.isActive = false

    await this.templateRepository.save(template)

    return new ApiResponseDto('Plantilla eliminada correctamente', {
      success: true,
    })
  }
}

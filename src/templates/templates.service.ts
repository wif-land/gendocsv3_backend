import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateTemplateDto } from './dto/create-template.dto'
import { UpdateTemplateDto } from './dto/update-template.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { TemplateProcess } from './entities/template-processes.entity'
import { FilesService } from '../files/files.service'
import { Process } from '../processes/entities/process.entity'
import { ResponseTemplateDto } from './dto/response-template.dto'

@Injectable()
export class TemplatesService {
  constructor(
    @InjectRepository(TemplateProcess)
    private readonly templateRepository: Repository<TemplateProcess>,

    private readonly filesService: FilesService,

    private readonly dataSource: DataSource,
  ) {}
  async create(
    createTemplateDto: CreateTemplateDto,
  ): Promise<ResponseTemplateDto> {
    try {
      const template = this.templateRepository.create({
        ...createTemplateDto,
        process: { id: createTemplateDto.processId },
        user: { id: createTemplateDto.userId },
      })

      const qb = this.dataSource
        .createQueryBuilder(Process, 'process')
        .where('process.id = :id', { id: createTemplateDto.processId })

      const process = await qb.getOne()

      const templateId = await this.filesService.createDocumentByParentId(
        createTemplateDto.name,
        process.driveId,
      )

      template.driveId = templateId

      const savedTemplate = await this.templateRepository.save(template)

      return new ResponseTemplateDto(savedTemplate)
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async findAll(): Promise<TemplateProcess[]> {
    return await this.templateRepository.find()
  }

  async findOne(id: number): Promise<TemplateProcess> {
    const template = await this.templateRepository.findOneBy({ id })

    if (!template) {
      throw new BadRequestException('Template not found')
    }

    return template
  }

  async update(
    id: number,
    updateTemplateDto: UpdateTemplateDto,
  ): Promise<ResponseTemplateDto> {
    const template = await this.templateRepository.findOneBy({ id })

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

    if (updateTemplateDto.name) {
      await this.filesService.renameDocument(
        updatedTemplate.driveId,
        updateTemplateDto.name,
      )
    }

    const savedTemplate = await this.templateRepository.save(template)

    return new ResponseTemplateDto(savedTemplate)
  }

  async remove(id: number): Promise<boolean> {
    const template = await this.findOne(id)

    template.isActive = false

    await this.templateRepository.save(template)

    return true
  }
}

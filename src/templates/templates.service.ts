import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateTemplateDto } from './dto/create-template.dto'
import { UpdateTemplateDto } from './dto/update-template.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { TemplateProcess } from './entities/template-processes.entity'

@Injectable()
export class TemplatesService {
  constructor(
    @InjectRepository(TemplateProcess)
    private readonly templateRepository: Repository<TemplateProcess>,
  ) {}
  async create(createTemplateDto: CreateTemplateDto): Promise<TemplateProcess> {
    try {
      const template = this.templateRepository.create({
        ...createTemplateDto,
        process: { id: createTemplateDto.processId },
      })

      return await this.templateRepository.save(template)
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
  ): Promise<TemplateProcess> {
    const template = await this.templateRepository.preload({
      id,
      ...updateTemplateDto,
      process: { id: updateTemplateDto.processId },
    })

    if (!template) {
      throw new BadRequestException('Template not found')
    }

    return await this.templateRepository.save(template)
  }

  async remove(id: number): Promise<boolean> {
    const template = await this.findOne(id)

    template.isActive = false

    await this.templateRepository.save(template)

    return true
  }
}

import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateProcessDto } from './dto/create-process.dto'
import { UpdateProcessDto } from './dto/update-process.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Process } from './entities/process.entity'
import { FilesService } from '../files/files.service'

@Injectable()
export class ProcessesService {
  constructor(
    @InjectRepository(Process)
    private readonly processRepository: Repository<Process>,

    private readonly fileService: FilesService,
  ) {}

  async create(createProcessDto: CreateProcessDto): Promise<Process> {
    try {
      const process = this.processRepository.create({
        ...createProcessDto,
        module: { id: createProcessDto.moduleId },
        user: { id: createProcessDto.userId },
      })

      return await this.processRepository.save(process)
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async findAll(): Promise<Process[]> {
    return await this.processRepository.find()
  }

  async findOne(id: string): Promise<Process> {
    const process = await this.processRepository.findOneBy({ id })

    if (!process) {
      throw new BadRequestException('Process not found')
    }

    return process
  }

  async update(
    id: string,
    updateProcessDto: UpdateProcessDto,
  ): Promise<Process> {
    const process = await this.processRepository.preload({
      id,
      ...updateProcessDto,
      module: { id: updateProcessDto.moduleId },
      user: { id: updateProcessDto.userId },
    })

    if (!process) {
      throw new BadRequestException('Process not found')
    }

    return await this.processRepository.save(process)
  }

  async remove(id: string): Promise<boolean> {
    const process = await this.findOne(id)

    process.isActive = false
    await this.processRepository.save(process)

    return true
  }
}

import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
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

      if (!process) {
        throw new BadRequestException('Process not created')
      }

      return await this.processRepository.save(process)
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findAll(): Promise<Process[]> {
    try {
      const processes = await this.processRepository.find({
        order: {
          id: 'ASC',
        },
      })

      if (!processes) {
        throw new NotFoundException('Processes not found')
      }

      return processes
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findOne(id: number): Promise<Process> {
    try {
      const process = await this.processRepository.findOneBy({ id })

      if (!process) {
        throw new NotFoundException('Process not found')
      }

      return process
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async update(
    id: number,
    updateProcessDto: UpdateProcessDto,
  ): Promise<Process> {
    try {
      const process = await this.processRepository.preload({
        id,
        ...updateProcessDto,
        module: { id: updateProcessDto.moduleId },
        user: { id: updateProcessDto.userId },
      })

      if (!process) {
        throw new NotFoundException('Process not found')
      }

      return await this.processRepository.save(process)
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async remove(id: number): Promise<boolean> {
    try {
      const process = await this.findOne(id)

      if (!process) {
        throw new NotFoundException('Process not found')
      }

      await this.processRepository.delete(id)

      return true
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}

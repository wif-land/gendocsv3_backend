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
import { Repository, DataSource } from 'typeorm'
import { Process } from './entities/process.entity'
import { FilesService } from '../files/files.service'
import { YearModuleEntity } from '../year-module/entities/year-module.entity'
import { SubmoduleYearModuleEntity } from '../year-module/entities/submodule-year-module.entity'
import { SubmodulesNames } from '../shared/enums/submodules-names'
import { ResponseProcessDto } from './dto/response-process.dto'

@Injectable()
export class ProcessesService {
  constructor(
    @InjectRepository(Process)
    private readonly processRepository: Repository<Process>,

    @InjectRepository(YearModuleEntity)
    private readonly yearModuleRepository: Repository<YearModuleEntity>,

    @InjectRepository(SubmoduleYearModuleEntity)
    private readonly submoduleYearModuleRepository: Repository<SubmoduleYearModuleEntity>,

    private readonly dataSource: DataSource,

    private readonly fileService: FilesService,
  ) {}

  async create(createProcessDto: CreateProcessDto): Promise<Process> {
    try {
      const year = new Date().getFullYear()

      const yearModule = await this.yearModuleRepository.findOneBy({
        year,
        module: { id: createProcessDto.moduleId },
      })

      if (!yearModule) {
        throw new NotFoundException('Year module not found')
      }

      const submoduleYearModule =
        await this.submoduleYearModuleRepository.findOneBy({
          name: SubmodulesNames.PROCESSES,
          yearModule: { id: yearModule.id },
        })

      if (!submoduleYearModule) {
        throw new NotFoundException('Submodule year module not found')
      }

      const process = this.processRepository.create({
        ...createProcessDto,
        module: { id: createProcessDto.moduleId },
        user: { id: createProcessDto.userId },
        submoduleYearModule: { id: submoduleYearModule.id },
      })

      if (!process) {
        throw new BadRequestException('Process not created')
      }

      const processFolderId = await this.fileService.createFolderByParentId(
        process.name,
        submoduleYearModule.driveId,
      )

      if (!processFolderId) {
        throw new BadRequestException('Process folder not created')
      }

      process.driveId = processFolderId

      return await this.processRepository.save(process)
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findAll() {
    try {
      const qb = this.dataSource
        .createQueryBuilder(Process, 'processes')
        .leftJoinAndSelect('processes.user', 'user')
        .leftJoinAndSelect('processes.module', 'module')
        .leftJoinAndSelect(
          'processes.submoduleYearModule',
          'submoduleYearModule',
        )
        .orderBy('processes.createdAt', 'DESC')

      const processes = await qb.getMany()

      if (!processes) {
        throw new NotFoundException('Processes not found')
      }

      return processes.map((process) => new ResponseProcessDto(process))
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findOne(id: number) {
    try {
      const qb = this.dataSource
        .createQueryBuilder(Process, 'processes')
        .leftJoinAndSelect('processes.user', 'user')
        .leftJoinAndSelect('processes.module', 'module')
        .leftJoinAndSelect(
          'processes.submoduleYearModule',
          'submoduleYearModule',
        )
        .where('processes.id = :id', { id })

      const process = await qb.getOne()

      if (!process) {
        throw new NotFoundException('Process not found')
      }

      return new ResponseProcessDto(process)
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async update(id: number, updateProcessDto: UpdateProcessDto) {
    try {
      const qb = this.dataSource
        .createQueryBuilder(Process, 'processes')
        .leftJoinAndSelect('processes.user', 'user')
        .leftJoinAndSelect('processes.module', 'module')
        .leftJoinAndSelect(
          'processes.submoduleYearModule',
          'submoduleYearModule',
        )
        .where('processes.id = :id', { id })

      const process = await qb.getOne()

      if (!process) {
        throw new NotFoundException('Process not found')
      }

      const updatedProcess = this.processRepository.merge(
        process,
        updateProcessDto,
      )

      if (!updatedProcess) {
        throw new BadRequestException('Process not updated')
      }

      if (updateProcessDto.name) {
        await this.fileService.renameFolder(
          updatedProcess.driveId,
          updateProcessDto.name,
        )
      }

      const responseProcess = await this.processRepository.save(updatedProcess)

      return new ResponseProcessDto(responseProcess)
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

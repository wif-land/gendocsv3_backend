import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateYearModuleDto } from './dto/create-year-module.dto'
import { UpdateYearModuleDto } from './dto/update-year-module.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { YearModuleEntity } from './entities/year-module.entity'
import { Repository } from 'typeorm'
import { GcpService } from '../gcp/gcp.service'
import { SubmoduleYearModuleEntity } from './entities/submodule-year-module.entity'

@Injectable()
export class YearModuleService {
  constructor(
    @InjectRepository(YearModuleEntity)
    private yearModuleRepository: Repository<YearModuleEntity>,

    @InjectRepository(SubmoduleYearModuleEntity)
    private submoduleYearModuleRepository: Repository<SubmoduleYearModuleEntity>,

    private gcpService: GcpService,
  ) {}

  async create(createYearModuleDto: CreateYearModuleDto) {
    try {
      const alreadyExists = await this.yearModuleRepository.findOne({
        where: {
          year: createYearModuleDto.year,
          module: { id: createYearModuleDto.module.id },
        },
      })

      if (alreadyExists) {
        throw new HttpException(
          'YearModule already exists',
          HttpStatus.CONFLICT,
        )
      }

      const yearModule = this.yearModuleRepository.create(createYearModuleDto)
      yearModule.driveId = await this.gcpService.createFolderByParentId(
        createYearModuleDto.year.toString(),
        createYearModuleDto.module.driveId,
      )

      const auxYearModule = await this.yearModuleRepository.save(yearModule)

      if (createYearModuleDto.module.code === 'COMM') {
        const actasDirectory = await this.gcpService.createFolderByParentId(
          'Actas de grado',
          auxYearModule.driveId,
        )

        const actasSubmodule = this.submoduleYearModuleRepository.create({
          name: 'Actas de grado',
          driveId: actasDirectory,
          yearModule: auxYearModule,
        })

        await this.submoduleYearModuleRepository.save(actasSubmodule)
      } else {
        const processesDirectory = await this.gcpService.createFolderByParentId(
          'Procesos',
          auxYearModule.driveId,
        )

        const processesSubmodule = this.submoduleYearModuleRepository.create({
          name: 'Procesos',
          driveId: processesDirectory,
          yearModule: auxYearModule,
        })

        await this.submoduleYearModuleRepository.save(processesSubmodule)

        const councilsDirectory = await this.gcpService.createFolderByParentId(
          'Consejos',
          auxYearModule.driveId,
        )

        const councilsSubmodule = this.submoduleYearModuleRepository.create({
          name: 'Consejos',
          driveId: councilsDirectory,
          yearModule: auxYearModule,
        })

        await this.submoduleYearModuleRepository.save(councilsSubmodule)
      }
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  findAll() {
    return `This action returns all yearModule`
  }

  findOne(id: number) {
    return `This action returns a #${id} yearModule`
  }

  update(id: number, updateYearModuleDto: UpdateYearModuleDto) {
    return `This action updates a #${id} yearModule ${updateYearModuleDto}`
  }

  remove(id: number) {
    return `This action removes a #${id} yearModule`
  }
}

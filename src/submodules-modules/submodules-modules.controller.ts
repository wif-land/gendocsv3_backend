import { Controller, Get, Post, Body, Patch, Delete } from '@nestjs/common'
import { SubmodulesModulesService } from './submodules-modules.service'
import { CreateSubmodulesModuleDto } from './dto/create-submodules-module.dto'
import { UpdateSubmodulesModuleDto } from './dto/update-submodules-module.dto'
import { BaseResponseEntity } from './../shared/utils/base-response'

@Controller('submodules-modules')
export class SubmodulesModulesController {
  constructor(
    private readonly submodulesModulesService: SubmodulesModulesService,
  ) {}

  @Post()
  async create(@Body() createSubmodulesModuleDto: CreateSubmodulesModuleDto) {
    const { submodulesModules, error } =
      await this.submodulesModulesService.create(createSubmodulesModuleDto)

    if (error || !submodulesModules) {
      return new BaseResponseEntity({
        message: 'Error creating submodulesModules',
        error,
        statusCode: 500,
      })
    }

    return new BaseResponseEntity({
      message: 'SubmodulesModules created',
      data: submodulesModules,
      statusCode: 201,
    })
  }

  @Get()
  findAll() {
    const submodulesModules = this.submodulesModulesService.findAll()

    if (!submodulesModules) {
      return new BaseResponseEntity({
        message: 'Error finding submodulesModules',
        statusCode: 500,
      })
    }

    return new BaseResponseEntity({
      message: 'SubmodulesModules found',
      data: submodulesModules,
      statusCode: 200,
    })
  }

  @Patch(':id')
  async update(@Body() updateSubmodulesModuleDto: UpdateSubmodulesModuleDto) {
    const { submodulesModules, error } =
      await this.submodulesModulesService.update(updateSubmodulesModuleDto)

    if (error || !submodulesModules) {
      return new BaseResponseEntity({
        message: 'Error updating submodulesModules',
        error,
        statusCode: 500,
      })
    }

    return new BaseResponseEntity({
      message: 'SubmodulesModules updated',
      data: submodulesModules,
      statusCode: 200,
    })
  }

  @Delete()
  async remove(@Body() moduleId: number, @Body() submoduleId: number) {
    const removed = await this.submodulesModulesService.remove(
      moduleId,
      submoduleId,
    )

    if (!removed) {
      return new BaseResponseEntity({
        message: 'Error removing submodulesModules',
        statusCode: 500,
      })
    }

    return new BaseResponseEntity({
      message: 'SubmodulesModules removed',
      statusCode: 200,
    })
  }
}

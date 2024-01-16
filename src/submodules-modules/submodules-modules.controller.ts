import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Param,
  ParseIntPipe,
} from '@nestjs/common'
import { SubmodulesModulesService } from './submodules-modules.service'
import { CreateSubmodulesModuleDto } from './dto/create-submodule-module.dto'
import { UpdateSubmodulesModuleDto } from './dto/update-submodule-module.dto'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('submodules-modules')
@Controller('submodules-modules')
export class SubmodulesModulesController {
  constructor(
    private readonly submodulesModulesService: SubmodulesModulesService,
  ) {}

  @Post()
  async create(@Body() createSubmodulesModuleDto: CreateSubmodulesModuleDto) {
    return await this.submodulesModulesService.create(createSubmodulesModuleDto)
  }

  @Get()
  async findAll() {
    return await this.submodulesModulesService.findAll()
  }

  @Patch()
  async update(@Body() updateSubmodulesModuleDto: UpdateSubmodulesModuleDto) {
    return await this.submodulesModulesService.update(updateSubmodulesModuleDto)
  }

  @Delete()
  async remove(@Body() data: { moduleId: number; submoduleId: number }) {
    return await this.submodulesModulesService.remove(
      data.moduleId,
      data.submoduleId,
    )
  }

  @Delete('all-from-module/:moduleId')
  async removeAllFromModule(@Param('moduleId', ParseIntPipe) moduleId: number) {
    return await this.submodulesModulesService.removeAll(moduleId)
  }
}

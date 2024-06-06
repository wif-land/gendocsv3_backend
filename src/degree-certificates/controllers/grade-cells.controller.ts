import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common'
import { GradesSheetService } from '../services/grades-sheet.service'
import { ApiResponseDto } from '../../shared/dtos/api-response.dto'
import { CreateCellGradeDegreeCertificateTypeDto } from '../dto/create-cells-grade-degree-certificate-type.dto'
import { UpdateCellGradeDegreeCertificateTypeDto } from '../dto/update-cells-grade-degree-certificate-type.dto'

@Controller('degree-certificates/grade-cells')
export class GradeCellsController {
  constructor(private readonly gradesSheetService: GradesSheetService) {}

  @Get('/by-certificate-type/:certificateTypeId')
  async showGradeCellsByCertificateType(
    @Param('certificateTypeId', ParseIntPipe) certificateTypeId: number,
  ) {
    const gradeCells =
      await this.gradesSheetService.getGradeCellsByCertificateType(
        certificateTypeId,
      )

    return new ApiResponseDto(
      'Listado de celdas de grado obtenido exitosamente',
      gradeCells,
    )
  }

  @Post()
  async createGradeCell(
    @Body()
    createCellGradeDegreeCertificateTypeDto: CreateCellGradeDegreeCertificateTypeDto,
  ) {
    return await this.gradesSheetService.createCellGradeByCertificateType(
      createCellGradeDegreeCertificateTypeDto,
    )
  }

  @Patch('/:id')
  async updateGradeCell(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCellGradeDegreeCertificateTypeDto,
  ) {
    return await this.gradesSheetService.updateCellGradeByCertificateType(
      id,
      dto,
    )
  }

  @Delete('/:id')
  async deleteGradeCell(@Param('id', ParseIntPipe) id: number) {
    return await this.gradesSheetService.deleteCellGradeByCertificateType(id)
  }
}

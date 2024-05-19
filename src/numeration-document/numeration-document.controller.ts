import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common'
import { NumerationDocumentService } from './numeration-document.service'
import { CreateNumerationDocumentDto } from './dto/create-numeration-document.dto'
import { ApiTags } from '@nestjs/swagger'
import { ReserveNumerationDocumentDto } from './dto/reserve-numeration.dto'
import { ApiResponseDto } from '../shared/dtos/api-response.dto'

@ApiTags('NumerationDocument')
@Controller('numeration-document')
export class NumerationDocumentController {
  constructor(
    private readonly numerationDocumentService: NumerationDocumentService,
  ) {}

  @Post()
  create(@Body() createNumerationDocumentDto: CreateNumerationDocumentDto) {
    return this.numerationDocumentService.create(createNumerationDocumentDto)
  }

  @Get('by-council')
  async findByCouncil(@Query('councilId', ParseIntPipe) id: number) {
    return await this.numerationDocumentService.getNumerationByCouncil(id)
  }

  @Get('next-to-register/:moduleId')
  async getNextToRegister(@Param('moduleId', ParseIntPipe) moduleId: number) {
    const number = await this.numerationDocumentService.getNextNumberToRegister(
      moduleId,
    )

    return new ApiResponseDto('Número obtenido exitosamente', number)
  }

  @Get('could-reserve/:moduleId')
  async couldReserve(@Param('moduleId', ParseIntPipe) moduleId: number) {
    const couldReserve =
      await this.numerationDocumentService.getCouncilsCouldReserveNumeration(
        moduleId,
      )

    return new ApiResponseDto('Reserva de numeración permitida', couldReserve)
  }

  @Get('available-extension-numeration/:councilId')
  async getAvailableExtensionNumeration(
    @Param('councilId', ParseIntPipe) councilId: number,
  ) {
    const numeration =
      await this.numerationDocumentService.getAvailableExtensionNumeration(
        councilId,
      )

    return new ApiResponseDto(
      'Numeración de extensión disponible obtenida exitosamente',
      numeration,
    )
  }

  @Post('reserve')
  async reserveNumeration(@Body() dto: ReserveNumerationDocumentDto) {
    const numeration = await this.numerationDocumentService.reserveNumeration(
      dto,
    )

    return new ApiResponseDto('Numeración reservada exitosamente', numeration)
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.numerationDocumentService.findOne(id)
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.numerationDocumentService.remove(id)
  }
}

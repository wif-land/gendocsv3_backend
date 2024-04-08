import { Controller } from '@nestjs/common'
import { DegreeCertificatesService } from './degree-certificates.service'

@Controller('degree-certificates')
export class DegreeCertificatesController {
  constructor(
    private readonly degreeCertificatesService: DegreeCertificatesService,
  ) {}

  // @Post()
  // create(@Body() createDegreeCertificateDto: CreateDegreeCertificateDto) {
  //   return this.degreeCertificatesService.create(createDegreeCertificateDto)
  // }

  // @Get()
  // findAll() {
  //   return this.degreeCertificatesService.findAll()
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.degreeCertificatesService.findOne(+id)
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateDegreeCertificateDto: UpdateDegreeCertificateDto,
  // ) {
  //   return this.degreeCertificatesService.update(
  //     +id,
  //     updateDegreeCertificateDto,
  //   )
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.degreeCertificatesService.remove(+id)
  // }
}

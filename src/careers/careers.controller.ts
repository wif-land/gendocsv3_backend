import { Controller } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Careers')
@Controller('careers')
export class CareersController {}

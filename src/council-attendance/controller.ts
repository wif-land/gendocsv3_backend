import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common'
import { CouncilsAttendanceService } from './service'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Councils Attendance')
@Controller('council-attendance')
export class CouncilsAttendanceController {
  constructor(private readonly councilsService: CouncilsAttendanceService) {}
}

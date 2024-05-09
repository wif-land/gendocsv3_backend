import { ApiProperty, PartialType } from '@nestjs/swagger'
import { CreateDegreeCertificateAttendanceDto } from './create-degree-certificate-attendance.dto'
import { IsBoolean, IsOptional } from 'class-validator'

export class UpdateDegreeCertificateAttendanceDto extends PartialType(
  CreateDegreeCertificateAttendanceDto,
) {
  @ApiProperty({
    description: 'Indica si el funcionario ha asistido al acta de grado',
    example: true,
    type: String,
  })
  @IsBoolean()
  @IsOptional()
  hasAttended: boolean

  @ApiProperty({
    description:
      'Indica si el funcionario ha sido notificado de la asistencia al acta de grado',
    example: true,
    type: String,
  })
  @IsBoolean()
  @IsOptional()
  hasBeenNotified: boolean
}

import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateCareerDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'internshipHours is required' })
  @IsNumber()
  internshipHours: number

  @ApiProperty()
  @IsNotEmpty({ message: 'vinculationHours is required' })
  @IsNumber()
  vinculationHours: number

  @ApiProperty()
  @IsNotEmpty({ message: 'coordinator is required' })
  @IsNumber()
  coordinator: number

  @ApiProperty()
  @IsNotEmpty({ message: 'name is required' })
  @IsString({ message: 'name must be a string' })
  name: string

  @ApiProperty()
  @IsNotEmpty({ message: 'credits is required' })
  @IsNumber()
  credits: number

  @ApiProperty()
  @IsNotEmpty({ message: 'menDegree is required' })
  menDegree: string

  @ApiProperty()
  @IsNotEmpty({ message: 'womenDegree is required' })
  womenDegree: string

  @ApiProperty()
  @IsNotEmpty({ message: 'isActive is required' })
  @IsBoolean({ message: 'isActive must be a boolean' })
  isActive: boolean
}

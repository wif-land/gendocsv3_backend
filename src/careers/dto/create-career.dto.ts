import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator'
import { ICareer } from '../interfaces/career.interface'

export class CreateCareerDto implements ICareer {
  @ApiProperty()
  @IsNotEmpty({ message: 'internshipHours is required' })
  internshipHours: number

  @ApiProperty()
  @IsNotEmpty({ message: 'vinculationHours is required' })
  vinculationHours: number

  @ApiProperty()
  @IsNotEmpty({ message: 'coordinator is required' })
  coordinator: string

  @ApiProperty()
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string

  @ApiProperty()
  @IsNotEmpty({ message: 'credits is required' })
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

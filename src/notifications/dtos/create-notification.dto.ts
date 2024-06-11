import {
  IsString,
  IsArray,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsNumber,
} from 'class-validator'
import { NotificationStatus } from '../../shared/enums/notification-status'
import { ScopeInterface } from '../../shared/interfaces/scope-notification'

export class CreateNotificationDto {
  @IsString()
  name: string

  @IsString()
  type: string

  @IsOptional()
  @IsArray()
  messages?: string[]

  @IsEnum(NotificationStatus)
  status: NotificationStatus

  @IsOptional()
  @IsString()
  data?: string

  @IsOptional()
  scope?: ScopeInterface

  @IsOptional()
  isMain?: boolean

  @IsOptional()
  parentId?: number

  @IsOptional()
  @IsBoolean()
  isRetry?: boolean

  @IsNumber()
  createdBy: number
}

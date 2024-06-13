import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Query,
  ParseIntPipe,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CreateNotificationDto } from '../dtos/create-notification.dto'
import { UpdateNotificationDto } from '../dtos/update-notification.dto'
import { NotificationEntity } from '../entities/notification.entity'
import { NotificationsService } from '../notifications.service'
import { ApiResponseDto } from '../../shared/dtos/api-response.dto'

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  async create(
    @Body() createNotificationDto: CreateNotificationDto,
  ): Promise<NotificationEntity> {
    return await this.notificationsService.create(createNotificationDto)
  }

  @Get()
  async findAll(
    @Query('filters') filters?: string,
    @Query('limit') limit?: number,
  ): Promise<
    ApiResponseDto<
      {
        notification: NotificationEntity
        childs: NotificationEntity[]
      }[]
    >
  > {
    // Parse filters if they exist
    const parsedFilters = filters ? JSON.parse(filters) : undefined

    return new ApiResponseDto<
      {
        notification: NotificationEntity
        childs: NotificationEntity[]
      }[]
    >(
      'Notificaciones encontradas con éxito',
      await this.notificationsService.findAll(parsedFilters, limit),
    )
  }

  @Get(':userId')
  async findOne(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('limit') limit?: number,
  ): Promise<
    { notification: NotificationEntity; childs: NotificationEntity[] }[]
  > {
    return await this.notificationsService.findAllAvailableForUser(
      userId,
      limit,
    )
  }

  @Get('parent/:parentId')
  async notificationsByParent(
    @Param('parentId') parentId: string,
  ): Promise<NotificationEntity[]> {
    return await this.notificationsService.notificationsByParent(+parentId)
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ): Promise<void> {
    await this.notificationsService.update(+id, updateNotificationDto)
  }
}

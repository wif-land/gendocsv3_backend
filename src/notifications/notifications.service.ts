import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { NotificationEntity } from './entities/notification.entity'
import { CreateNotificationDto } from './dtos/create-notification.dto'
import { UpdateNotificationDto } from './dtos/update-notification.dto'
import { NotificationStatus } from '../shared/enums/notification-status'

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
  ) {}

  async create(
    notification: CreateNotificationDto,
  ): Promise<NotificationEntity> {
    const notificationModel = await this.notificationRepository.create({
      ...notification,
      createdBy: { id: notification.createdBy },
    })
    return await this.notificationRepository.save(notificationModel)
  }

  async findAll(): Promise<NotificationEntity[]> {
    return await this.notificationRepository.find()
  }

  async countNotificationsCompletedByParent(parentId: number): Promise<number> {
    return await this.notificationRepository
      .createQueryBuilder('notifications')
      .where('notifications.parentId = :parentId', { parentId })
      .andWhere('notifications.status = :status', {
        status: NotificationStatus.COMPLETED,
      })
      .getCount()
  }

  async findOne(id: number): Promise<NotificationEntity> {
    return await this.notificationRepository.findOneBy({ id })
  }

  async update(id: number, notification: UpdateNotificationDto): Promise<void> {
    await this.notificationRepository.update(id, {
      ...notification,
    })
  }

  async updateFailureMsg(id: number, errors: string[]) {
    await this.update(id, {
      messages: errors,
      status: NotificationStatus.FAILURE,
    })
  }

  async remove(id: string): Promise<void> {
    await this.notificationRepository.delete(id)
  }
}

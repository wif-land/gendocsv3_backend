import { Injectable, Logger } from '@nestjs/common'
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
    try {
      const notificationModel = await this.notificationRepository.create({
        ...notification,
        createdBy: { id: notification.createdBy },
      })

      return await this.notificationRepository.save(notificationModel)
    } catch (error) {
      Logger.error(error)
    }
  }

  async findAll(
    filters?: Partial<NotificationEntity>,
    limit?: number,
  ): Promise<
    { notification: NotificationEntity; childs: NotificationEntity[] }[]
  > {
    const query = this.notificationRepository
      .createQueryBuilder('notifications')
      .leftJoinAndSelect('notifications.createdBy', 'createdBy')

    // Apply filters
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query.andWhere(`notifications.${key} = :${key}`, { [key]: value })
      })
    }

    // Apply limit

    query.orderBy('notifications.createdAt', 'DESC').take(limit)

    const notifications = await query.getMany()

    const responses = notifications.map((notification) => {
      const childs = notifications.filter((n) => n.parentId === notification.id)
      return {
        notification,
        childs,
      }
    })

    return responses
  }

  async notificationsByParent(parentId: number): Promise<NotificationEntity[]> {
    return await this.notificationRepository
      .createQueryBuilder('notifications')
      .where('notifications.parentId = :parentId', { parentId })
      .getMany()
  }

  async findOne(id: number): Promise<NotificationEntity> {
    return await this.notificationRepository.findOneBy({ id })
  }

  async update(id: number, notification: UpdateNotificationDto): Promise<void> {
    await this.notificationRepository.update(id, {
      ...notification,
    })
  }

  async updateFailureMsg(
    id: number,
    errors: string[],
    data?: string,
  ): Promise<void> {
    await this.update(id, {
      messages: errors,
      status: NotificationStatus.FAILURE,
      data,
    })
  }

  async remove(id: string): Promise<void> {
    await this.notificationRepository.delete(id)
  }
}

import { NotificationsService } from './notifications.service'
import { NotificationsGateway } from './notifications.gateway'
import { NotificationEntity } from './entities/notification.entity'
import { NotificationsController } from './controllers/notifications.controller'
import { Module } from '@nestjs/common/decorators/modules/module.decorator'
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module'

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsGateway, NotificationsService],
  imports: [TypeOrmModule.forFeature([NotificationEntity])],
  exports: [NotificationsService, NotificationsGateway],
})
export class NotificationsModule {}

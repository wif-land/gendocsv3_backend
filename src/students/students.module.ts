import { Module } from '@nestjs/common'
import { StudentsService } from './students.service'
import { StudentsController } from './students.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { StudentEntity } from './entities/student.entity'
import { NotificationsModule } from '../notifications/notifications.module'

@Module({
  controllers: [StudentsController],
  providers: [StudentsService],
  imports: [TypeOrmModule.forFeature([StudentEntity]), NotificationsModule],
  exports: [StudentsService],
})
export class StudentsModule {}

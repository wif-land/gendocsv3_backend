import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CertificateStatusEntity } from './entities/certificate-status.entity'
import { CertificateTypeEntity } from './entities/certificate-type.entity'
import { DegreeCertificateEntity } from './entities/degree-certificate.entity'
import { DegreeModalityEntity } from './entities/degree-modality.entity'
import { RoomEntity } from './entities/room.entity'
import { YearModuleModule } from '../year-module/year-module.module'
import { FilesModule } from '../files/modules/files.module'
import { StudentsModule } from '../students/students.module'
import { VariablesModule } from '../variables/variables.module'
import { CertificateTypeStatusEntity } from './entities/certificate-type-status.entity'
import { CertificateTypeCareerEntity } from './entities/certicate-type-career.entity'
import { CellsGradeDegreeCertificateTypeEntity } from './entities/cells-grade-degree-certificate-type.entity'
import { DegreeCertificateAttendanceModule } from '../degree-certificate-attendance/degree-certificate-attendance.module'
import { CertificateStatusService } from './services/certificate-status.service'
import { CertificateTypeService } from './services/certificate-type.service'
import { GradesSheetService } from './services/grades-sheet.service'
import { DegreeModalitiesService } from './services/degree-modalities.service'
import { RoomsService } from './services/rooms.service'
import { DegreeCertificatesService } from './degree-certificates.service'
import { DegreeCertificatesController } from './controllers/degree-certificates.controller'
import { GradeCellsController } from './controllers/grade-cells.controller'
import { DegreeModalitiesController } from './controllers/degree-modalities.controller'
import { RoomsController } from './controllers/rooms.controller'
import { CertificateTypesController } from './controllers/certificate-types.controller'
import { CertificateStatusController } from './controllers/certificate-status.controller'
import { CertificateBulkService } from './services/certificate-bulk.service'
import { FunctionariesModule } from '../functionaries/functionaries.module'
import { DegreeCertificateRepository } from './repositories/degree-certificate-repository'
import { BullModule } from '@nestjs/bull'
import { CertificateProcessor } from './processors/certificate-processor'
import { NotificationsModule } from '../notifications/notifications.module'

@Module({
  controllers: [
    DegreeCertificatesController,
    CertificateTypesController,
    CertificateStatusController,
    GradeCellsController,
    DegreeModalitiesController,
    RoomsController,
  ],
  providers: [
    DegreeCertificatesService,
    CertificateStatusService,
    CertificateTypeService,
    GradesSheetService,
    DegreeModalitiesService,
    RoomsService,
    CertificateBulkService,
    CertificateProcessor,
    {
      provide: 'DegreeCertificateRepository',
      useClass: DegreeCertificateRepository,
    },
  ],
  imports: [
    BullModule.registerQueue({
      name: 'certificateQueue',
    }),
    TypeOrmModule.forFeature([
      CertificateStatusEntity,
      CertificateTypeEntity,
      DegreeCertificateEntity,
      DegreeModalityEntity,
      RoomEntity,
      CertificateTypeStatusEntity,
      CertificateTypeCareerEntity,
      CellsGradeDegreeCertificateTypeEntity,
    ]),
    DegreeCertificateAttendanceModule,
    YearModuleModule,
    FilesModule,
    StudentsModule,
    VariablesModule,
    FunctionariesModule,
    NotificationsModule,
  ],
})
export class DegreeCertificatesModule {}

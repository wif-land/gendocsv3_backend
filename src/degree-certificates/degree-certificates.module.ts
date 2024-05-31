import { Module } from '@nestjs/common'
import { DegreeCertificatesService } from './degree-certificates.service'
import { DegreeCertificatesController } from './degree-certificates.controller'
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

@Module({
  controllers: [DegreeCertificatesController],
  providers: [DegreeCertificatesService],
  imports: [
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
  ],
})
export class DegreeCertificatesModule {}

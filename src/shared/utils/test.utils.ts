import { DynamicModule } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DataSourceOptions } from 'typeorm'
import { DegreeCertificateAttendanceEntity } from '../../degree-certificate-attendance/entities/degree-certificate-attendance.entity'
import { DegreeCertificateEntity } from '../../degree-certificates/entities/degree-certificate.entity'
import { StudentEntity } from '../../students/entities/student.entity'
import { ProvinceEntity } from '../../cities/entities/province.entity'
import { CityEntity } from '../../cities/entities/city.entity'
import { CareerEntity } from '../../careers/entites/careers.entity'
import { FunctionaryEntity } from '../../functionaries/entities/functionary.entity'
import { DegreeEntity } from '../../degrees/entities/degree.entity'
import { CouncilEntity } from '../../councils/entities/council.entity'
import { CouncilAttendanceEntity } from '../../councils/entities/council-attendance.entity'
import { ModuleEntity } from '../../modules/entities/modules.entity'
import { SubmoduleEntity } from '../../submodules/entities/submodule.entity'
import { YearModuleEntity } from '../../year-module/entities/year-module.entity'
import { SubmoduleYearModuleEntity } from '../../year-module/entities/submodule-year-module.entity'
import { ProcessEntity } from '../../processes/entities/process.entity'
import { UserEntity } from '../../users/entities/users.entity'
import { TemplateProcess } from '../../templates/entities/template-processes.entity'
import { DocumentEntity } from '../../documents/entities/document.entity'
import { NumerationDocumentEntity } from '../../numeration-document/entities/numeration-document.entity'
import { DocumentFunctionaryEntity } from '../../documents/entities/document-functionary.entity'
import { PositionEntity } from '../../positions/entities/position.entity'
import { CertificateTypeEntity } from '../../degree-certificates/entities/certificate-type.entity'
import { CellsGradeDegreeCertificateTypeEntity } from '../../degree-certificates/entities/cells-grade-degree-certificate-type.entity'
import { CertificateTypeCareerEntity } from '../../degree-certificates/entities/certicate-type-career.entity'
import { CertificateTypeStatusEntity } from '../../degree-certificates/entities/certificate-type-status.entity'
import { CertificateStatusEntity } from '../../degree-certificates/entities/certificate-status.entity'
import { DegreeModalityEntity } from '../../degree-certificates/entities/degree-modality.entity'
import { RoomEntity } from '../../degree-certificates/entities/room.entity'
import { SystemYearEntity } from '../../year-module/entities/system-year.entity'
import { VariableEntity } from '../../variables/entities/variable.entity'

const testDataSourceConfig = {
  type: 'postgres',
  database: 'test',
  host: 'localhost',
  port: 9006,
  username: 'test',
  password: 'test',
  autoLoadEntities: true,
  synchronize: true,
  dropSchema: true,
  logging: true,
  keepConnectionAlive: true,
}

export const getTestingTypeOrmModuleImports = (): Array<DynamicModule> => [
  TypeOrmModule.forRoot(testDataSourceConfig as DataSourceOptions),
  TypeOrmModule.forFeature([
    DegreeCertificateAttendanceEntity,
    DegreeCertificateEntity,
    StudentEntity,
    ProvinceEntity,
    CityEntity,
    CareerEntity,
    FunctionaryEntity,
    DegreeEntity,
    CouncilEntity,
    CouncilAttendanceEntity,
    ModuleEntity,
    SubmoduleEntity,
    YearModuleEntity,
    SubmoduleYearModuleEntity,
    ProcessEntity,
    UserEntity,
    TemplateProcess,
    DocumentEntity,
    SystemYearEntity,
    VariableEntity,
    NumerationDocumentEntity,
    DocumentFunctionaryEntity,
    PositionEntity,
    CertificateTypeEntity,
    CellsGradeDegreeCertificateTypeEntity,
    CertificateTypeCareerEntity,
    CertificateTypeStatusEntity,
    CertificateStatusEntity,
    DegreeModalityEntity,
    RoomEntity,
  ]),
]

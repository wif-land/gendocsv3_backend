import { Test, TestingModule } from '@nestjs/testing'
import { DataSource } from 'typeorm'
import { getTestingTypeOrmModuleImports } from '../../../shared/utils/test.utils'
import { TypeOrmHelper } from '../../../shared/utils/test/typeorm-helper'
import { DegreeCertificateAttendanceTestData } from '../../../degree-certificate-attendance/fixtures/data'
import { DegreeCertificatesService } from '../../services/degree-certificates.service'
import { YearModuleService } from '../../../year-module/year-module.service'
import { FilesService } from '../../../files/services/files.service'
import { StudentsService } from '../../../students/students.service'
import { VariablesService } from '../../../variables/variables.service'
import { DegreeAttendanceService } from '../../../degree-certificate-attendance/degree-certificate-attendance.service'
import { GradesSheetService } from '../../services/grades-sheet.service'
import { CertificateStatusService } from '../../services/certificate-status.service'
import { CertificateNumerationService } from '../../services/certificate-numeration.service'
import { CERTIFICATE_QUEUE_NAME, DEGREE_CERTIFICATE } from '../../constants'
import { GcpService } from '../../../gcp/gcp.service'
import { FileSystemService } from '../../../files/services/file-system.service'
import { DocxService } from '../../../files/services/docx.service'
import { ExcelService } from '../../../files/services/excel.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import configuration from '../../../shared/utils/test/test.config'
import { MockGcpService } from '../../../gcp/mocks/gcp.service'
import { BullModule } from '@nestjs/bull'
import { DegreeCertificateRepository } from '../../repositories/degree-certificate-repository'

describe('DegreeAttendanceService tests', () => {
  let service: DegreeCertificatesService
  let module: TestingModule

  beforeAll(async () => {
    jest.useFakeTimers()

    module = await Test.createTestingModule({
      imports: [
        ...getTestingTypeOrmModuleImports(),
        ConfigModule.forRoot({ load: [configuration] }),
        BullModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: async () => ({
            redis: {
              host: 'localhost',
              port: 6379,
            },
          }),
          inject: [ConfigService],
        }),
        BullModule.registerQueue({
          name: CERTIFICATE_QUEUE_NAME,
        }),
      ],
      providers: [
        DegreeCertificatesService,
        YearModuleService,
        FilesService,
        StudentsService,
        VariablesService,
        DegreeAttendanceService,
        GradesSheetService,
        CertificateStatusService,
        CertificateNumerationService,
        FileSystemService,
        DocxService,
        ExcelService,
        {
          provide: GcpService,
          useClass: MockGcpService,
        },
        {
          provide: DEGREE_CERTIFICATE.REPOSITORY,
          useClass: DegreeCertificateRepository,
        },
      ],
    }).compile()

    const dataSource = module.get<DataSource>(DataSource)
    await TypeOrmHelper.setup(DegreeCertificateAttendanceTestData, dataSource)
    service = module.get<DegreeCertificatesService>(DegreeCertificatesService)
  })

  afterAll(async () => {
    await module.close()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})

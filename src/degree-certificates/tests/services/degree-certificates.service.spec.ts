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
import { DegreeCertificateRepository } from '../../repositories/degree-certificate-repository'
import { DegreeCertificatesModule } from '../../modules/degree-certificates.module'

describe('DegreeAttendanceService tests', () => {
  let service: DegreeCertificatesService
  let module: TestingModule

  beforeAll(async () => {
    jest.useFakeTimers()

    module = await Test.createTestingModule({
      imports: [...getTestingTypeOrmModuleImports(), DegreeCertificatesModule],
      providers: [
        DegreeCertificatesService,
        DegreeCertificateRepository,
        {
          provide: YearModuleService,
          useValue: {},
        },
        {
          provide: FilesService,
          useValue: {},
        },
        {
          provide: StudentsService,
          useValue: {},
        },
        {
          provide: VariablesService,
          useValue: {},
        },
        {
          provide: DegreeAttendanceService,
          useValue: {},
        },
        {
          provide: GradesSheetService,
          useValue: {},
        },
        {
          provide: CertificateStatusService,
          useValue: {},
        },
        {
          provide: CertificateNumerationService,
          useValue: {},
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

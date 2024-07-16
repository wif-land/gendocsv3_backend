import { getTestingTypeOrmModuleImports } from '../../shared/utils/test.utils'
import { TypeOrmHelper } from '../../shared/utils/test/typeorm-helper'
import { DegreeAttendanceService } from '../degree-certificate-attendance.service'
import { Test, TestingModule } from '@nestjs/testing'
import { DegreeCertificateAttendanceTestData } from '../fixtures/data'
import { DataSource } from 'typeorm'

describe('DegreeAttendanceService tests', () => {
  let service: DegreeAttendanceService
  let module: TestingModule

  beforeAll(async () => {
    jest.useFakeTimers()

    module = await Test.createTestingModule({
      imports: [...getTestingTypeOrmModuleImports()],
      providers: [DegreeAttendanceService],
    }).compile()

    const dataSource = module.get<DataSource>(DataSource)
    await TypeOrmHelper.setup(DegreeCertificateAttendanceTestData, dataSource)
    service = module.get<DegreeAttendanceService>(DegreeAttendanceService)
  })

  afterAll(async () => {
    await module.close()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})

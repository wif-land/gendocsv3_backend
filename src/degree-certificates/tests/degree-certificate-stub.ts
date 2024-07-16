import { CareerEntity } from '../../careers/entites/careers.entity'
import { DegreeCertificateAttendanceEntity } from '../../degree-certificate-attendance/entities/degree-certificate-attendance.entity'
import { BaseStub } from '../../shared/utils/test/base-stub'
import { StudentEntity } from '../../students/entities/student.entity'
import { UserEntity } from '../../users/entities/users.entity'
import { SubmoduleYearModuleEntity } from '../../year-module/entities/submodule-year-module.entity'
import { CertificateStatusEntity } from '../entities/certificate-status.entity'
import { CertificateTypeEntity } from '../entities/certificate-type.entity'
import { DegreeCertificateEntity } from '../entities/degree-certificate.entity'
import { DegreeModalityEntity } from '../entities/degree-modality.entity'
import { RoomEntity } from '../entities/room.entity'

export class DegreeCertificateStub extends BaseStub {
  id: number
  auxNumber?: number
  number?: number
  topic: string
  presentationDate?: Date
  student: StudentEntity
  career: CareerEntity
  certificateType: CertificateTypeEntity
  certificateStatus?: CertificateStatusEntity
  degreeModality: DegreeModalityEntity
  room?: RoomEntity
  duration?: number
  link?: string
  submoduleYearModule: SubmoduleYearModuleEntity
  gradesSheetDriveId?: string
  certificateDriveId?: string
  deletedAt: Date
  isClosed: boolean
  user: UserEntity
  attendances: DegreeCertificateAttendanceEntity[]
  createdAt: Date
  updatedAt: Date

  constructor(props: Partial<DegreeCertificateEntity> = {}) {
    super()

    this.id = props.id || BaseStub.getRandomId()
    this.auxNumber = props.auxNumber || BaseStub.getRandomNumber()
    this.number = props.number || BaseStub.getRandomNumber()
    this.topic = props.topic || BaseStub.getRandomString()
    this.presentationDate = props.presentationDate || BaseStub.getRandomDate()
    this.student = props.student || new StudentEntity()
    this.career = props.career || new CareerEntity()
    this.certificateType = props.certificateType || new CertificateTypeEntity()
    this.certificateStatus =
      props.certificateStatus || new CertificateStatusEntity()
    this.degreeModality = props.degreeModality || new DegreeModalityEntity()
    this.room = props.room || new RoomEntity()
    this.duration = props.duration || BaseStub.getRandomNumber()
    this.link = props.link || BaseStub.getRandomString()
    this.submoduleYearModule =
      props.submoduleYearModule || new SubmoduleYearModuleEntity()
    this.gradesSheetDriveId =
      props.gradesSheetDriveId || BaseStub.getRandomString()
    this.certificateDriveId =
      props.certificateDriveId || BaseStub.getRandomString()
    this.attendances = props.attendances || []
  }
}

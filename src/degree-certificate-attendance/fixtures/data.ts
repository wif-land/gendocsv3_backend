import { DegreeCertificateEntity } from '../../degree-certificates/entities/degree-certificate.entity'
import { DegreeEntity } from '../../degrees/entities/degree.entity'
import { FunctionaryEntity } from '../../functionaries/entities/functionary.entity'
import { DegreeCertificateAttendanceEntity } from '../entities/degree-certificate-attendance.entity'

export const DegreeCertificateAttendanceTestData = {
  degreeEntity: {
    entity: DegreeEntity,
    data: [
      {
        id: 1,
        abbreviation: 'Ing. Sistemas',
        name: 'Ingeniería en Sistemas',
        maleTitle: 'Ingeniero',
        degreeLevel: '3',
        femaleTitle: 'Ingeniera',
      },
      {
        id: 2,
        abbreviation: 'Ing. Civil',
        name: 'Ingeniería Civil',
        maleTitle: 'Ingeniero',
        degreeLevel: '4',
        femaleTitle: 'Ingeniera',
      },
    ],
  },
  functionary: {
    entity: FunctionaryEntity,
    data: [
      {
        id: 1,
        firstName: 'John',
        firstLastName: 'Doe',
        outlookEmail: 'lenin@uta.edu.ec',
        phoneNumber: '0979424062',
        dni: '1234567890',
        thirdLevelDegree: {
          id: 1,
        },
        fourthLevelDegree: {
          id: 2,
        },
      },
      {
        id: 2,
        firstName: 'Jane',
        firstLastName: 'Doe',
        outlookEmail: 'janedoe@uta.edu.ec',
        phoneNumber: '0979424062',
        dni: '1234567888',
        thirdLevelDegree: {
          id: 1,
        },
        fourthLevelDegree: {
          id: 2,
        },
      },
    ],
  },
  degreeCertificate: {
    entity: DegreeCertificateEntity,
    data: [
      {
        id: 1,
        presentationDate: new Date(),
        duration: 60,
        topic: 'Some topic',
      },
      {
        id: 2,
        presentationDate: new Date(),
        duration: 60,
        topic: 'Some topic',
      },
    ],
  },
  degreeCertificateAttendance: {
    entity: DegreeCertificateAttendanceEntity,
    data: [
      {
        id: 1,
        degreeCertificate: {
          id: 1,
        },
        functionary: {
          id: 1,
        },
        role: 'PRESIDENTE',
        details: 'Some details',
        assignationDate: new Date(),
      },
      {
        id: 2,
        degreeCertificate: {
          id: 2,
        },
        functionary: {
          id: 2,
        },
        role: 'PRESIDENTE',
        details: 'Some details',
        assignationDate: new Date(),
      },
    ],
  },
}

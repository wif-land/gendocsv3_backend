import { DegreeCertificateEntity } from '../../degree-certificates/entities/degree-certificate.entity'
import { RolesType } from './roles'

const MUTATE_FIELDS_WRITTER = {
  [DegreeCertificateEntity.name]: [
    'roomId',
    'duration',
    'link',
    'certificateStatusId',
    'userId',
    'presentationDate',
  ],
}

export const SPANISH_FIELDS = {
  [DegreeCertificateEntity.name]: {
    topic: 'Tema',
    presentationDate: 'Fecha de presentación',
    studentId: 'Estudiante',
    certificateTypeId: 'Tipo de certificado',
    certificateStatusId: 'Estado de certificado',
    degreeModalityId: 'Modalidad de grado',
    roomId: 'Aula',
    duration: 'Duración',
    link: 'Enlace',
    isClosed: 'Acta cerrada?',
    userId: 'Usuario',
    changeUniversityResolution: 'Resolución de cambio de universidad',
    changeUniversityName: 'Nombre universidad anterior',
  },
}

export const PERMISSIONS: Permission = {
  [RolesType.ADMIN]: {
    [DegreeCertificateEntity.name]: {
      UPDATE: ['*'],
    },
  },
  [RolesType.WRITER]: {
    [DegreeCertificateEntity.name]: {
      UPDATE: MUTATE_FIELDS_WRITTER[DegreeCertificateEntity.name],
    },
  },
  [RolesType.READER]: {
    [DegreeCertificateEntity.name]: {
      UPDATE: [],
    },
  },
  [RolesType.TEMP_ADMIN]: {
    [DegreeCertificateEntity.name]: {
      UPDATE: ['*'],
    },
  },
  [RolesType.API]: {
    [DegreeCertificateEntity.name]: {
      UPDATE: ['*'],
    },
  },
}

export type Permission = {
  [role in RolesType]: {
    [modelName: string]: {
      UPDATE: string[]
    }
  }
}

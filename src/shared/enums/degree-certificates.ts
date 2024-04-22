import { ADJECTIVES } from './adjectives'
import { GENDER } from './genders'

export enum DEGREE_MODULES {
  MODULE_NAME = 'Comunes',
  MODULE_CODE = 'COMM',
  SUBMODULE_NAME = 'Actas de grado',
}

export enum DEGREE_ATTENDANCE_ROLES {
  PRINCIPAL = 'M_PRINCIPAL',
  SUBSTITUTE = 'M_SUPLENTE',
  PRESIDENT = 'PRESIDENTE',
  MENTOR = 'TUTOR',
}

export const GENDER_DESIGNATION = [
  { [GENDER.MALE]: 'el señor', [GENDER.FEMALE]: 'la señorita' },
  {
    [GENDER.MALE]: 'portador',
    [GENDER.FEMALE]: 'portadora',
  },
  {
    [GENDER.MALE]: 'El mencionado señor',
    [GENDER.FEMALE]: 'La mencionada señorita',
  },

  {
    [GENDER.MALE]: 'El mencionado',
    [GENDER.FEMALE]: 'La mencionada',
  },
]

export const GENDER_DESIGNATION_VARIABLE = (index: number) =>
  `{{DISNACION_GENERO}}_${index}`

export const MEMBERS_DESIGNATION = {
  [DEGREE_ATTENDANCE_ROLES.PRINCIPAL]: {
    [ADJECTIVES.PLURAL]: 'designados mediante',
    [ADJECTIVES.SINGULAR]: 'designado mediante',
  },
  [DEGREE_ATTENDANCE_ROLES.SUBSTITUTE]: {
    [ADJECTIVES.PLURAL]: 'principalizados mediante',
    [ADJECTIVES.SINGULAR]: 'principalizado mediante',
  },
}

export enum STUDENT_DEGREE_CERTIFICATE {
  CREDITS_TEXT = '{{CREDITOS_TEXTO}}',
  CREDITS_NUMBER = '{{CREDITOS_NUMEROS}}',
  INTERNSHIP_HOURS = '{{HORAS_PRACTICAS_NUMEROS}}',
  VINCULATION_HOURS = '{{HORAS_VINCULACION_NUMEROS}}',
  VINCULATION_HOURS_TEXT = '{{HORAS_VINCULACION_TEXTO}}',
  INTERNSHIP_HOURS_TEXT = '{{HORAS_PRACTICAS_TEXTO}}',
  DEGREE_CERTIFICATE_STATUS = '{{ACTAGRADO_ESTADO_UPPER}}',
}

export enum DEGREE_CERTIFICATE_VARIABLES {
  DEGREE_CERTIFICATE_PRESIDENT = '{{ACTAGRADO_PRESIDENTE}}',
  DEGREE_CERTIFICATE_PRESIDENT_DOC_ASSIGNED = '{{ACTAGRADO_PRESIDENTE_DOCu_ASIGNACION}}',
}

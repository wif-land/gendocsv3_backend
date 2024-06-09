export enum GENDER {
  MALE = 'Masculino',
  FEMALE = 'Femenino',
}

export enum CERT_STATUS_ENUM {
  MALE_APRO = 'APROBADO',
  FEMALE_APRO = 'APROBADA',
  MALE_REPRO = 'REPROBADO',
  FEMALE_REPRO = 'REPROBADA',
  NO_PRESENTED = 'NO PRESENTACION',
}

export enum CERT_STATUS_CODE {
  APRO = 'APRO',
  REPR = 'REPR',
  NO_PRESENTED = 'NO_RESENTACION',
}

export const getSTATUS_CODE_BY_CERT_STATUS = (
  status: CERT_STATUS_ENUM | string | undefined,
): CERT_STATUS_CODE => {
  if (status?.includes(CERT_STATUS_CODE.APRO)) {
    return CERT_STATUS_CODE.APRO
  } else if (status?.includes(CERT_STATUS_CODE.REPR)) {
    return CERT_STATUS_CODE.REPR
  } else {
    return CERT_STATUS_CODE.NO_PRESENTED
  }
}

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
  REPRO = 'REPRO',
  NO_PRESENTED = 'NO_PRESENTACION',
}

export const getSTATUS_CODE_BY_CERT_STATUS = (
  status: CERT_STATUS_ENUM | string | undefined,
): CERT_STATUS_CODE => {
  if (status?.includes(CERT_STATUS_CODE.APRO)) {
    return CERT_STATUS_CODE.APRO
  } else if (status?.includes(CERT_STATUS_CODE.REPRO)) {
    return CERT_STATUS_CODE.REPRO
  } else {
    return CERT_STATUS_CODE.NO_PRESENTED
  }
}

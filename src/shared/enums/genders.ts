export enum GENDER {
  MALE = 'Masculino',
  FEMALE = 'Femenino',
}

export const getEnumGender = (gender: string) => {
  if (
    gender.toUpperCase() === 'MASCULINO' ||
    gender.toUpperCase().includes('HOMBRE')
  ) {
    return GENDER.MALE
  } else if (
    gender.toUpperCase() === 'FEMENINO' ||
    gender.toUpperCase().includes('MUJER')
  ) {
    return GENDER.FEMALE
  } else if (
    gender.toUpperCase() === 'NO DEFINIDO' ||
    gender.toUpperCase() === 'NO REGISTRA'
  ) {
    return GENDER.MALE
  } else {
    // throw new Error(`Género "${gender}" no soportado`)
    return undefined
  }
}

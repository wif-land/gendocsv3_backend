export enum GENDER {
  MALE = 'Masculino',
  FEMALE = 'Femenino',
}

export const getEnumGender = (gender: string) => {
  if (gender === 'Masculino' || gender.toUpperCase().includes('HOMBRE')) {
    return GENDER.MALE
  } else if (gender === 'Femenino' || gender.toUpperCase().includes('MUJER')) {
    return GENDER.FEMALE
  } else {
    throw new Error('Género no válido')
  }
}

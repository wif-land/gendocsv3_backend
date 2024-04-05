import { FunctionaryEntity } from '../../functionaries/entities/functionary.entity'
import { StudentEntity } from '../../students/entities/student.entity'

export const toFirstUpperCase = (text: string): string =>
  text.charAt(0).toUpperCase() + text.slice(1)

export const getFullName = (
  entity: FunctionaryEntity | StudentEntity,
): string => {
  const { firstName, secondName, firstLastName, secondLastName } = entity
  return `${firstName} ${secondName ? secondName : ''} ${firstLastName} ${
    secondLastName ? secondLastName : ''
  }`
}

export const formatNumeration = (numeration: number): string =>
  // eslint-disable-next-line no-magic-numbers
  numeration.toString().padStart(4, '0')

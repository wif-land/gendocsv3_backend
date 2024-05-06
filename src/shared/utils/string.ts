import { FunctionaryEntity } from '../../functionaries/entities/functionary.entity'
import { StudentEntity } from '../../students/entities/student.entity'

export const toFirstUpperCase = (text: string): string =>
  text.charAt(0).toUpperCase() + text.slice(1)

export const getFullName = (
  entity: FunctionaryEntity | StudentEntity,
): string => {
  const entityNames = entity as FunctionaryEntity | StudentEntity
  const { firstName, secondName, firstLastName, secondLastName } = entityNames
  return `${toFirstUpperCase(firstName)} ${
    secondName ? toFirstUpperCase(secondName) : ''
  } ${toFirstUpperCase(firstLastName)} ${
    secondLastName ? toFirstUpperCase(secondLastName) : ''
  }`
}

export const capitalizeEachWord = (text: string): string =>
  text
    .split(' ')
    .map((word) => toFirstUpperCase(word))
    .join(' ')

// eslint-disable-next-line no-magic-numbers
export const formatNumeration = (numeration: number, length = 4): string =>
  // eslint-disable-next-line no-magic-numbers
  numeration.toString().padStart(length, '0')

export const concatNames = (names: string[]): string => {
  if (names.length === 1) return names[0]

  const last = names.pop()
  return names.join(', ') + getNamesSeparator(last) + last
}

export const getNamesSeparator = (endName: string): string =>
  endName.charAt(0).toLowerCase().match(/^[iy]/i) ? ' e ' : ' y '

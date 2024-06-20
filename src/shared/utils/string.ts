import { FunctionaryEntity } from '../../functionaries/entities/functionary.entity'
import { StudentEntity } from '../../students/entities/student.entity'

export const toFirstUpperCase = (text: string): string =>
  text.charAt(0).toUpperCase() + text.slice(1)

export const getFullName = (
  entity: FunctionaryEntity | StudentEntity,
): string => {
  const clonedObject = { ...entity }
  // const { firstName, secondName, firstLastName, secondLastName } = entity
  const firstName = clonedObject.firstName
  const secondName = clonedObject.secondName
  const firstLastName = clonedObject.firstLastName
  const secondLastName = clonedObject.secondLastName

  return `${toFirstUpperCase(firstName)} ${
    secondName ? toFirstUpperCase(secondName) : ''
  } ${toFirstUpperCase(firstLastName)} ${
    secondLastName ? toFirstUpperCase(secondLastName) : ''
  }`
}

export const getFullNameWithTitles = (
  functionary: FunctionaryEntity,
): string => {
  const object = { ...functionary }
  const { thirdLevelDegree, fourthLevelDegree } = object
  return `${
    thirdLevelDegree ? `${thirdLevelDegree.abbreviation}` : ''
  } ${getFullName(functionary)} ${
    fourthLevelDegree ? `${fourthLevelDegree.abbreviation}` : ''
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
  if (names.length === 0) return ''
  if (names.length === 1) return names[0]

  const last = names.pop()
  return names.join(', ') + getNamesSeparator(last) + last
}

export const getNamesSeparator = (endName: string): string =>
  endName.charAt(0).toLowerCase().match(/^[iy]/i) ? ' e ' : ' y '

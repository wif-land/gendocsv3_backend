export const transformNumberToWords = (number: number): string => {
  if (isNaN(Number(number))) {
    return 'NO_ES_UN_VALOR_NUMÉRICO'
  }

  const list = number.toString().split('.')

  let entera = 0
  let decimal = 0

  // eslint-disable-next-line no-magic-numbers
  if (list.length === 2) {
    entera = parseInt(list[0], 10)
    decimal = parseInt(list[1], 10)

    let text = ''

    if (decimal.toString()[0] === '0' && decimal.toString()[1] !== '0') {
      text = 'punto cero'
    } else if (decimal.toString()[0] === '0' && decimal.toString()[1] === '0') {
      text = 'punto'
    } else {
      text = 'punto'
    }

    return `${numeroALetras(entera)} ${text} ${numeroALetras(decimal)}`
  } else if (list.length === 1) {
    entera = parseInt(list[0], 10)
  }
  return numeroALetras(entera)
}

// Código basado en https://gist.github.com/alfchee/e563340276f89b22042a

export const numeroALetras = (num: number) => {
  const data = {
    numero: num,
    enteros: Math.floor(num),
    // eslint-disable-next-line no-magic-numbers
    decimales: Math.round(num * 100) - Math.floor(num) * 100,
    letrasDecimales: '',
  }

  if (data.decimales > 0) {
    data.letrasDecimales = ` PUNTO ${Millones(data.decimales)}`
  }
  // eslint-disable-next-line no-magic-numbers
  if (data.enteros === 0) return `CERO${data.letrasDecimales}`
  if (data.enteros === 1) return Millones(data.enteros) + data.letrasDecimales
  else return Millones(data.enteros) + data.letrasDecimales
}

const Unidades = (num: number) => {
  const aLetras = {
    1: 'UNO',
    2: 'DOS',
    3: 'TRES',
    4: 'CUATRO',
    5: 'CINCO',
    6: 'SEIS',
    7: 'SIETE',
    8: 'OCHO',
    9: 'NUEVE',
  }

  return aLetras[num] || ''
} // Unidades()

const Decenas = (num: number) => {
  // eslint-disable-next-line no-magic-numbers
  const decena = Math.floor(num / 10)
  // eslint-disable-next-line no-magic-numbers
  const unidad = num - decena * 10

  const aLetras = {
    1: (() => {
      const aLetra = {
        0: 'DIEZ',
        1: 'ONCE',
        2: 'DOCE',
        3: 'TRECE',
        4: 'CATORCE',
        5: 'QUINCE',
      }
      return aLetra[unidad] || `DIECI${Unidades(unidad)}`
    })(),
    2: unidad === 0 ? 'VEINTE' : `VEINTI${Unidades(unidad)}`,
    3: DecenasY('TREINTA', unidad),
    4: DecenasY('CUARENTA', unidad),
    5: DecenasY('CINCUENTA', unidad),
    6: DecenasY('SESENTA', unidad),
    7: DecenasY('SETENTA', unidad),
    8: DecenasY('OCHENTA', unidad),
    9: DecenasY('NOVENTA', unidad),
    0: Unidades(unidad),
  }

  return aLetras[decena] || ''
} // Decenas()

const DecenasY = (strSin: string, numUnidades: number) => {
  if (numUnidades > 0) return `${strSin} Y ${Unidades(numUnidades)}`
  return strSin
} // DecenasY()

const Centenas = (num: number) => {
  // eslint-disable-next-line no-magic-numbers
  const centenas = Math.floor(num / 100)
  // eslint-disable-next-line no-magic-numbers
  const decenas = num - centenas * 100

  const aLetras = {
    1: decenas > 0 ? `CIENTO ${Decenas(decenas)}` : 'CIEN',
    2: `DOSCIENTOS ${Decenas(decenas)}`,
    3: `TRESCIENTOS ${Decenas(decenas)}`,
    4: `CUATROCIENTOS ${Decenas(decenas)}`,
    5: `QUINIENTOS ${Decenas(decenas)}`,
    6: `SEISCIENTOS ${Decenas(decenas)}`,
    7: `SETECIENTOS ${Decenas(decenas)}`,
    8: `OCHOCIENTOS ${Decenas(decenas)}`,
    9: `NOVECIENTOS ${Decenas(decenas)}`,
  }

  return aLetras[centenas] || Decenas(decenas)
} // Centenas()

const Seccion = (
  num: number,
  divisor: number,
  strSingular: string,
  strPlural: string,
) => {
  const cientos = Math.floor(num / divisor)
  const resto = num - cientos * divisor

  let letras = ''

  if (cientos > 0) {
    if (cientos > 1) letras = `${Centenas(cientos)} ${strPlural}`
    else letras = strSingular
  }

  if (resto > 0) letras += ''

  return letras
} // Seccion()

const Miles = (num: number) => {
  const divisor = 1000
  const cientos = Math.floor(num / divisor)
  const resto = num - cientos * divisor

  const strMiles = Seccion(num, divisor, 'UN MIL', 'MIL')
  const strCentenas = Centenas(resto)

  if (strMiles === '') return strCentenas
  return `${strMiles} ${strCentenas}`
} // Miles()

const Millones = (num: number) => {
  const divisor = 1000000
  const cientos = Math.floor(num / divisor)
  const resto = num - cientos * divisor

  const strMillones = Seccion(num, divisor, 'UN MILLON DE', 'MILLONES DE')
  const strMiles = Miles(resto)

  if (strMillones === '') return strMiles
  return `${strMillones} ${strMiles}`
} // Millones()

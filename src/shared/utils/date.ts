import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { transformNumberToWords } from './number'

export const TIMES = {
  AN_HOUR: 60 * 60 * 1000,
  A_DAY: 24 * 60 * 60 * 1000,
  A_WEEK: 7 * 24 * 60 * 60 * 1000,
}

export const formatDate = (date: Date): string =>
  format(date, 'dd/mm/yyyy', { locale: es })

export const formatDateText = (
  date: Date | string,
  formatStr = "d 'de' MMMM 'de' yyyy",
): string => {
  const dateObj = new Date(date)
  return format(dateObj, formatStr, { locale: es })
}

export const formatWeekDayName = (date: Date): string =>
  format(date, 'EEEE', { locale: es })

export const formatMonthName = (date: Date): string =>
  format(date, 'MMMM', { locale: es })

export const formatHourMinutesText = (date: Date): string => {
  if (!date) return ''

  const hours = date.getHours()
  const minutes = date.getMinutes()

  return `${transformNumberToWords(hours)} ${
    hours === 1 ? 'hora' : 'horas'
  } y ${transformNumberToWords(minutes)} ${
    minutes === 1 ? 'minuto' : 'minutos'
  }`
}

import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export const formatDate = (date: Date): string =>
  format(date, 'dd/mm/yyyy', { locale: es })

export const formatDateText = (
  date: Date | string,
  formatStr = "d 'de' MMMM 'de' yyyy",
): string => {
  const dateObj = new Date(date)
  return format(dateObj, formatStr, { locale: es })
}

import { format, isSameYear, isToday, isYesterday } from 'date-fns'
import { Range } from '../../../../redux/ducks/interactions'
import { es } from 'date-fns/locale'

export const formatRange = ({ start, end }: Range): string => {
  let formattedDate = format(start, "iiii d 'de' MMMM", {
    locale: es,
  })
  if (isToday(start)) {
    formattedDate = 'hoy, ' + formattedDate
  }
  if (isYesterday(start)) {
    formattedDate = 'ayer, ' + formattedDate
  }
  if (!isSameYear(new Date(), start)) {
    formattedDate = formattedDate + format(start, " 'de' yyyy")
  }
  return formattedDate
}

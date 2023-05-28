import classNames from 'classnames'
import { format, isToday, isYesterday } from 'date-fns'
import { es } from 'date-fns/locale'
import { SmartphoneChatsDate } from '../Smartphone'
import './SmartphoneMessagesDate.css'
import { Icon } from '@iconify/react'

const SmartphoneMessagesDate = ({ data }: { data: SmartphoneChatsDate }) => (
  <div
    className={classNames({
      SmartphoneMessagesDate: true,
      'SmartphoneMessagesDate--current': data.current,
    })}
  >
    <Icon icon="mdi:calendar" /> {formatDate(data.date)}
  </div>
)

const formatDate = (date: Date) => {
  let formattedDate = format(date, "iiii d MMMM 'de' yyyy", {
    locale: es,
  })

  if (isToday(date)) {
    formattedDate = 'hoy, ' + formattedDate
  } else if (isYesterday(date)) {
    formattedDate = 'ayer, ' + formattedDate
  }
  return formattedDate
}

export default SmartphoneMessagesDate

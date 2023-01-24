import classNames from 'classnames'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { SmartphoneChatsDate } from '../Smartphone'
import './SmartphoneMessagesDate.css'

const SmartphoneMessagesDate = ({ data }: { data: SmartphoneChatsDate }) => {
  const formattedDate = format(data.date, 'iiii d MMMM yyyy', {
    locale: es,
  })

  return (
    <div
      className={classNames({
        SmartphoneMessagesDate: true,
        'SmartphoneMessagesDate--current': data.current,
      })}
    >
      📅 {formattedDate}
    </div>
  )
}

export default SmartphoneMessagesDate

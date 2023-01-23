import classNames from 'classnames'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { SmartphoneChatsDate } from '../Smartphone'
import './SmartphoneMessagesDate.css'

const SmartphoneMessagesDate = ({ data }: { data: SmartphoneChatsDate }) => {
  return (
    <div
      className={classNames({
        SmartphoneMessagesDate: true,
        'SmartphoneMessagesDate--current': data.current,
      })}
    >
      📅{' '}
      {format(data.date, 'iiii d MMMM yyyy', {
        locale: es,
      })}
    </div>
  )
}

export default SmartphoneMessagesDate

import { Icon } from '@iconify/react'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import './SmartphoneNavBar.css'

const SmartphoneNavBar = ({
  pollId,
  userId,
}: {
  pollId?: Number
  userId?: Number
}) => {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 5_000)
    return () => clearInterval(interval)
  }, [])
  return (
    <div className="SmartphoneNavBar">
      <div className="SmartphoneNavBar__time">{format(time, 'H:mm')}</div>
      <div className="SmartphoneNavBar__camera">
        {pollId ? (
          <>
            {pollId} / {userId}
          </>
        ) : (
          <>&nbsp;</>
        )}
      </div>
      <div className="SmartphoneNavBar__icons">
        <Icon icon="mdi:wifi" />
        <Icon icon="mdi:signal" />
        <Icon icon="mdi:battery" />
      </div>
    </div>
  )
}

export default SmartphoneNavBar

import { Icon } from '@iconify/react'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import './SmartphoneStatusBar.css'

const SmartphoneStatusBar = ({
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

  const pollUserTitle = pollId ? `${pollId} / ${userId}` : ''
  const formattedCurrentTime = format(time, 'H:mm')

  return (
    <div className="SmartphoneStatusBar">
      <div className="SmartphoneStatusBar__time">{formattedCurrentTime}</div>
      <div className="SmartphoneStatusBar__camera">{pollUserTitle}</div>
      <div className="SmartphoneStatusBar__icons">
        <Icon icon="mdi:wifi" />
        <Icon icon="mdi:signal" />
        <Icon icon="mdi:battery" />
      </div>
    </div>
  )
}

export default SmartphoneStatusBar

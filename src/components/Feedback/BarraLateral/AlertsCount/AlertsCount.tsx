import { useEffect } from 'react'
import useActiveAlertsQuery from '../../../../api/hooks/useActiveAlertsQuery'
import './AlertsCount.css'

const AlertsCount = () => {
  const { data } = useActiveAlertsQuery()

  const count = data?.pending.length

  useEffect(() => {
    document.title = count ? `(${count}) Feedback` : 'Feedback'
  }, [count])

  if (!count) {
    return null
  }

  return <div className="AlertsCount">{count}</div>
}

export default AlertsCount

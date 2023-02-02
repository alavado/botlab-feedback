import { Icon } from '@iconify/react'
import { format } from 'date-fns'
import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import useActiveAlertsQuery from '../../../../api/hooks/useActiveAlertsQuery'
import Loader from '../../../Loader'
import './AlertsList.css'

const AlertsList = () => {
  const [showSolved, setShowSolved] = useState(false)
  const { data, isLoading } = useActiveAlertsQuery({ solved: showSolved })
  const history = useHistory()

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className="AlertsList">
      <div className="AlertsList__tabs">
        <button
          className="AlertsList__tab_button"
          onClick={() => setShowSolved(false)}
        >
          <Icon icon="mdi:bell" /> No resueltas
        </button>
        <button
          className="AlertsList__tab_button"
          onClick={() => setShowSolved(true)}
        >
          <Icon icon="mdi:bell-check" /> Resueltas
        </button>
      </div>
      {data.map((alert) => (
        <div
          className="AlertsList__alert"
          onClick={() =>
            history.push(`/alertas/${alert.serviceId}/${alert.patientId}`)
          }
        >
          <Icon icon="mdi:bell" />
          {format(alert.timestamp, 'HH:mm dd/MM')}
          {alert.typeId}
        </div>
      ))}
    </div>
  )
}

export default AlertsList

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
      <button onClick={() => setShowSolved(false)}>No resueltas</button>
      <button onClick={() => setShowSolved(true)}>Resueltas</button>
      {data.map((alert) => (
        <div
          onClick={() =>
            history.push(`/alertas/${alert.serviceId}/${alert.patientId}`)
          }
        >
          {alert.typeId}
        </div>
      ))}
    </div>
  )
}

export default AlertsList

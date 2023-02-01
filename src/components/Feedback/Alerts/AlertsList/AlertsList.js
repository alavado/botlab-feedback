import { useHistory } from 'react-router-dom'
import useAlertsQuery from '../../../../api/hooks/useAlertsQuery'
import './AlertsList.css'

const AlertsList = () => {
  const { data } = useAlertsQuery()

  const history = useHistory()

  return (
    <div className="AlertsList">
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

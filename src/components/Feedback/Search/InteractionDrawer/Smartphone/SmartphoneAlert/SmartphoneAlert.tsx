import { format } from 'date-fns'
import useChangeAlertMutation from '../../../../../../api/hooks/useChangeAlertStatusMutation'
import './SmartphoneAlert.css'

const SmartphoneAlert = ({
  label,
  alertId,
  alertTimestamp,
  solved,
}: {
  label: string
  alertId: number
  alertTimestamp: Date
  solved: boolean
}) => {
  const mutation = useChangeAlertMutation({ alertId, solved: !solved })

  return (
    <div className="SmartphoneAlert">
      <p>{format(alertTimestamp, 'hh:mm dd/MM')}</p>
      <p>{label}</p>
      <p>{solved ? 'Alerta resuelta ok' : 'Alerta sin resolver'}</p>
      <button onClick={() => mutation.mutate({})}>
        {solved ? 'Marcar como no resuelta' : 'Marcar como resuelta'}
      </button>
    </div>
  )
}

export default SmartphoneAlert

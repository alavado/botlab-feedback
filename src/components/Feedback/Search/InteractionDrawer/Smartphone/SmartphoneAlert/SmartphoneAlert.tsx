import useChangeAlertMutation from '../../../../../../api/hooks/useChangeAlertMutation'
import './SmartphoneAlert.css'

const SmartphoneAlert = ({
  label,
  alertId,
  solved,
}: {
  label: string
  alertId: number
  solved: boolean
}) => {
  const mutation = useChangeAlertMutation({ alertId, solved: !solved })

  return (
    <div className="SmartphoneAlert">
      <p>{label}</p>
      <p>{solved ? 'Alerta resuelta ok' : 'Alerta sin resolver'}</p>
      <button onClick={() => mutation.mutate({})}>
        {solved ? 'Marcar como no resuelta' : 'Marcar como resuelta'}
      </button>
    </div>
  )
}

export default SmartphoneAlert

import { Icon } from '@iconify/react'
import classNames from 'classnames'
import { useSelector } from 'react-redux'
import { useHistory, useRouteMatch } from 'react-router-dom'
import useBranchesQuery from '../../../../../api/hooks/useBranchesQuery'
import useChangeAlertStatusMutation from '../../../../../api/hooks/useChangeAlertStatusMutation'
import { Alert } from '../../../../../api/types/servicio'
import { showAlertDismissedBy } from '../../../../../helpers/permisos'
import useAnalytics from '../../../../../hooks/useAnalytics'
import { RootState } from '../../../../../redux/ducks'
import './AlertElement.css'

const AlertElement = ({
  alert,
  highlighted,
}: {
  alert: Alert
  highlighted: boolean
}) => {
  const mutation = useChangeAlertStatusMutation({
    alertId: alert.id,
    solved: !alert.solved,
  })
  const history = useHistory()
  const { data: branches } = useBranchesQuery()
  const { params }: any = useRouteMatch()
  const track = useAnalytics()
  const { cuenta } = useSelector((state: RootState) => state.login)

  const changeAlertState = () => {
    track(
      'Feedback',
      'Alerts',
      alert.solved ? 'markAlertAsPending' : 'markAlertAsSolved',
      { alert }
    )
    mutation.mutate({})
  }

  return (
    <button
      className={classNames({
        AlertElement: true,
        'AlertElement--pending': !alert.solved,
        'AlertElement--solved': alert.solved,
        'AlertElement--selected': highlighted,
      })}
      onClick={() => {
        if (
          (params && Number(params?.patientId)) !== alert.patientId ||
          (params && Number(params?.serviceId)) !== alert.serviceId
        ) {
          history.push(`/alertas/${alert.serviceId}/${alert.patientId}`)
          track('Feedback', 'Alerts', 'alertElementClick', {
            alert,
          })
        }
      }}
      key={alert.id}
    >
      <span className="AlertElement__icon_container">
        <Icon
          className="AlertElement_icon"
          icon={alert.solved ? 'mdi:bell-check' : 'mdi:bell-ring'}
        />
        {alert.solved && showAlertDismissedBy(cuenta) && (
          <span className="AlertElement__solvedBy">{alert.solvedBy}</span>
        )}
      </span>
      <span className="AlertElement__time">{alert.formattedTimestamp}</span>
      <span className="AlertElement__name">{alert.typeName}</span>
      <span className="AlertElement__data">
        {alert.patientName} • {alert.serviceName}{' '}
        {branches && branches.length > 1 && <>• {alert.branchName}</>}
      </span>
      {highlighted && (
        <button
          className="AlertElement__solve_alert_button"
          style={{
            right: document
              .querySelector('.InteractionDrawer')
              ?.getBoundingClientRect().width,
          }}
          onClick={(e) => {
            e.stopPropagation()
            changeAlertState()
          }}
        >
          <Icon icon={alert.solved ? 'mdi:undo' : 'mdi:check'} /> Marcar{' '}
          {alert.solved ? 'pendiente' : 'resuelta'}
        </button>
      )}
    </button>
  )
}

export default AlertElement

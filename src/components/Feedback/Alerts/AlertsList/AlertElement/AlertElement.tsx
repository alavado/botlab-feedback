import { Icon } from '@iconify/react'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory, useRouteMatch } from 'react-router-dom'
import useBranchesQuery from '../../../../../api/hooks/useBranchesQuery'
import useChangeAlertStatusMutation from '../../../../../api/hooks/useChangeAlertStatusMutation'
import { Alert } from '../../../../../api/types/servicio'
import { showAlertDismissedBy } from '../../../../../helpers/permisos'
import useAnalytics from '../../../../../hooks/useAnalytics'
import { RootState } from '../../../../../redux/ducks'
import {
  getAlertButtonIcon,
  getAlertButtonLabel,
  getAlertButtonTitle,
} from '../../helpers'
import './AlertElement.css'

const AlertElement = ({
  alert,
  highlighted,
}: {
  alert: Alert
  highlighted: boolean
}) => {
  const getDrawerRight = () =>
    document.querySelector('.InteractionDrawer')?.getBoundingClientRect()
      .width || 0

  const mutation = useChangeAlertStatusMutation({
    alertId: alert.id,
    solved: !alert.solved,
  })
  const [buttonRightPosition, setButtonRightPosition] = useState(
    getDrawerRight()
  )
  const history = useHistory()
  const { data: branches } = useBranchesQuery()
  const { params }: any = useRouteMatch()
  const { cuenta } = useSelector((state: RootState) => state.login)
  const track = useAnalytics()

  const changeAlertState = () => {
    track(
      'Feedback',
      'Alerts',
      alert.solved ? 'markAlertAsPending' : 'markAlertAsSolved',
      { alert }
    )
    mutation.mutate({})
  }

  const openAlertChat = () => {
    if (
      (params && Number(params?.patientId)) !== alert.patientId ||
      (params && Number(params?.serviceId)) !== alert.serviceId
    ) {
      history.push(`/alertas/${alert.serviceId}/${alert.patientId}`)
      track('Feedback', 'Alerts', 'alertElementClick', {
        alert,
      })
    }
  }

  useEffect(() => {
    const updateButtonPositionInterval = setInterval(
      () => setButtonRightPosition(getDrawerRight()),
      50
    )
    return () => clearInterval(updateButtonPositionInterval)
  }, [])

  const { patientName, serviceName, branchName } = alert
  const alertData =
    `${patientName} • ${serviceName}` +
    (branches && branches.length > 1 ? ` • ${branchName}` : '')

  return (
    <button
      className={classNames({
        AlertElement: true,
        'AlertElement--pending': !alert.solved,
        'AlertElement--solved': alert.solved,
        'AlertElement--selected': highlighted,
      })}
      onClick={openAlertChat}
      key={alert.id}
    >
      <span className="AlertElement__icon_container">
        <Icon
          className="AlertElement__icon"
          icon={alert.solved ? 'mdi:bell-check' : 'mdi:bell-ring'}
        />
        {showAlertDismissedBy(cuenta) && alert.solved && (
          <span className="AlertElement__solvedBy">{alert.solvedBy}</span>
        )}
      </span>
      <span className="AlertElement__time">{alert.formattedTimestamp}</span>
      <span className="AlertElement__name">{alert.typeName}</span>
      <span className="AlertElement__data">{alertData}</span>
      {highlighted && (
        <button
          className="AlertElement__solve_alert_button"
          style={{
            right: buttonRightPosition,
          }}
          onClick={(e) => {
            e.stopPropagation()
            changeAlertState()
          }}
          title={getAlertButtonTitle(alert.solved)}
        >
          <Icon icon={getAlertButtonIcon(alert.solved)} />{' '}
          {getAlertButtonLabel(alert.solved)}
        </button>
      )}
    </button>
  )
}

export default AlertElement

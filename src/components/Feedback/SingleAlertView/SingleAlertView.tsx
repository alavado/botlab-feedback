import { useRouteMatch } from 'react-router-dom'
import './SingleAlertView.css'
import useSingleAlertQuery from '../../../api/hooks/useSingleAlertQuery'
import { useMemo } from 'react'
import _ from 'lodash'
import classNames from 'classnames'

interface SingleAlertRouteParams {
  serviceId: string
  patientId: string
  alertId: string
}

const SingleAlertView = () => {
  const {
    params: { serviceId, patientId, alertId },
  }: { params: SingleAlertRouteParams } = useRouteMatch()
  const { data } = useSingleAlertQuery(serviceId, patientId, alertId)

  console.log({ data })

  const { messagesBeforeAlert, messagesAfterAlert } = useMemo(() => {
    if (!data) {
      return { messagesBeforeAlert: [], messagesAfterAlert: [] }
    }
    const messages = _.flatten(
      data.chatData.data.conversations.map((c: any) => c.messages)
    )
    const messagesBeforeAlert = messages.filter(
      (m: any) => m.timestamp < data.alertData.data.utc_timestamp
    )
    const messagesAfterAlert = messages.filter(
      (m: any) => m.timestamp > data.alertData.data.utc_timestamp
    )
    return { messagesBeforeAlert, messagesAfterAlert }
  }, [data])

  return (
    <div className="SingleAlertView">
      <div className="SingleAlertView__messages_container">
        {messagesBeforeAlert.map((m: any) => (
          <p
            className={classNames({
              SingleAlertView__message: true,
              'SingleAlertView__message--bot': m.type === 'bot',
              'SingleAlertView__message--user': m.type === 'user',
            })}
          >
            {m.message}
          </p>
        ))}
        <p className="SingleAlertView__alert">
          Alerta: {data.alertData.data.message}
        </p>
        {messagesAfterAlert.map((m: any) => (
          <p
            className={classNames({
              SingleAlertView__message: true,
              'SingleAlertView__message--bot': m.type === 'bot',
              'SingleAlertView__message--user': m.type === 'user',
            })}
          >
            {m.message}
          </p>
        ))}
      </div>
    </div>
  )
}

export default SingleAlertView

import _ from 'lodash'
import { Icon } from '@iconify/react'
import useInteractionDataQuery from '../../../../api/hooks/useInteractionDataQuery'
import { PatientId, ServiceId } from '../../../../api/types/types'
import useAnalytics from '../../../../hooks/useAnalytics'
import Loader from '../../../Loader'
import './InteractionData.css'

const InteractionData = ({
  serviceId,
  patientId,
  interactionStart,
  originComponentName,
}: {
  serviceId: ServiceId
  patientId: PatientId
  interactionStart: Date
  originComponentName: string
}) => {
  const { data } = useInteractionDataQuery({
    serviceId,
    patientId,
    interactionStart,
  })
  const track = useAnalytics()

  return (
    <div className="InteractionData">
      <h3 className="InteractionData__title">
        <Icon icon="mdi:format-list-bulleted" />
        Datos de la cita
      </h3>
      {data ? (
        data.map((d, i) => (
          <div
            className="InteractionData__data_container"
            key={`interaction-data-${i}`}
          >
            <h4 className="InteractionData__data_label">{d.header}</h4>
            <p
              className="InteractionData__data_value"
              title={`Copiar "${d.value}"`}
              onClick={() => {
                track('Feedback', originComponentName, 'copy', {
                  property: d.header,
                  value: d.value,
                })
                navigator.clipboard.writeText(d.value + '')
              }}
            >
              {_.isString(d.value) || _.isNumber(d.value)
                ? d.value
                : d.value.tag}
            </p>
          </div>
        ))
      ) : (
        <Loader />
      )}
    </div>
  )
}

export default InteractionData

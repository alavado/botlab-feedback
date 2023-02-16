import { Icon } from '@iconify/react'
import useInteractionDataQuery from '../../../../api/hooks/useInteractionDataQuery'
import { PatientId, ServiceId } from '../../../../api/types/types'
import './InteractionData.css'

const InteractionData = ({
  serviceId,
  patientId,
  interactionStart,
}: {
  serviceId: ServiceId
  patientId: PatientId
  interactionStart: Date
}) => {
  const { data } = useInteractionDataQuery({
    serviceId,
    patientId,
    interactionStart,
  })

  return (
    <div className="InteractionData">
      <h3 className="InteractionData__title">
        <Icon icon="mdi:format-list-bulleted" />
        Datos de la cita
      </h3>
      {data?.map((d) => (
        <div className="InteractionData__data_container">
          <h4 className="InteractionData__data_label">{d.label}</h4>
          <p className="InteractionData__data_value">{d.value}</p>
        </div>
      ))}
    </div>
  )
}

export default InteractionData

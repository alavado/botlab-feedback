import useCommentsQuery from '../../../../api/hooks/useCommentsQuery'
import { PatientId, ServiceId } from '../../../../api/types/types'
import './InteractionComments.css'

const InteractionComments = ({
  serviceId,
  patientId,
  interactionStart,
}: {
  serviceId: ServiceId
  patientId: PatientId
  interactionStart: Date
}) => {
  const { data } = useCommentsQuery({ serviceId, patientId, interactionStart })

  console.log(data)

  return <div className="InteractionComments">InteractionComments</div>
}

export default InteractionComments

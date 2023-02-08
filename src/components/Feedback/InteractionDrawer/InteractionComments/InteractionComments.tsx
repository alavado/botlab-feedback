import { format } from 'date-fns'
import useCommentsQuery from '../../../../api/hooks/useCommentsQuery'
import { PatientId, ServiceId } from '../../../../api/types/types'
import Loader from '../../../Loader'
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
  const { data: comments, isLoading } = useCommentsQuery({
    serviceId,
    patientId,
    interactionStart,
  })

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className="InteractionComments">
      <h3>Comentarios</h3>
      {comments?.map((comment) => (
        <div>
          {format(comment.timestamp, 'HH:mm')} {comment.emoji} {comment.text}
        </div>
      ))}
      <button>Agregar comentario</button>
    </div>
  )
}

export default InteractionComments

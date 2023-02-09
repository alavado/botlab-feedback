import { Icon } from '@iconify/react'
import { format, isToday, isYesterday } from 'date-fns'
import { es } from 'date-fns/locale'
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

  return (
    <div className="InteractionComments">
      <h3 className="InteractionComments__title">
        <Icon icon="mdi:comment-text-outline" />
        Comentarios
      </h3>
      <div className="InteractionComments__comments_container">
        {isLoading ? (
          <Loader />
        ) : (
          comments?.map((comment) => (
            <div className="InteractionComments__comment">
              <div className="InteractionComments__comment_icon">
                {comment.emoji}
              </div>
              <div className="InteractionComments__comment_time">
                {format(comment.timestamp, 'HH:mm')}
                {!isToday(comment.timestamp) && (
                  <div className="InteractionComments__comment_day">
                    {isYesterday(comment.timestamp)
                      ? 'ayer'
                      : format(comment.timestamp, 'd MMM', { locale: es })}
                  </div>
                )}
              </div>
              <div className="InteractionComments__comment_content">
                {comment.text}
              </div>
            </div>
          ))
        )}
      </div>
      <button className="InteractionComments__add_comment_button">
        <Icon icon="mdi:comment-plus" />
        Agregar comentario
      </button>
    </div>
  )
}

export default InteractionComments

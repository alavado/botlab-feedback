import { Icon } from '@iconify/react'
import { format, isToday, isYesterday } from 'date-fns'
import { es } from 'date-fns/locale'
import { useState } from 'react'
import useCommentsQuery from '../../../../api/hooks/useCommentsQuery'
import { PatientId, ServiceId } from '../../../../api/types/types'
import Loader from '../../../Loader'
import InteractionCommentIcon from './InteractionCommentIcon'
import { Emoji } from './InteractionCommentIcon/emojis'
import './InteractionComments.css'
import NewCommentPopup from './NewCommentPopup'

const InteractionComments = ({
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
  const [isNewCommentModalOpen, setIsNewCommentModalOpen] = useState(false)
  const { data: comments, isLoading } = useCommentsQuery({
    serviceId,
    patientId,
    interactionStart,
  })

  return (
    <div className="InteractionComments">
      <h3 className="InteractionComments__title">
        <Icon icon="mdi:note-text-outline" />
        Notas
      </h3>
      <div className="InteractionComments__comments_container">
        {isLoading ? (
          <Loader />
        ) : comments?.length === 0 ? (
          <p className="InteractionComments__no_comments">No hay notas</p>
        ) : (
          comments?.map((comment) => (
            <div className="InteractionComments__comment">
              <div className="InteractionComments__comment_icon">
                <InteractionCommentIcon emoji={comment.emoji as Emoji} />
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
      {!isNewCommentModalOpen && (
        <button
          className="InteractionComments__add_comment_button"
          onClick={() => setIsNewCommentModalOpen(true)}
        >
          <Icon icon="mdi:note-plus-outline" />
          Agregar nota
        </button>
      )}
      <NewCommentPopup
        interactionStart={interactionStart}
        serviceId={serviceId}
        patientId={patientId}
        isOpen={isNewCommentModalOpen}
        close={() => setIsNewCommentModalOpen(false)}
        originComponentName={originComponentName}
      />
    </div>
  )
}

export default InteractionComments

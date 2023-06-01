import { Icon } from '@iconify/react'
import { useState } from 'react'
import useCommentsQuery from '../../../../api/hooks/useCommentsQuery'
import { PatientId, ServiceId } from '../../../../api/types/domain'
import Loader from '../../../Loader'
import InteractionComment from './InteractionComment/InteractionComment'
import NewCommentPopup from './NewCommentPopup'
import './InteractionComments.css'
import { Emoji } from './InteractionComment/InteractionCommentIcon/emojis'
import useIsLabeler from '../../../../hooks/useIsLabeler'

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
  const isLabeler = useIsLabeler()

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
          comments?.map((comment, i) => (
            <InteractionComment
              serviceId={serviceId}
              patientId={patientId}
              id={comment.id}
              timestamp={comment.timestamp}
              emoji={comment.emoji as Emoji}
              text={comment.text}
              key={`comment-${i}`}
              originComponentName={originComponentName}
            />
          ))
        )}
      </div>
      {!isLabeler && (
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

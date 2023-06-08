import { Icon } from '@iconify/react'
import { useState } from 'react'
import useCommentsQuery from '../../../../api/hooks/useCommentsQuery'
import { InteractionId } from '../../../../api/types/domain'
import Loader from '../../../Loader'
import InteractionComment from './InteractionComment/InteractionComment'
import NewCommentPopup from './NewCommentPopup'
import './InteractionComments.css'
import { Emoji } from './InteractionComment/InteractionCommentIcon/emojis'
import useIsLabeler from '../../../../hooks/useIsLabeler'

const InteractionComments = ({
  interactionId,
  originComponentName,
}: {
  interactionId?: InteractionId
  originComponentName: string
}) => {
  const [isNewCommentModalOpen, setIsNewCommentModalOpen] = useState(false)
  const { data: comments, isLoading } = useCommentsQuery({ interactionId })
  const isLabeler = useIsLabeler()

  return (
    <div className="InteractionComments">
      <h3 className="InteractionComments__title">
        <Icon icon="mdi:note-text-outline" />
        Notas
      </h3>
      <div className="InteractionComments__comments_container">
        {isLoading || !interactionId ? (
          <Loader />
        ) : comments?.length === 0 ? (
          <p className="InteractionComments__no_comments">No hay notas</p>
        ) : (
          comments?.map((comment, i) => (
            <InteractionComment
              patientId={interactionId.patientId}
              serviceId={interactionId.serviceId}
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
      {interactionId && (
        <NewCommentPopup
          interactionId={interactionId}
          isOpen={isNewCommentModalOpen}
          close={() => setIsNewCommentModalOpen(false)}
          originComponentName={originComponentName}
        />
      )}
    </div>
  )
}

export default InteractionComments

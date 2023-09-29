import { Icon } from '@iconify/react'
import { format, isToday, isYesterday } from 'date-fns'
import { es } from 'date-fns/locale'
import useDeleteCommentMutation from '../../../../../api/hooks/useDeleteCommentMutation'
import {
  CommentId,
  PatientId,
  ServiceId,
} from '../../../../../api/types/domain'
import useAnalytics from '../../../../../hooks/useAnalytics'
import './InteractionComment.css'
import InteractionCommentIcon from './InteractionCommentIcon'
import { Emoji } from './InteractionCommentIcon/emojis'

const InteractionComment = ({
  serviceId,
  patientId,
  id,
  timestamp,
  emoji,
  text,
  originComponentName,
}: {
  serviceId: ServiceId
  patientId: PatientId
  id: CommentId
  timestamp: Date
  emoji: Emoji
  text: string
  originComponentName: string
}) => {
  const { mutate } = useDeleteCommentMutation({
    serviceId,
    patientId,
    commentId: id,
  })
  const track = useAnalytics()

  const deleteComment = () => {
    track('Feedback', originComponentName, 'deleteComment')
    mutate({})
  }

  return (
    <div className="InteractionComment">
      {/* <button onClick={deleteComment}>
        <Icon icon="mdi:delete" />
      </button> */}
      <div className="InteractionComment__icon">
        <InteractionCommentIcon emoji={emoji} />
      </div>
      <div className="InteractionComment__time">
        {format(timestamp, 'HH:mm')}
        {!isToday(timestamp) && (
          <div className="InteractionComment__day">
            {isYesterday(timestamp)
              ? 'ayer'
              : format(timestamp, 'd MMM', { locale: es })}
          </div>
        )}
      </div>
      <div className="InteractionComment__text">{text}</div>
    </div>
  )
}

export default InteractionComment

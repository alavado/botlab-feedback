import './NewCommentPopup.css'
import { FormEvent, useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import OutsideClickHandler from 'react-outside-click-handler'
import { Emoji, emojiMap } from '../InteractionCommentIcon/emojis'
import InteractionCommentIcon from '../InteractionCommentIcon'
import { Icon } from '@iconify/react'
import useAddCommentMutation from '../../../../../api/hooks/useAddCommentMutation'
import { PatientId, ServiceId } from '../../../../../api/types/types'
import useAnalytics from '../../../../../hooks/useAnalytics'

const emojis = Object.keys(emojiMap)

const NewCommentPopup = ({
  interactionStart,
  serviceId,
  patientId,
  isOpen,
  close,
  originComponentName,
}: {
  interactionStart: Date
  serviceId: ServiceId
  patientId: PatientId
  isOpen: boolean
  close: Function
  originComponentName: string
}) => {
  const [selectedEmoji, setSelectedEmoji] = useState(emojis[0])
  const [text, setText] = useState('')
  const textRef = useRef<HTMLInputElement>(null)
  const { mutate, isLoading } = useAddCommentMutation({
    emoji: selectedEmoji as Emoji,
    interactionStart,
    patientId,
    serviceId,
    text,
  })
  const track = useAnalytics()

  useEffect(() => {
    textRef?.current?.focus()
  }, [isOpen])

  const addComment = (e: FormEvent) => {
    e.preventDefault()
    track('Feedback', originComponentName, 'addComment', {
      selectedEmoji,
      text,
    })
    mutate({})
    close()
  }

  return (
    <div
      className={classNames({
        NewCommentPopup: true,
        'NewCommentPopup--visible': isOpen,
      })}
    >
      <OutsideClickHandler onOutsideClick={(e: any) => close(e)}>
        <form className="NewCommentPopup__content" onSubmit={addComment}>
          <button
            className="NewCommentPopup__close"
            type="button"
            onClick={() => close()}
          >
            <Icon icon="mdi:close" />
          </button>
          <h3 className="NewCommentPopup__label">Nuevo comentario</h3>
          <input
            className="NewCommentPopup__input"
            ref={textRef}
            onChange={(e) => setText(e.target.value)}
            value={text}
          />
          <h3 className="NewCommentPopup__label">Selecciona ícono</h3>
          <div className="NewCommentPopup__emojis_container">
            {emojis.map((emoji: string, i) => (
              <button
                className={classNames({
                  NewCommentPopup__emoji_button: true,
                  'NewCommentPopup__emoji_button--selected':
                    emoji === selectedEmoji,
                })}
                type="button"
                onClick={() => {
                  setSelectedEmoji(emoji)
                  textRef?.current?.focus()
                }}
                key={`emoji-${i}`}
              >
                <InteractionCommentIcon emoji={emoji as Emoji} />
              </button>
            ))}
          </div>
          <button
            type="submit"
            className="InteractionComments__add_comment_button"
            disabled={isLoading}
          >
            <Icon icon="mdi:comment-plus" />
            Agregar comentario
          </button>
        </form>
      </OutsideClickHandler>
    </div>
  )
}

export default NewCommentPopup

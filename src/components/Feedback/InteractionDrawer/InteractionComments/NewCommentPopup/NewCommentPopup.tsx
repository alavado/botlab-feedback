import './NewCommentPopup.css'
import { useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import OutsideClickHandler from 'react-outside-click-handler'
import { Emoji, emojiMap } from '../InteractionCommentIcon/emojis'
import InteractionCommentIcon from '../InteractionCommentIcon'
import { Icon } from '@iconify/react'
import useAddCommentMutation from '../../../../../api/hooks/useAddCommentMutation'
import { PatientId, ServiceId } from '../../../../../api/types/types'
import useAnalytics from '../../../../../hooks/useAnalytics'
import { useSelector } from 'react-redux'
import { RootState } from '../../../../../redux/ducks'

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
  const { reaccionesGuardadas } = useSelector(
    (state: RootState) => state.reacciones
  )

  useEffect(() => {
    textRef?.current?.focus()
  }, [isOpen])

  const addComment = (text: string, emoji: Emoji, isQuick: boolean = false) => {
    track(
      'Feedback',
      originComponentName,
      isQuick ? 'addQuickComment' : 'addComment',
      {
        selectedEmoji,
        text,
      }
    )
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
        <form
          className="NewCommentPopup__content"
          onSubmit={(e) => {
            e.preventDefault()
            addComment(text, selectedEmoji as Emoji)
          }}
        >
          <button
            className="NewCommentPopup__close"
            type="button"
            onClick={() => close()}
          >
            <Icon icon="mdi:close" />
          </button>
          <h3 className="NewCommentPopup__label">Agregar nota</h3>
          <input
            id="new-comment-text"
            autoComplete="on"
            name="new-comment-text"
            maxLength={128}
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
            <Icon icon="mdi:note-plus-outline" />
            Agregar nota
          </button>
          <div className="NewCommentPopup__quick_notes_container">
            <h3 className="NewCommentPopup__label">
              <Icon icon="mdi:note" /> Agregar nota rápida
            </h3>
            {reaccionesGuardadas.map(({ comentario, emoji }, i) => (
              <button
                type="button"
                className="NewCommentPopup__quick_note_button"
                onClick={() => addComment(comentario, emoji as Emoji, true)}
              >
                <p>{emoji}</p>
                <p>{comentario}</p>
              </button>
            ))}
          </div>
        </form>
      </OutsideClickHandler>
    </div>
  )
}

export default NewCommentPopup

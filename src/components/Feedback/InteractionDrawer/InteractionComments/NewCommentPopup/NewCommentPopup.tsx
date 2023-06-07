import './NewCommentPopup.css'
import { FormEvent, useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import OutsideClickHandler from 'react-outside-click-handler'
import {
  Emoji,
  emojiMap,
} from '../InteractionComment/InteractionCommentIcon/emojis'
import InteractionCommentIcon from '../InteractionComment/InteractionCommentIcon'
import { Icon } from '@iconify/react'
import useAddCommentMutation from '../../../../../api/hooks/useAddCommentMutation'
import { PatientId, ServiceId } from '../../../../../api/types/domain'
import useAnalytics from '../../../../../hooks/useAnalytics'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../../../redux/ducks'
import { guardaReaccion } from '../../../../../redux/ducks/reacciones'

const emojis = Object.keys(emojiMap).filter(
  (emoji: string) => !emojiMap[emoji as Emoji].disabled
)

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
  const dispatch = useDispatch()
  const { reaccionesGuardadas } = useSelector(
    (state: RootState) => state.reacciones
  )

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
    dispatch(guardaReaccion({ comentario: text, emoji: selectedEmoji }))
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
          {/* <h3 className="NewCommentPopup__label">Selecciona ícono</h3> */}
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
          <h3 className="NewCommentPopup__label">Escribe tu nota</h3>
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
          <button
            type="submit"
            className="InteractionComments__add_comment_button"
            disabled={isLoading}
          >
            <Icon icon="mdi:note-plus-outline" />
            Agregar nota
          </button>
          <div className="NewCommentPopup__quick_notes_container">
            <h3 className="NewCommentPopup__label NewCommentPopup__label--quick_notes_title">
              <Icon icon="mdi:lightbulb-on" /> Sugerencias
            </h3>
            {reaccionesGuardadas.slice(0, 5).map(({ comentario, emoji }, i) => (
              <button
                key={`comment-suggestion-${i}`}
                type="button"
                className="NewCommentPopup__quick_note_button"
                onClick={() => {
                  setText(comentario)
                  setSelectedEmoji(emoji)
                  track('Feedback', originComponentName, 'quickCommentClick', {
                    selectedEmoji: emoji,
                    text: comentario,
                  })
                }}
              >
                <p className="NewCommentPopup__quick_note_button_emoji">
                  {emoji}
                </p>
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

import './NewCommentPopup.css'
import { MouseEventHandler, useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import OutsideClickHandler from 'react-outside-click-handler'
import { Emoji, emojiMap } from '../InteractionCommentIcon/emojis'
import InteractionCommentIcon from '../InteractionCommentIcon'
import { Icon } from '@iconify/react'

const emojis = Object.keys(emojiMap)

const NewCommentPopup = ({
  isOpen,
  close,
}: {
  isOpen: boolean
  close: MouseEventHandler
}) => {
  const [selectedEmoji, setSelectedEmoji] = useState(emojis[0])
  const textRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    textRef?.current?.focus()
  }, [isOpen])

  return (
    <div
      className={classNames({
        NewCommentPopup: true,
        'NewCommentPopup--visible': isOpen,
      })}
    >
      <OutsideClickHandler onOutsideClick={(e: any) => close(e)}>
        <div className="NewCommentPopup__content">
          <button className="NewCommentPopup__close" onClick={close}>
            <Icon icon="mdi:close" />
          </button>
          <h3 className="NewCommentPopup__label">Nuevo comentario</h3>
          <input className="NewCommentPopup__input" ref={textRef} />
          <h3 className="NewCommentPopup__label">Selecciona ícono</h3>
          <div className="NewCommentPopup__emojis_container">
            {emojis.map((emoji: string, i) => (
              <button
                className={classNames({
                  NewCommentPopup__emoji_button: true,
                  'NewCommentPopup__emoji_button--selected':
                    emoji === selectedEmoji,
                })}
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
            className="InteractionComments__add_comment_button"
            onClick={close}
          >
            <Icon icon="mdi:comment-plus" />
            Agregar comentario
          </button>
        </div>
      </OutsideClickHandler>
    </div>
  )
}

export default NewCommentPopup

import { Emoji, emojiToIconData } from './emojis'
import './InteractionCommentIcon.css'

const InteractionCommentIcon = ({ emoji }: { emoji: Emoji }) => {
  console.log({ emoji })
  const { icon, altText } = emojiToIconData(emoji)
  return (
    <img className="InteractionCommentIcon__emoji" src={icon} alt={altText} />
  )
}

export default InteractionCommentIcon

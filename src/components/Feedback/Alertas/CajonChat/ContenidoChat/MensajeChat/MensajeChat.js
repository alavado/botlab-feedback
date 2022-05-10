import Linkify from 'react-linkify/dist/components/Linkify'
import nl2br from 'react-newline-to-break'
import { useSelector } from 'react-redux'
import { scrambleMulti } from '../../../../../Scrambler/scramblers'
import './MensajeChat.css'
import MensajeChatAudio from './MensajeChatAudio'
import MensajeChatImagen from './MensajeChatImagen'

const MensajeChat = ({ mensaje }) => {

  const { terminos, scrambled } = useSelector(state => state.scrambler)

  if (mensaje.message === 'MEDIAAUDIOURL') {
    return <MensajeChatAudio mensaje={mensaje} />
  }
  else if (mensaje.message === 'MEDIAIMAGEURL') {
    return <MensajeChatImagen mensaje={mensaje} />
  }

  return (
    <Linkify>
      {nl2br(scrambled ? scrambleMulti(mensaje.message, terminos) : mensaje.message)}
    </Linkify>
  )
}

export default MensajeChat
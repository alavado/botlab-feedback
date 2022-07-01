import Linkify from 'react-linkify/dist/components/Linkify'
import nl2br from 'react-newline-to-break'
import { useSelector } from 'react-redux'
import { scrambleMulti } from '../../../../../Scrambler/scramblers'
import MensajeChatArchivo from './MensajeChatArchivo'
import MensajeChatAudio from './MensajeChatAudio'
import MensajeChatImagen from './MensajeChatImagen'
import MensajeChatVCard from './MensajeChatVCard'
import MensajeChatVideo from './MensajeChatVideo'
import './MensajeChat.css'
import { marcarNegritas } from '../../../../../../helpers/mensajes'
import MensajeConAdjunto from './MensajeConAdjunto'

const MensajeChat = ({ mensaje }) => {

  const { terminos, scrambled } = useSelector(state => state.scrambler)

  if (mensaje.message === 'MEDIAAUDIOURL') {
    return <MensajeChatAudio mensaje={mensaje} />
  }
  else if (mensaje.message === 'MEDIAIMAGEURL') {
    return <MensajeChatImagen mensaje={mensaje} />
  }
  else if (mensaje.message === 'MEDIAVIDEOURL') {
    return <MensajeChatVideo mensaje={mensaje} />
  }
  else if (mensaje.message === 'MEDIAVCARDURL') {
    return <MensajeChatVCard mensaje={mensaje} />
  }
  else if (mensaje.message === 'MEDIAFILEURL') {
    return <MensajeChatArchivo mensaje={mensaje} />
  }
  else if (mensaje.message.indexOf('ATTACHMENT') >= 0) {
    return <MensajeConAdjunto mensaje={mensaje} />
  }

  return (
    <Linkify>
      {marcarNegritas(nl2br(scrambled ? scrambleMulti(mensaje.message, terminos) : mensaje.message))}
    </Linkify>
  )
}

export default MensajeChat
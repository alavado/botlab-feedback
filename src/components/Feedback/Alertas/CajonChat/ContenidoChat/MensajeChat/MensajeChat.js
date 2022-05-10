import { useEffect, useState } from 'react'
import Linkify from 'react-linkify/dist/components/Linkify'
import nl2br from 'react-newline-to-break'
import { useSelector } from 'react-redux'
import { obtenerContenidoMultimedia } from '../../../../../../api/endpoints'
import Loader from '../../../../../Loader'
import { scrambleMulti } from '../../../../../Scrambler/scramblers'
import './MensajeChat.css'

const MensajeChat = ({ mensaje }) => {

  const { terminos, scrambled } = useSelector(state => state.scrambler)
  const [cargando, setCargando] = useState(false)
  const [urlAudio, setUrlAudio] = useState('')

  useEffect(() => {
    const fetchMedia = async () => {
      if (mensaje.message === 'MEDIAAUDIOURL') {
        setCargando(true)
        const data = await obtenerContenidoMultimedia(mensaje.answer_id)
        setUrlAudio(data.data.data.url)
        setCargando(false)
      }
    }
    fetchMedia()
  }, [mensaje])

  if (cargando) {
    return <Loader color="var(--color-secundario)" />
  }

  if (mensaje.message === 'MEDIAAUDIOURL') {
    return <audio className="MensajeChat__audio" src={urlAudio} alt="imagen gato" controls />
  }

  return (
    <Linkify>
      {nl2br(scrambled ? scrambleMulti(mensaje.message, terminos) : mensaje.message)}
    </Linkify>
  )
}

export default MensajeChat
import { useQuery } from 'react-query'
import { obtenerContenidoMultimedia } from '../../../../../../../api/endpoints'
import Loader from '../../../../../../Loader'
import './MensajeChatAudio.css'

const MensajeChatAudio = ({ mensaje }) => {

  const { data, isLoading } = useQuery(
    ['media', mensaje.answer_id],
    () => obtenerContenidoMultimedia(mensaje.answer_id),
    {
      refetchOnMount: false
    }
  )

  if (isLoading) {
    return <Loader color="var(--color-secundario)" />
  }

  return (
    <audio
      className="MensajeChatAudio"
      src={data.data.data.url}
      alt="Audio enviado por paciente"
      controls
    />
  )
}

export default MensajeChatAudio
import { useQuery } from 'react-query'
import { obtenerContenidoMultimedia } from '../../../../../../../api/endpoints'
import Loader from '../../../../../../Loader'
import './MensajeChatVideo.css'

const MensajeChatVideo = ({ mensaje }) => {

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
    <video
      className="MensajeChatVideo"
      src={data.data.data.url}
      alt="Video enviado por paciente"
      controls
    />
  )
}

export default MensajeChatVideo
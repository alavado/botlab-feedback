import { useQuery } from 'react-query'
import { obtenerContenidoMultimedia } from '../../../../../../../api/endpoints'
import Loader from '../../../../../../Loader'
import './MensajeChatImagen.css'

const MensajeChatImagen = ({ mensaje }) => {

  const { data, isLoading } = useQuery(
    ['media', mensaje.answer_id],
    () => obtenerContenidoMultimedia(mensaje.answer_id),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  )

  if (isLoading) {
    return <Loader color="var(--color-secundario)" />
  }

  return (
    <img
      className="MensajeChatImagen"
      src={data.data.data.url}
      alt="Imagen enviada por paciente"
      controls
    />
  )
}

export default MensajeChatImagen
import { Icon } from '@iconify/react'
import classNames from 'classnames'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { obtenerContenidoMultimedia } from '../../../../../../../api/endpoints'
import Loader from '../../../../../../Loader'
import './MensajeChatImagen.css'

const MensajeChatImagen = ({ mensaje }) => {
  const [blurred, setBlurred] = useState(true)

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
    <div className="MensajeChatImagen">
      <div
        className={classNames({
          MensajeChatImagen__overlay: true,
          'MensajeChatImagen__overlay--hidden': !blurred,
        })}
        onClick={() => setBlurred(false)}
      >
        <Icon icon="mdi:eye-off" />
        <p>Paciente envió imagen</p>
        <p>Haz click para ver</p>
      </div>
      <button
        className={classNames({
          MensajeChatImagen__close: true,
          'MensajeChatImagen__close--hidden': blurred,
        })}
        onClick={() => setBlurred(true)}
      >
        <Icon icon="mdi:close" />
      </button>
      <img
        className={classNames({
          MensajeChatImagen__imagen: true,
          'MensajeChatImagen__imagen--blurred': blurred,
        })}
        src={data.data.data.url}
        alt="Imagen enviada por paciente"
        controls
      />
    </div>
  )
}

export default MensajeChatImagen

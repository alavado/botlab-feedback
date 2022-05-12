import { useQuery } from 'react-query'
import {  obtenerVCard } from '../../../../../../../api/endpoints'
import Loader from '../../../../../../Loader'
import './MensajeChatVCard.css'

const MensajeChatVCard = ({ mensaje }) => {

  const { data, isLoading } = useQuery(
    ['media', mensaje.answer_id],
    () => obtenerVCard(mensaje.answer_id),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      select: data => {
        const partes = data.data.split('\r\n').reduce((obj, linea) => {
          const [prop, valor] = linea.split(':')
          return { ...obj, [prop]: valor }
        }, {})
        const datos = {}
        Object.keys(partes).forEach(prop => {
          if (prop.startsWith('TEL')) {
            datos.telefono = partes[prop]
          }
          else if (prop === 'FN') {
            datos.nombre = partes[prop]
          }
        })
        return datos
      }
    }
  )

  if (isLoading) {
    return <Loader color="var(--color-secundario)" />
  }

  const { telefono, nombre } = data

  return (
    <div className="MensajeChatVCard">
      <div
        className="MensajeChatVCard__avatar"
        style={{ '--hue': 360 * ((nombre.toLowerCase().charCodeAt(0) - 97) / 25)}}
      >
        {nombre[0] ?? 'C'}
      </div>
      <p>{nombre}</p>
      <p
        className="MensajeChatVCard__telefono"
        onClick={() => window.open(`https://web.whatsapp.com/send?phone=${telefono}`, '_blank').focus()}
        title="Contactar por Whatsapp"
      >
        {telefono}
      </p>
    </div>
  )
}

export default MensajeChatVCard
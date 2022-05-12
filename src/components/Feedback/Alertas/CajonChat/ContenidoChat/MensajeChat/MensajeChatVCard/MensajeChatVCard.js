import axios from 'axios'
import { useQuery } from 'react-query'
import { obtenerContenidoMultimedia } from '../../../../../../../api/endpoints'
import Loader from '../../../../../../Loader'
import './MensajeChatVCard.css'

const MensajeChatVCard = ({ mensaje }) => {

  const { data, isLoading } = useQuery(
    ['media', mensaje.answer_id],
    () => obtenerContenidoMultimedia(mensaje.answer_id),
    {
      refetchOnMount: false,
      select: async data => {
        const contenidoVCARD = await axios.get(data.data.data.url)
        console.log(contenidoVCARD)
        const partes = contenidoVCARD.data.split('\r\n').reduce((obj, linea) => {
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

  console.log(data)

  if (isLoading) {
    return <Loader color="var(--color-secundario)" />
  }

  return <div></div>
}

export default MensajeChatVCard
import classNames from 'classnames'
import ContenidoChat from './ContenidoChat'
import { useQuery } from 'react-query'
import { alertas as getAlertas } from '../../../../api/endpoints'
import DatosPacienteCajon from './DatosPacienteCajon'
import AccionesCajon from './AccionesCajon'
import { useParams } from 'react-router-dom'
import './CajonChat.css'

const CajonChat = () => {

  const { data: dataAlertas } = useQuery('alertas', getAlertas)
  const { id } = useParams()
  const alertaDestacada = dataAlertas.data.find(a => a.id === Number(id))

  if (!alertaDestacada) {
    return null
  }

  return (
    <div className={classNames({
      'CajonChat': true,
      'CajonChat--activo': true
    })}>
      <div className="CajonChat__superior">
        <DatosPacienteCajon />
        <AccionesCajon />
      </div>
      <div className="CajonChat__mensajes">
        <ContenidoChat />
      </div>
    </div>
  )
}

export default CajonChat
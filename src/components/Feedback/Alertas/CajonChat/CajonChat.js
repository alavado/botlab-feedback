import classNames from 'classnames'
import { useSelector } from 'react-redux'
import './CajonChat.css'
import ContenidoChat from './ContenidoChat'
import { useQuery } from 'react-query'
import { alertas as getAlertas } from '../../../../api/endpoints'
import DatosPacienteCajon from './DatosPacienteCajon'
import AccionesCajon from './AccionesCajon'

const CajonChat = () => {

  const { cajonActivo, idAlertaDestacada } = useSelector(state => state.alertas)
  const { data: dataAlertas } = useQuery('alertas', getAlertas)
  const alertaDestacada = dataAlertas.data.find(a => a.id === idAlertaDestacada)

  if (!alertaDestacada) {
    return null
  }

  return (
    <div className={classNames({
      'CajonChat': true,
      'CajonChat--activo': cajonActivo
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
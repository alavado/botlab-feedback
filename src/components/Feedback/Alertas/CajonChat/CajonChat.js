import { InlineIcon } from '@iconify/react'
import classNames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { activaCajon } from '../../../../redux/ducks/alertas'
import iconoCerrar from '@iconify/icons-mdi/close'
import './CajonChat.css'
import ContenidoChat from './ContenidoChat'
import DatosPaciente from './DatosPaciente'
import { useQuery } from 'react-query'
import { alertas as getAlertas } from '../../../../api/endpoints'

const CajonChat = () => {

  const { cajonActivo, idAlertaDestacada } = useSelector(state => state.alertas)
  const { data: dataAlertas } = useQuery('alertas', getAlertas)
  const alertaDestacada = dataAlertas.data.find(a => a.id === idAlertaDestacada)
  const dispatch = useDispatch()

  if (!alertaDestacada) {
    return null
  }

  return (
    <div className={classNames({
      'CajonChat': true,
      'CajonChat--activo': cajonActivo
    })}>
      <div className="CajonChat__superior">
        <DatosPaciente />
        <button
          className="CajonChat__boton_accion"
          onClick={() => dispatch(activaCajon(false))}
          title="Cerrar chat"
        >
          <InlineIcon icon={iconoCerrar} />
        </button>
      </div>
      <div className="CajonChat__mensajes">
        <ContenidoChat />
      </div>
    </div>
  )
}

export default CajonChat
import { useDispatch, useSelector } from 'react-redux'
import { activaCajon } from '../../../../../redux/ducks/alertas'
import { InlineIcon } from '@iconify/react'
import iconoCerrar from '@iconify/icons-mdi/close'
import iconoIrAChat from '@iconify/icons-mdi/arrow-expand'
import iconoWhatsapp from '@iconify/icons-mdi/whatsapp'
import './AccionesCajon.css'
import { useHistory } from 'react-router-dom'
import { useQuery } from 'react-query'
import { alertas as getAlertas, chat2 } from '../../../../../api/endpoints'

const AccionesCajon = () => {

  const { idAlertaDestacada } = useSelector(state => state.alertas)
  const { data: dataAlertas } = useQuery('alertas', getAlertas)
  const alertaDestacada = dataAlertas.data.find(a => a.id === idAlertaDestacada)
  const { data, isLoading } = useQuery(
    ['chat', alertaDestacada.poll_id, alertaDestacada.user_id],
    () => chat2(alertaDestacada.poll_id, alertaDestacada.user_id),
  )
  const dispatch = useDispatch()
  const history = useHistory()

  if (isLoading) {
    return null
  }

  const telefono = data.data.data.user.phone

  return (
    <div className="AccionesCajon">
      <button
        className="AccionesCajon__boton_accion"
        onClick={() => history.push(`/chat/${alertaDestacada.poll_id}/${alertaDestacada.user_id}`, { from: '/alertas' })}
        title="Ver chat"
      >
        <InlineIcon icon={iconoIrAChat} />
      </button>
      <button
        className="AccionesCajon__boton_accion"
        onClick={() => window.open(`https://web.whatsapp.com/send?phone=${telefono}`, '_blank').focus()}
        title="Contactar por Whatsapp"
      >
        <InlineIcon icon={iconoWhatsapp} />
      </button>
      <button
        className="AccionesCajon__boton_accion"
        onClick={() => dispatch(activaCajon(false))}
        title="Cerrar"
      >
        <InlineIcon icon={iconoCerrar} />
      </button>
    </div>
  )
}

export default AccionesCajon
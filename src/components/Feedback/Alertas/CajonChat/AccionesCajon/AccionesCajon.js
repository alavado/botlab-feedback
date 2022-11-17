import { InlineIcon } from '@iconify/react'
import './AccionesCajon.css'
import { useHistory } from 'react-router-dom'
import { useQuery } from 'react-query'
import { alertas as getAlertas, chat2 } from '../../../../../api/endpoints'
import { useParams } from 'react-router-dom'
import useAnalytics from '../../../../../hooks/useAnalytics'

const AccionesCajon = () => {

  const { id } = useParams()
  const { data: dataAlertas } = useQuery('alertas', getAlertas)
  const alertaDestacada = dataAlertas.data.find(a => a.id === Number(id))
  const { data, isLoading } = useQuery(
    ['chat', alertaDestacada.poll_id, alertaDestacada.user_id],
    () => chat2(alertaDestacada.poll_id, alertaDestacada.user_id),
  )
  const history = useHistory()
  const track = useAnalytics()

  if (isLoading) {
    return null
  }

  const telefono = data.data.data.user.phone

  return (
    <div className="AccionesCajon">
      <button
        className="AccionesCajon__boton_accion"
        onClick={() => {
          track('Feedback', 'Alertas', 'irADetalleChat', { idEncuesta: alertaDestacada.poll_id, idUsuario: alertaDestacada.user_id })
          history.push(`/chat/${alertaDestacada.poll_id}/${alertaDestacada.user_id}`, { from: '/alertas' })
        }}
      >
        <InlineIcon icon="mdi:smartphone" />
        <span className="AccionesCajon__tooltip">Ver Chat</span>
      </button>
      <button
        className="AccionesCajon__boton_accion"
        onClick={() => {
          const link = `https://wa.me/${telefono}`
          track('Feedback', 'Alertas', 'abrirWhatsappWeb', { link })
          window.open(link, '_blank').focus()
        }}
      >
        <InlineIcon icon="mdi:whatsapp" />
        <span className="AccionesCajon__tooltip">Contactar por Whatsapp</span>
      </button>
      <button
        className="AccionesCajon__boton_accion"
        onClick={() => {
          track('Feedback', 'Alertas', 'cerrarCajonAlertas')
          history.push('/alertas')
        }}
      >
        <InlineIcon icon="mdi:close" />
        <span className="AccionesCajon__tooltip">Cerrar</span>
      </button>
    </div>
  )
}

export default AccionesCajon
import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import { chat2 } from '../../../../../api/endpoints'
import { formatearCampoRespuestas } from '../../../../../helpers/respuestas'
import Loader from '../../../../Loader'
import { alertas as getAlertas } from '../../../../../api/endpoints'
import './DatosPaciente.css'

const DatosPaciente = () => {

  const { idAlertaDestacada } = useSelector(state => state.alertas)
  const { data: dataAlertas } = useQuery('alertas', getAlertas)
  const alertaDestacada = dataAlertas.data.find(a => a.id === idAlertaDestacada)
  const { isLoading, data } = useQuery(
    ['chat', alertaDestacada.poll_id, alertaDestacada.user_id],
    () => chat2(alertaDestacada.poll_id, alertaDestacada.user_id),
  )

  if (isLoading) {
    return <Loader />
  }

  const ultimaConversacion = data.data.data.conversations.slice(-1)[0]
  const nombrePaciente = ultimaConversacion.context.find(d => d.target === 'name').value
  const telefonoPaciente = formatearCampoRespuestas(data.data.data.user.phone, 'phone')

  return (
    <div className="DatosPaciente">
      <div className="DatosPaciente__avatar" style={{ '--hue': 360 * ((nombrePaciente.toLowerCase().charCodeAt(0) - 97) / 25)}}>
        {nombrePaciente[0]}
      </div>
      <div className="DatosPaciente__nombre">
        {nombrePaciente}
      </div>
      <div className="DatosPaciente__telefono">
        {telefonoPaciente}
      </div>
    </div>
  )
}

export default DatosPaciente
import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import { chat2 } from '../../../../../api/endpoints'
import { formatearCampoRespuestas } from '../../../../../helpers/respuestas'
import Loader from '../../../../Loader'
import { alertas as getAlertas } from '../../../../../api/endpoints'
import './DatosPacienteCajon.css'

const DatosPacienteCajon = () => {

  const { idAlertaDestacada } = useSelector(state => state.alertas)
  const { data: dataAlertas, isLoading: loadingAlertas } = useQuery('alertas', getAlertas)
  const alertaDestacada = dataAlertas.data.find(a => a.id === idAlertaDestacada)
  const { isLoading, data } = useQuery(
    ['chat', alertaDestacada.poll_id, alertaDestacada.user_id],
    () => chat2(alertaDestacada.poll_id, alertaDestacada.user_id),
  )

  if (isLoading || loadingAlertas) {
    return (
      <div className="DatosPacienteCajon">
        <div className="DatosPacienteCajon__avatar" style={{ '--hue': 160 }}>
          <Loader color="var(--color-texto-claro)" />
        </div>
        <div className="DatosPacienteCajon__nombre">
        </div>
        <div className="DatosPacienteCajon__telefono">
        </div>
      </div>
    )
  }

  const ultimaConversacion = data.data.data.conversations.slice(-1)[0]
  const nombrePaciente = ultimaConversacion.context.find(d => d.target === 'name' || d.target === 'patient_name_1').value
  const telefonoPaciente = formatearCampoRespuestas(data.data.data.user.phone, 'phone')

  return (
    <div className="DatosPacienteCajon">
      <div className="DatosPacienteCajon__avatar" style={{ '--hue': 360 * ((nombrePaciente.toLowerCase().charCodeAt(0) - 97) / 25)}}>
        {nombrePaciente[0]}
      </div>
      <div className="DatosPacienteCajon__nombre">
        {nombrePaciente}
      </div>
      <div className="DatosPacienteCajon__telefono">
        {telefonoPaciente}
      </div>
    </div>
  )
}

export default DatosPacienteCajon
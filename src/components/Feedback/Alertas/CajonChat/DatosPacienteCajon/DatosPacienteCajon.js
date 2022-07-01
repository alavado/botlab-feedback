import { useQuery } from 'react-query'
import { chat2 } from '../../../../../api/endpoints'
import { formatearCampoRespuestas } from '../../../../../helpers/respuestas'
import Loader from '../../../../Loader'
import { alertas as getAlertas } from '../../../../../api/endpoints'
import './DatosPacienteCajon.css'
import Scrambler from '../../../../Scrambler/Scrambler'
import { useParams } from 'react-router-dom'
import { obtenerNombrePaciente } from '../../../../../helpers/alertas'

const DatosPacienteCajon = () => {

  const { id } = useParams()
  const { data: dataAlertas, isLoading: loadingAlertas } = useQuery('alertas', getAlertas)
  const alertaDestacada = dataAlertas.data.find(a => a.id === Number(id))
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

  const nombrePaciente = obtenerNombrePaciente(alertaDestacada)
  const telefonoPaciente = formatearCampoRespuestas(data.data.data.user.phone, 'phone')

  return (
    <div className="DatosPacienteCajon">
      <div
        className="DatosPacienteCajon__avatar"
        style={{ '--hue': 360 * (((nombrePaciente?.toLowerCase() ?? 'a').charCodeAt(0) - 97) / 25)}}
      >
        {nombrePaciente?.[0]}
      </div>
      <div className="DatosPacienteCajon__nombre">
        <Scrambler tipo="name" propagar={true}>{nombrePaciente}</Scrambler>
      </div>
      <div className="DatosPacienteCajon__telefono">
        <Scrambler tipo="phone">{telefonoPaciente}</Scrambler>
      </div>
    </div>
  )
}

export default DatosPacienteCajon
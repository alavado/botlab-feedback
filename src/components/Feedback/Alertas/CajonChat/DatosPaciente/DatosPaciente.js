import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import { chat2 } from '../../../../../api/endpoints'
import { formatearCampoRespuestas } from '../../../../../helpers/respuestas'
import Loader from '../../../../Loader'
import './DatosPaciente.css'

const DatosPaciente = () => {

  const { idPollAlertaDestacada, idUserAlertaDestacada } = useSelector(state => state.alertas)
  const { isLoading, data } = useQuery(
    ['chat', idPollAlertaDestacada, idUserAlertaDestacada],
    () => chat2(idPollAlertaDestacada, idUserAlertaDestacada)
  )

  if (isLoading) {
    return <Loader />
  }

  const ultimaConversacion = data.data.data.conversations.slice(-1)[0]
  const nombrePaciente = ultimaConversacion.context.find(d => d.target === 'name').value
  const telefonoPaciente = formatearCampoRespuestas(data.data.data.user.phone, 'phone')

  return (
    <div className="DatosPaciente">
      <div className="DatosPaciente__avatar">

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
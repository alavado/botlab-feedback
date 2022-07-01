import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import logoFeedback from '../../../../assets/images/logo_cuadrado_notificaciones.png'
import { obtenerEtiquetaAlerta } from '../../../../helpers/alertas'
import { mensajesAlertasVisibles } from '../../../../redux/ducks/alertas'
import { useAlertasQuery } from '../../Alertas/Alertas'
import './ConteoAlertas.css'

const ConteoAlertas = ({ setFeliz }) => {

  const [conteoAlertas, setConteoAlertas] = useState(0)
  const { recibirNotificaciones, sucursalSeleccionada } = useSelector(state => state.alertas)
  const { data } = useAlertasQuery()
  const history = useHistory()

  useEffect(() => {
    if (!data) {
      return
    }
    const dataAlertas = data
      .map(tab => tab.alertas)
      .flat()
      .filter(a => !sucursalSeleccionada || a.sucursal === sucursalSeleccionada)
    setConteoAlertas(prev => {
      const alertas = dataAlertas?.filter(a => mensajesAlertasVisibles.indexOf(a.message) >= 0 && !a.dismissed) || []
      const nuevoConteo = alertas.length
      if (prev < nuevoConteo) {
        if (!document.hasFocus() && recibirNotificaciones) {
          let notificacion = new Notification(
            '',
            {
              icon: logoFeedback,
              body: `Feedback: ${obtenerEtiquetaAlerta(alertas[0].message)}`,
              requireInteraction: true,
            }
          )
          notificacion.onclick = () => {
            window.focus()
            history.push(`/alertas/${alertas[0].id}`)
          }
        }
      }
      document.title = alertas.length ? `(${alertas.length}) Feedback` : 'Feedback'
      setFeliz(alertas.length === 0)
      return nuevoConteo
    })
  }, [data, sucursalSeleccionada, setFeliz, recibirNotificaciones, history])

  useEffect(() => {
    if (recibirNotificaciones) {
      Notification.requestPermission()
    }
  }, [recibirNotificaciones])

  if (conteoAlertas === 0) {
    return null
  }

  return (
    <div className="ConteoAlertas">
      {conteoAlertas}
    </div>
  )
}

export default ConteoAlertas
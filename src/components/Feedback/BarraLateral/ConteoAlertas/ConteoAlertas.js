import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { alertas as alertasAPI } from '../../../../api/endpoints'
import logoFeedback from '../../../../assets/images/logo_cuadrado_notificaciones.png'
import { obtenerEtiquetaAlerta } from '../../../../helpers/alertas'
import { mensajesAlertasVisibles } from '../../../../redux/ducks/alertas'
import './ConteoAlertas.css'

const ConteoAlertas = ({ setFeliz }) => {

  const [conteoAlertas, setConteoAlertas] = useState(0)
  const { recibirNotificaciones, verAlertas } = useSelector(state => state.alertas)
  const { data: dataAlertas } = useQuery(
    'alertas',
    alertasAPI,
    {
      refetchInterval: 30_000,
      refetchIntervalInBackground: 30_000,
      refetchOnMount: true,
      select: res => res.data.filter(a => verAlertas.includes(a.message)),
    }
  )
  const history = useHistory()

  useEffect(() => {
    if (!dataAlertas) {
      return
    }
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
  }, [dataAlertas, setFeliz, recibirNotificaciones, history])

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
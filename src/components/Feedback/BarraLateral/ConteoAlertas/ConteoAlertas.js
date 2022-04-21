import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import { alertas as alertasAPI } from '../../../../api/endpoints'
import logoFeedback from '../../../../assets/images/logo_cuadrado_notificaciones.png'
import { alertasVisibles } from '../../../../redux/ducks/alertas'
import './ConteoAlertas.css'

const ConteoAlertas = ({ setFeliz }) => {

  const [conteoAlertas, setConteoAlertas] = useState(0)
  const { recibirNotificaciones } = useSelector(state => state.alertas)
  const { data: dataAlertas } = useQuery(
    'alertas',
    alertasAPI,
    {
      refetchInterval: 30_000,
      refetchIntervalInBackground: 30_000,
      refetchOnMount: true,
      select: res => res.data,
    }
  )

  useEffect(() => {
    if (!dataAlertas) {
      return
    }
    setConteoAlertas(prev => {
      const alertas = dataAlertas?.filter(a => alertasVisibles.indexOf(a.message) >= 0 && !a.dismissed) || []
      const nuevoConteo = alertas.length
      if (prev < nuevoConteo) {
        if (!document.hasFocus() && recibirNotificaciones) {
          let notificacion = new Notification(
            '',
            {
              icon: logoFeedback,
              body: `Feedback: ${alertas[0].message}`,
              silent: true,
              requireInteraction: true,
            }
          )
          notificacion.onclick = () => window.focus()
        }
      }
      document.title = alertas.length ? `(${alertas.length}) Feedback` : 'Feedback'
      setFeliz(alertas.length === 0)
      return nuevoConteo
    })
  }, [dataAlertas, setFeliz, recibirNotificaciones])

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
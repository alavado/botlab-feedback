import React, { useMemo } from 'react'
import './Alertas.css'
import { alertas as alertasAPI } from '../../../api/endpoints'
import { useQuery } from 'react-query'
import LoaderMensajes from '../Respuestas/Chat/CelularWhatsapp/LoaderMensajes'
import data from '@iconify/icons-mdi/check'

const Alertas = () => {

  const { isLoading: cargandoAlertas, data: dataAlertas, error: errorAlertas } = useQuery(
    'alertas',
    alertasAPI,
    { refetchInterval: 30_000, refetchOnMount: true }
  )

  const [alertas, alertasResueltas] = useMemo(() => {
    if (!dataAlertas) {
      return [[], []]
    }
    return [
      dataAlertas.data.data.filter(a => !a.dismissed),
      dataAlertas.data.data.filter(a => a.dismissed)
    ]
  }, [dataAlertas])

  if (cargandoAlertas) {
    return <LoaderMensajes />
  }

  console.log({alertas, alertasResueltas})

  return (
    <div className="Alertas">
      {/* <h1>Alertas</h1> */}

    </div>
  )
}

export default Alertas

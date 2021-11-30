import { useState } from 'react'
import { differenceInDays, differenceInHours, parseISO } from 'date-fns'
import { formatDistanceToNow } from 'date-fns/esm'
import { es } from 'date-fns/locale'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import './AlertaPilotos.css'

const usuariosPiloto = [
  {
    nombre: '3DentOnce16',
    exp: '2021-11-08 00:00:00'
  },
  {
    nombre: 'AltoTobalaba',
    exp: '2021-11-13 00:00:00'
  },
  {
    nombre: 'Odontos',
    exp: '2021-12-03 00:00:00'
  },
  {
    nombre: 'Ventus',
    exp: '2021-12-18 00:00:00'
  },
  {
    nombre: 'Santis',
    exp: '2021-12-10 00:00:00'
  },
  {
    nombre: 'AlphaSaludBioBio',
    exp: '2021-11-26 00:00:00'
  },
  {
    nombre: 'SpaDental',
    exp: '2021-12-18 00:00:00'
  },
  {
    nombre: 'Udent',
    exp: '2021-12-15 00:00:00'
  },
  {
    nombre: 'Vitalia',
    exp: '2021-12-24 00:00:00'
  },
  {
    nombre: 'OAS',
    exp: '2021-12-21 00:00:00'
  },
  {
    nombre: 'Ederna',
    exp: '2021-12-28 00:00:00'
  },
]

const AlertaPilotos = () => {

  const { nombreUsuario } = useSelector(state => state.login)
  const usuario = usuariosPiloto.find(u => u.nombre === nombreUsuario)
  const [diferencia, setDiferencia] = useState()

  useEffect(() => {
    const f = () => setDiferencia(usuario && differenceInDays(parseISO(usuario.exp), Date.now()))
    f()
    const interval = setInterval(f, 60_000)
    return () => clearInterval(interval)
  }, [usuario])

  if (diferencia === undefined || diferencia > 5) {
    return null
  }

  const correoPrincipal = `ventas@cero.ai`
  const cc = `contacto@cero.ai`
  const asunto = `Contacto%20Piloto%20${nombreUsuario}`
  const cuerpo = `Tu%20mensaje`
  const dias = formatDistanceToNow(parseISO(usuario.exp), { locale: es, addSuffix: true })
  const verbo = differenceInHours(parseISO(usuario.exp), Date.now()) > 0 ? 'finaliza' : 'finalizó'

  return (
    <div className="AlertaPilotos">
      <strong>{dias}</strong> {verbo} tu piloto del servicio. ¿Quieres continuar confirmando con Cero? 👉 <a className="AlertaPilotos__link" href={`mailto:${correoPrincipal}?cc=${cc}&subject=${asunto}&body=${cuerpo}`}>Contáctanos</a>
    </div>
  )
}

export default AlertaPilotos
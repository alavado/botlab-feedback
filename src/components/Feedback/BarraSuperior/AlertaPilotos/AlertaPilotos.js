import { useState } from 'react'
import { differenceInDays, differenceInHours, parseISO } from 'date-fns'
import { formatDistanceToNow } from 'date-fns/esm'
import { es } from 'date-fns/locale'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import './AlertaPilotos.css'

const usuariosPiloto = [
  {
    nombre: 'Pehuen',
    exp: '2022-02-19 00:00:00'
  },
  {
    nombre: 'SmileKidsCenter',
    exp: '2022-02-26 00:00:00'
  },
  {
    nombre: 'CSI',
    exp: '2022-03-01 00:00:00'
  },
  {
    nombre: 'DentalReagan',
    exp: '2022-03-03 00:00:00'
  },
  {
    nombre: '180Grados',
    exp: '2022-03-05 00:00:00'
  },
  {
    nombre: 'TuSaludDental',
    exp: '2022-03-05 00:00:00'
  },
  {
    nombre: 'SmileAcapulco',
    exp: '2022-03-18 00:00:00'
  },
  {
    nombre: 'ADICH',
    exp: '2022-03-08 00:00:00'
  },
  {
    nombre: 'AcademiaDeImplantes',
    exp: '2022-03-10 00:00:00'
  },
  {
    nombre: 'SportsMedicinaDeportiva',
    exp: '2022-03-11 00:00:00'
  },
  {
    nombre: 'CATH',
    exp: '2022-03-18 00:00:00'
  }
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
import { differenceInDays, parseISO } from 'date-fns'
import { formatDistanceToNow } from 'date-fns/esm'
import { es } from 'date-fns/locale'
import { useSelector } from 'react-redux'
import './AlertaPilotos.css'

const usuariosPiloto = [
  {
    nombre: 'Orema',
    exp: '2021-07-22'
  },
  {
    nombre: 'RubenRosenberg',
    exp: '2021-07-24'
  },
  {
    nombre: 'LasCruces',
    exp: '2021-07-24'
  },
  {
    nombre: 'Basu',
    exp: '2021-07-25'
  },
  {
    nombre: 'OYEDental',
    exp: '2021-08-06'
  }
]

const AlertaPilotos = () => {

  const { nombreUsuario } = useSelector(state => state.login)
  const usuario = usuariosPiloto.find(u => u.nombre == nombreUsuario)

  if (!usuario) {
    return null
  }

  const fechaTermino = parseISO(usuario.exp)

  if (differenceInDays(fechaTermino, Date.now()) > 7) {
    return null
  }

  const correoPrincipal = `ventas@cero.ai`
  const cc = `contacto@cero.ai`
  const asunto = `Contacto%20Piloto%20${nombreUsuario}`
  const cuerpo = `Tu%20mensaje`
  const dias = formatDistanceToNow(fechaTermino, { locale: es })

  return (
    <div className="AlertaPilotos">
      En <strong>{dias}</strong> finaliza tu piloto. ¿Quieres continuar confirmando con Cero? 👉 <a className="AlertaPilotos__link" href={`mailto:${correoPrincipal}?cc=${cc}&subject=${asunto}&body=${cuerpo}`}>Contáctanos</a>
    </div>
  )
}

export default AlertaPilotos
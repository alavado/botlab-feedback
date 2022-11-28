import { useSelector } from 'react-redux'
import './AlertaDeudores.css'

const usuariosDeudores = [
  // 'BiobioSalud'
  'Sanadent',
  'Everest',
  'LeCiel',
  'Maitenes',
  'SantaBlanca',
  'Norden',
  'Santis',
  'SonrieArica',
  'ImagenSalud',
  'Roadent',
  'Maz',
]

const AlertaDeudores = () => {

  const { nombreUsuario } = useSelector(state => state.login)
  const usuario = usuariosDeudores.find(u => u === nombreUsuario)

  if (!usuario) {
    return null
  }

  const correoPrincipal = `finanzas@cero.ai`

  return (
    <div className="AlertaDeudores">
      Tienes facturas vencidas en espera de pago. Regulariza tu deuda comunicandote al +56942773233 o en {correoPrincipal}
    </div>
  )
}

export default AlertaDeudores
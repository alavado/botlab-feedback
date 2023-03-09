import { useSelector } from 'react-redux'
import './AlertaDeudores.css'

const usuariosDeudores = [
  // 'BiobioSalud'
  // 'Vitalia',
  // 'AltoTobalaba',
  // 'LasCruces',
  // 'Redental',
  // 'AltosDelValle',
  'EzioChiappe',
  // 'Facelab',
  // 'CATH',
  // 'BDental',
  // 'Beladent',
  'IntegralLinares',
  // 'Made',
  // 'OrregoLuco',
  // 'AyVDental',
  'SonrieArica',
  'OYEDental',
  // 'Amanda',
  'Maitenes',
]

const AlertaDeudores = () => {
  const { nombreUsuario } = useSelector((state) => state.login)
  const usuario = usuariosDeudores.find((u) => u === nombreUsuario)

  if (!usuario) {
    return null
  }

  const correoPrincipal = `finanzas@cero.ai`

  return (
    <div className="AlertaDeudores">
      Tienes facturas vencidas en espera de pago. Regulariza tu deuda
      comunicándote al +56942773233 o en {correoPrincipal}
    </div>
  )
}

export default AlertaDeudores

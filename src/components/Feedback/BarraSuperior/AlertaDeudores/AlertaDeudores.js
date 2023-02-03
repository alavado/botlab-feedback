import { useSelector } from 'react-redux'
import './AlertaDeudores.css'

const usuariosDeudores = [
  // 'BiobioSalud'

  'EzioChiappe',
  'Facelab',
  'Visum',
  'AltosDelValle',
  'Tobalaba',
  'Made',
  'Cesmed',
  'AyVDental',
  'SantaBlanca',
  'LeCiel',
  'Maitenes',
  'DentalStudio',
  'Redental',
  'Beladent',
  'CEOLA Concepcion',
  'Integral Linares',
  'Aquamed',
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

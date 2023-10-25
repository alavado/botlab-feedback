import { useSelector } from 'react-redux'
import './PaymentDueBanner.css'
import { RootState } from '../../../redux/ducks'
import { esCero } from '../../../helpers/permisos'
import useIsClientDebtorQuery from '../../../api/hooks/useIsClientDebtorQuery'

const PaymentDueBanner = () => {
  const { cuenta } = useSelector((state: RootState) => state.login)
  const { data, isLoading, isError } = useIsClientDebtorQuery()

  if (isLoading || esCero(cuenta) || data?.status === 'NOT_EXPIRED') {
    return null
  }

  if (isError) {
    return null
  }

  var message = ''
  if (data?.status === 'ALMOST_EXPIRED') {
    message = `Su factura por el servicio del mes de ${
      data?.documentServiceMonth
    } vence en ${data.daysLeft} ${data.daysLeft !== 1 ? 'días' : 'día'}`
  } else if (data?.status === 'NON_CHILEAN_EXPIRED') {
    message = 'Su cuenta tiene estados de pago vencidos'
  } else if (data?.status === 'EXPIRED') {
    message = `Su factura por el servicio del mes de ${data?.documentServiceMonth} se encuentra vencida`
  }

  return (
    <p className="PaymentDueBanner">
      Recordatorio! {message}. Para evitar una suspensión del servicio
      comuníquese con finanzas@cero.ai o al +56923700821
    </p>
  )
}
export default PaymentDueBanner

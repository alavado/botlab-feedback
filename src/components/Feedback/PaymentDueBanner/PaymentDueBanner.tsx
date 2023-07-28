import { useSelector } from 'react-redux'
import './PaymentDueBanner.css'
import { RootState } from '../../../redux/ducks'
import { esCero } from '../../../helpers/permisos'
import useIsClientDebtorQuery from '../../../api/hooks/useIsClientDebtorQuery'

const PaymentDueBanner = () => {
  const { cuenta } = useSelector((state: RootState) => state.login)
  const { data, isLoading } = useIsClientDebtorQuery()

  if (isLoading || esCero(cuenta) || data?.status === 'NOT_EXPIRED') {
    return null
  }

  const message =
    data?.status === 'ALMOST_EXPIRED'
      ? `Su factura por el servicio del mes de ${
          data?.documentIssueMonth
        } vence en ${data.daysLeft} ${data.daysLeft !== 1 ? 'días' : 'día'}`
      : `Su factura por el servicio del mes de ${data?.documentIssueMonth} se encuentra vencida`

  return (
    <p className="PaymentDueBanner">
      Recordatorio! {message}. Para evitar una suspensión del servicio
      comuníquese con finanzas@cero.ai o al +569 4277 3233
    </p>
  )
}
export default PaymentDueBanner

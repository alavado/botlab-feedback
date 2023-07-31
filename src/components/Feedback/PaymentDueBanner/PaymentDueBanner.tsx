import useIsClientDebtorQuery from '../../../api/hooks/useIsClientDebtorQuery'
import './PaymentDueBanner.css'

const PaymentDueBanner = () => {
  const { data, isLoading } = useIsClientDebtorQuery()

  if (isLoading || data?.status === 'NOT_EXPIRED') {
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

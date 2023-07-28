import { useSelector } from 'react-redux'
import './PaymentDueBanner.css'
import { RootState } from '../../../redux/ducks'
import { isDebtor } from './debtors'
import { format, addMonths, differenceInDays } from 'date-fns'
import { es } from 'date-fns/locale'
import { esCero } from '../../../helpers/permisos'
import useIsClientDebtorQuery from '../../../api/hooks/useIsClientDebtorQuery'

const PaymentDueBanner = () => {
  const { nombreUsuario, cuenta } = useSelector(
    (state: RootState) => state.login
  )
  const { data } = useIsClientDebtorQuery()

  const debtor = isDebtor(nombreUsuario as string)

  if (!debtor || esCero(cuenta)) {
    return null
  }

  const daysLeft = 1 + differenceInDays(debtor.dueDate, new Date())
  const month = format(addMonths(new Date(), -2), 'MMMM', { locale: es })

  const message =
    daysLeft > 0
      ? `Recordatorio! Su factura por el servicio del mes de ${month} vence en ${daysLeft} ${
          daysLeft !== 1 ? 'días' : 'día'
        }. Para evitar una suspensión del servicio comuníquese con finanzas@cero.ai o al +569 4277 3233`
      : `Recordatorio! Su factura por el servicio del mes de ${month} se encuentra vencida. Para evitar una suspensión del servicio comuníquese con +56 94277 3233 o en finanzas@cero.ai`

  return <p className="PaymentDueBanner">{message}</p>
}
export default PaymentDueBanner

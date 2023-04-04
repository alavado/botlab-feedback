import { useSelector } from 'react-redux'
import './PaymentDueBanner.css'
import { RootState } from '../../../redux/ducks'
import { isDebtor } from './debtors'
import { differenceInDays } from 'date-fns'

const PaymentDueBanner = () => {
  const { nombreUsuario } = useSelector((state: RootState) => state.login)

  const debtor = isDebtor(nombreUsuario as string)

  if (!debtor) {
    return null
  }

  const daysLeft = differenceInDays(debtor.dueDate, new Date())
  const message =
    daysLeft > 0
      ? `Su empresa tiene facturas pendientes de pago. El servicio será suspendido en ${daysLeft} ${
          daysLeft !== 1 ? 'días' : 'día'
        }. Para cualquier duda comuníquese al +569 4277 3233 o en finanzas@cero.ai`
      : `SERVICIO SUSPENDIDO POR NO PAGO. Para cualquier duda comuníquese al +56 94277 3233 o en finanzas@cero.ai`

  return <p className="PaymentDueBanner">{message}</p>
}
export default PaymentDueBanner

import { useSelector } from 'react-redux'
import './PaymentDueModal.css'
import { RootState } from '../../../redux/ducks'
import { isDebtor } from '../PaymentDueBanner/debtors'
import { format, addMonths, differenceInDays } from 'date-fns'
import { useState } from 'react'
import { es } from 'date-fns/locale'

const PaymentDueModal = () => {
  const { nombreUsuario } = useSelector((state: RootState) => state.login)
  const [visible, setVisible] = useState(true)

  const debtor = isDebtor(nombreUsuario as string)

  if (!debtor || !visible) {
    return null
  }

  const daysLeft = 1 + differenceInDays(debtor.dueDate, new Date())

  if (daysLeft <= 0) {
    return null
  }

  return (
    <div className="PaymentDueModal">
      <div className="PaymentDueModal__content">
        <h2 className="PaymentDueModal__title">Recordatorio</h2>
        <p>
          Su factura por el servicio del mes de{' '}
          {format(addMonths(new Date(), -2), 'MMMM', { locale: es })} vence en{' '}
          {daysLeft} {daysLeft !== 1 ? 'días' : 'día'}.
        </p>
        <p>
          Para evitar una suspensión del servicio comuníquese con
          finanzas@cero.ai o al +569 4277 3233.
        </p>
        <button
          className="PaymentDueModal__button"
          onClick={() => setVisible(false)}
        >
          Aceptar
        </button>
      </div>
    </div>
  )
}
export default PaymentDueModal

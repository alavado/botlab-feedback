import { useSelector } from 'react-redux'
import './PaymentDueModal.css'
import { RootState } from '../../../redux/ducks'
import { isDebtor } from '../PaymentDueBanner/debtors'
import { format, addMonths, differenceInDays } from 'date-fns'
import { useState } from 'react'
import { es } from 'date-fns/locale'

const PaymentDueModal = () => {
  const { nombreUsuario, cuenta } = useSelector(
    (state: RootState) => state.login
  )
  const [visible, setVisible] = useState(true)

  const debtor = isDebtor(nombreUsuario as string)

  if (!debtor || !visible || cuenta?.endsWith('_cero')) {
    return null
  }

  const daysLeft = 1 + differenceInDays(debtor.dueDate, new Date())
  const month = format(addMonths(new Date(), -2), 'MMMM', { locale: es })

  return (
    <div className="PaymentDueModal">
      <div className="PaymentDueModal__content">
        <h2 className="PaymentDueModal__title">Recordatorio</h2>
        {daysLeft > 0 ? (
          <p>
            Su factura por el servicio del mes de {month} vence en {daysLeft}{' '}
            {daysLeft !== 1 ? 'días' : 'día'}.
          </p>
        ) : (
          <p>
            Recordatorio! Su factura por el servicio del mes de {month} se
            encuentra vencida.
          </p>
        )}
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

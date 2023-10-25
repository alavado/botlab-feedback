import { useSelector } from 'react-redux'
import './PaymentDueModal.css'
import { RootState } from '../../../redux/ducks'
import { useState } from 'react'
import useIsClientDebtorQuery from '../../../api/hooks/useIsClientDebtorQuery'
import { esCero } from '../../../helpers/permisos'

const PaymentDueModal = () => {
  const { cuenta } = useSelector((state: RootState) => state.login)
  const { data, isLoading } = useIsClientDebtorQuery()
  const [visible, setVisible] = useState(true)

  if (
    isLoading ||
    !visible ||
    esCero(cuenta) ||
    data?.status === 'NOT_EXPIRED'
  ) {
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
    <div className="PaymentDueModal">
      <div className="PaymentDueModal__content">
        <h2 className="PaymentDueModal__title">Recordatorio</h2>
        <p>{message}</p>
        <p>
          Para evitar una suspensión del servicio comuníquese con
          finanzas@cero.ai o al +56923700821
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

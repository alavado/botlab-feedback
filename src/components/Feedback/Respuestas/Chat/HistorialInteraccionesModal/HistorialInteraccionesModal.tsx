import useInteractionsHistoryQuery from '../../../../../api/hooks/useInteractionsHistoryQuery'
import { useParams } from 'react-router-dom'
import { createPortal } from 'react-dom'
import { Fragment } from 'react'
import './HistorialInteraccionesModal.css'
import { InteractionHistoryRecord } from '../../../../../api/types/responses'
import { format, parseISO } from 'date-fns'
import { Icon } from '@iconify/react'

// modal-historial-interacciones
const HistorialInteraccionesModal = ({ close }: {close: Function}) => {
  const params: any = useParams()
  const { data, isLoading } = useInteractionsHistoryQuery({
    serviceId: params.idEncuesta,
    patientId: params.idUsuario,
  })

  if (isLoading) {
    return null
  }

  return createPortal(
    <div className="HistorialInteraccionesModal__backdrop" onClick={(e: React.MouseEvent) => close()}>
      <div className="HistorialInteraccionesModal__paper" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        <button className="HistorialInteraccionesModal__close" onClick={(e: React.MouseEvent) => close()}>
          <Icon icon="mdi:close" />
        </button>
        <div className="HistorialInteraccionesModal__content">
          <div className="HistorialInteraccionesModal__title">
            Historial de Contactos
          </div>
          <div className="HistorialInteraccionesModal__grid">
            <div className="HistorialInteraccionesModal__grid__header">
              <div>Fecha</div>
              <div>Canal de contacto</div>
              <div>Teléfono</div>
              <div>Estado</div>
            </div>
            <div className="HistorialInteraccionesModal__grid__body">
              {data.map((record: InteractionHistoryRecord) => (
                <Fragment key={record.money_id}>
                  <div>{format(parseISO(record.timestamp), 'yyyy-MM-dd HH:mm')}</div>
                  <div>{record.channel}</div>
                  <div>{record.phone}</div>
                  <div>{record.status.toUpperCase()}</div>
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.querySelector('#modal-historial-interacciones') as HTMLElement
  )
}

export default HistorialInteraccionesModal

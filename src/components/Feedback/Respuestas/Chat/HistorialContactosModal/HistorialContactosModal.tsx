import useInteractionsHistoryQuery from '../../../../../api/hooks/useInteractionsHistoryQuery'
import { useParams } from 'react-router-dom'
import { createPortal } from 'react-dom'
import { Fragment } from 'react'
import './HistorialContactosModal.css'
import { InteractionHistoryRecord } from '../../../../../api/types/responses'
import { format, parseISO } from 'date-fns'
import { Icon } from '@iconify/react'
import { formatearCampoRespuestas } from '../../../../../helpers/respuestas'
import Scrambler from '../../../../Scrambler'

// modal-historial-contactos
const HistorialContactosModal = ({ close }: {close: Function}) => {
  const params: any = useParams()
  const { data, isLoading } = useInteractionsHistoryQuery({
    serviceId: params.idEncuesta,
    patientId: params.idUsuario,
  })

  if (isLoading) {
    return null
  }

  return createPortal(
    <div className="HistorialContactosModal__backdrop" onClick={(e: React.MouseEvent) => close()}>
      <div className="HistorialContactosModal__paper" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        <button className="HistorialContactosModal__close" onClick={(e: React.MouseEvent) => close()}>
          <Icon icon="mdi:close" />
        </button>
        <div className="HistorialContactosModal__content">
          <div className="HistorialContactosModal__title">
            Historial de Contactos
          </div>
          <div className="HistorialContactosModal__grid">
            <div className="HistorialContactosModal__grid__header">
              <div>Fecha</div>
              <div>Canal</div>
              <div>Teléfono</div>
              <div>Estado</div>
            </div>
            <div className="HistorialContactosModal__grid__body">
              {data.map((record: InteractionHistoryRecord) => (
                <Fragment key={record.timestamp}>
                  <div>{format(parseISO(record.timestamp), 'yyyy-MM-dd HH:mm')}</div>
                  <div>
                    <Icon
                      className="HistorialContactosModal__channel_icon"
                      icon={`mdi:${record.channel}`}
                    />
                  </div>
                  <div>
                    <Scrambler tipo="telefono" propagar={false}>
                      {formatearCampoRespuestas(record.phone, 'phone')}
                    </Scrambler>
                  </div>
                  <div>{formatearCampoRespuestas(record.status, 'contact-status')}</div>
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.querySelector('#modal-historial-contactos') as HTMLElement
  )
}

export default HistorialContactosModal

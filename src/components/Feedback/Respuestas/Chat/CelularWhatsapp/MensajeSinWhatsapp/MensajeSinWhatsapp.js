import { Icon } from '@iconify/react'
import './MensajeSinWhatsapp.css'
import { format, parseISO } from 'date-fns'
import { formatearCampoRespuestas } from '../../../../../../helpers/respuestas'

const MensajeSinWhatsapp = ({ start, intentos }) => {
  return (
    <div className="MensajeSinWhatsapp">
      <button className="MensajeSinWhatsapp__boton_explicacion">
        ¿Qué es esto?
      </button>
      <div className="MensajeSinWhatsapp__iconos">
        <Icon icon="mdi:whatsapp" className="MensajeSinWhatsapp__icono" />
        <Icon
          icon="mdi:emoticon-sad-outline"
          className="MensajeSinWhatsapp__icono"
        />
      </div>
      <div>
        <h3 className="MensajeSinWhatsapp__titulo">
          No pudimos contactar a este paciente
        </h3>
        <p className="MensajeSinWhatsapp__contenido">
          {intentos?.length > 1 ? (
            <>
              <span>Ninguno de sus números asociados tiene Whatsapp:</span>
              <ol className="MensajeSinWhatsapp__lista_telefonos">
                {intentos?.map((intento, i) => (
                  <li key={`MensajeSinWhatsapp__lista_telefonos-${i}`}>
                    {formatearCampoRespuestas(intento.phone, 'phone')}
                  </li>
                ))}
              </ol>
            </>
          ) : (
            <>El número asociado no tiene Whatsapp</>
          )}
        </p>
      </div>
      <p className="MensajeSinWhatsapp__fecha">
        {format(parseISO(start), 'hh:mm')}
      </p>
    </div>
  )
}

export default MensajeSinWhatsapp

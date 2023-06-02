import { Icon } from '@iconify/react'
import './MensajeSinWhatsapp.css'
import { format, parseISO } from 'date-fns'
import { formatearCampoRespuestas } from '../../../../../../helpers/respuestas'
import TagRespuesta from '../../../TablaRespuestas/TagRespuesta/TagRespuesta'
import imagenUnreachable from '../../../../../../assets/images/unreachable.png'

const MensajeSinWhatsapp = ({ start, intentos }) => {
  return (
    <div className="MensajeSinWhatsapp">
      <dialog className="MensajeSinWhatsapp__dialogo" open={false}>
        <div className="MensajeSinWhatsapp__dialogo_contenido">
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <TagRespuesta tag="UNREACHABLE" />
          </div>
          <p>
            Desde ahora en Feedback estamos marcando los números de teléfono de
            pacientes que no usan WhatsApp
          </p>
          <form method="dialog">
            <button className="MensajeSinWhatsapp__boton_cerrar_dialogo">
              ¡Entendido!
            </button>
          </form>
        </div>
      </dialog>
      <button
        className="MensajeSinWhatsapp__boton_explicacion"
        onClick={() =>
          document.querySelector('.MensajeSinWhatsapp__dialogo').showModal()
        }
      >
        ¿Qué es esto?
      </button>
      <div className="MensajeSinWhatsapp__iconos">
        <img
          className="MensajeSinWhatsapp__imagen"
          src={imagenUnreachable}
          alt="No pudimos contactar a este paciente"
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

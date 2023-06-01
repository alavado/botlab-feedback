import { Icon } from '@iconify/react'
import './MensajeSinWhatsapp.css'
import { format, parseISO } from 'date-fns'

const MensajeSinWhatsapp = ({ start }) => {
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
        <p>Ninguno de sus números asociados tiene Whatsapp</p>
        <li>{}</li>
        <p className="MensajeSinWhatsapp__fecha">
          {format(parseISO(start), 'hh:mm dd/MM/yy')}
        </p>
      </div>
    </div>
  )
}

export default MensajeSinWhatsapp

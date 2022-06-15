import { Cita } from '../../../../../api/types/servicio'
import './AvatarUsuarios.css'

const AvatarUsuarios = ({ citas } : { citas: any }) => {
  return citas?.[0]
    ? <div className="AvatarUsuarios">
        {citas.map((cita: Cita, i: number) => (
          <div
            className="AvatarUsuarios__avatar"
            key={`avatar-cita-${i}`}
            style={{
              background: `hsl(${360 * ((cita.nombre.toLowerCase().charCodeAt(0) - 97) / 25)}, 65%, 55%)`,
              transform: `translateX(${i * 0.1}rem) translateY(${i * 0}rem)`,
              zIndex: citas.length - i
            }}
          >
            {cita.nombre[0]}
          </div>
        ))}
      </div>
    : <div className="AvatarUsuarios__skeleton" />
}

export default AvatarUsuarios
import { useInteraccionActivaQuery } from '../../../../../api/hooks'
import { Cita } from '../../../../../api/types/servicio'
import './AvatarUsuarios.css'

const AvatarUsuarios = () => {

  const { data } = useInteraccionActivaQuery()

  return data?.citas?.[0]
    ? <span className="AvatarUsuarios">
        {data.citas.map((cita: Cita, i: number) => (
          <span
            className="AvatarUsuarios__avatar"
            key={`avatar-cita-${i}`}
            style={{
              background: `hsl(${360 * ((cita.nombre.toLowerCase().charCodeAt(0) - 97) / 25)}, 65%, 55%)`,
              transform: `translateX(${i * 0.1}rem) translateY(${i * 0}rem)`,
              zIndex: data.citas.length - i
            }}
          >
            {cita.nombre[0]}
          </span>
        ))}
      </span>
    : <span className="AvatarUsuarios__skeleton" />
}

export default AvatarUsuarios
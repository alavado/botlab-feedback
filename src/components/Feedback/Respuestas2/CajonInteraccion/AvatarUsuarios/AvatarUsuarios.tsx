import { useInteraccionActivaQuery } from '../../../../../api/hooks'
import { Appointment } from '../../../../../api/types/servicio'
import './AvatarUsuarios.css'

const AvatarUsuarios = () => {

  const { data } = useInteraccionActivaQuery()

  return data?.appointments?.[0]
    ? <span className="AvatarUsuarios">
        {data.appointments.map((cita: Appointment, i: number) => (
          <span
            className="AvatarUsuarios__avatar"
            key={`avatar-cita-${i}`}
            style={{
              background: `hsl(${360 * ((cita.patientName.toLowerCase().charCodeAt(0) - 97) / 25)}, 65%, 55%)`,
              transform: `translateX(${i * 0.1}rem) translateY(${i * 0}rem)`,
              zIndex: data.appointments.length - i
            }}
          >
            {cita.patientName[0]}
          </span>
        ))}
      </span>
    : <span className="AvatarUsuarios__skeleton" />
}

export default AvatarUsuarios
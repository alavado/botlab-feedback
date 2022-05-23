import { IconifyIcon } from '@iconify/types'

export interface Servicio {
  id: Number,
  nombre: string,
  horaInicio: string,
  habilitado: boolean,
  icono: IconifyIcon,
  propiedades: [PropiedadServicio]
}

export interface PropiedadServicio {
  id: string,
  nombre: string,
  tipo: "META" | "YESNO"
}

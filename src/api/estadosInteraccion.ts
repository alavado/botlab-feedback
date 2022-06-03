import { EstadoInteraccion } from "./types/servicio"

import iconoEstadoPendiente from '@iconify/icons-mdi/timer-sand'
import iconoEstadoConfirma from '@iconify/icons-mdi/check'
import iconoEstadoCancela from '@iconify/icons-mdi/cancel'
import iconoEstadoReagenda from '@iconify/icons-mdi/autorenew'
import iconoEstadoOut from '@iconify/icons-mdi/question-mark'

export const estadosInteracciones: EstadoInteraccion[] = [
  {
    id: 'PENDIENTE',
    descripcion: 'Esperando respuesta',
    icono: iconoEstadoPendiente
  },
  {
    id: 'CONFIRMADA',
    descripcion: 'Confirma cita',
    icono: iconoEstadoConfirma
  },
  {
    id: 'CANCELADA',
    descripcion: 'Anula cita',
    icono: iconoEstadoCancela
  },
  {
    id: 'REAGENDADA',
    descripcion: 'Reagenda cita',
    icono: iconoEstadoReagenda
  },
  {
    id: 'IMPROCESABLE',
    descripcion: 'Bot no entendió',
    icono: iconoEstadoOut
  },
]
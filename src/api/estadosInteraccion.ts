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
    icono: iconoEstadoPendiente,
    explicacion: 'Bot todavía no recibe respuesta'
  },
  {
    id: 'CONFIRMADA',
    descripcion: 'Confirma cita',
    icono: iconoEstadoConfirma,
    explicacion: 'La cita ha sido confirmada'
  },
  {
    id: 'CANCELADA',
    descripcion: 'Anula cita',
    icono: iconoEstadoCancela,
    explicacion: 'La cita ha sido anulada'
  },
  {
    id: 'REAGENDADA',
    descripcion: 'Reagenda cita',
    icono: iconoEstadoReagenda,
    explicacion: 'La cita ha sido reagendada'
  },
  {
    id: 'IMPROCESABLE',
    descripcion: 'Bot no entendió',
    icono: iconoEstadoOut,
    explicacion: 'Bot quedó confundido con mensaje'
  },
]
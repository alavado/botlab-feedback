import { EstadoInteraccion } from "./types/servicio"

export const estadosInteracciones: EstadoInteraccion[] = [
  {
    id: 'PENDIENTE',
    descripcion: 'Esperando respuesta',
    icono: 'mdi:timer-sand',
    explicacion: 'Bot todavía no recibe respuesta'
  },
  {
    id: 'CONFIRMADA',
    descripcion: 'Confirma cita',
    icono: 'mdi:check',
    explicacion: 'La cita ha sido confirmada'
  },
  {
    id: 'CANCELADA',
    descripcion: 'Anula cita',
    icono: 'mdi:cancel',
    explicacion: 'La cita ha sido anulada'
  },
  {
    id: 'REAGENDADA',
    descripcion: 'Reagenda cita',
    icono: 'mdi:autorenew',
    explicacion: 'La cita ha sido reagendada'
  },
  {
    id: 'IMPROCESABLE',
    descripcion: 'Bot no entendió',
    icono: 'mdi:question-mark',
    explicacion: 'Bot quedó confundido con mensaje'
  },
]
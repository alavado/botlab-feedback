import { EstadoInteraccion } from "./types/servicio"

export const estadosInteracciones: EstadoInteraccion[] = [
  {
    id: 'PENDIENTE',
    descripcion: 'Pendiente',
    icono: 'mdi:timer-sand',
    explicacion: 'Bot todavía no recibe respuesta',
    color: '#eee',
  },
  {
    id: 'CONFIRMADA',
    descripcion: 'Confirma',
    icono: 'mdi:check',
    explicacion: 'La cita ha sido confirmada',
    color: 'var(--color-si)',
  },
  {
    id: 'CANCELADA',
    descripcion: 'Cancela',
    icono: 'mdi:close',
    explicacion: 'La cita ha sido anulada',
    color: 'var(--color-no)',
  },
  {
    id: 'REAGENDADA',
    descripcion: 'Reagenda',
    icono: 'mdi:arrow-right',
    explicacion: 'La cita ha sido reagendada',
    color: 'var(--color-reagenda)',
  },
]
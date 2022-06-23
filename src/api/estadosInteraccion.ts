import { EstadoInteraccion } from "./types/servicio"

export const estadosInteracciones: EstadoInteraccion[] = [
  {
    id: 'CUALQUIERA',
    descripcion: 'Todas',
    icono: 'mdi:home',
    explicacion: 'Todas las interacciones',
    color: '#eee',
  },
  {
    id: 'PENDIENTE',
    descripcion: 'Esperando respuesta',
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
    icono: 'mdi:autorenew',
    explicacion: 'La cita ha sido reagendada',
    color: 'var(--color-reagenda)',
  },
]
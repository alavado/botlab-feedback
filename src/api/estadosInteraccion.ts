import { EstadoInteraccion } from "./types/servicio"

export const estadosInteracciones: EstadoInteraccion[] = [
  {
    id: 'CUALQUIERA',
    descripcion: 'Todos',
    icono: 'mdi:home',
    explicacion: 'Todas las interacciones'
  },
  {
    id: 'PENDIENTE',
    descripcion: 'Esperando respuesta',
    icono: 'mdi:timer-sand',
    explicacion: 'Bot todavía no recibe respuesta'
  },
  {
    id: 'CONFIRMADA',
    descripcion: 'Confirma',
    icono: 'mdi:check',
    explicacion: 'La cita ha sido confirmada'
  },
  {
    id: 'CANCELADA',
    descripcion: 'Cancela',
    icono: 'mdi:close',
    explicacion: 'La cita ha sido anulada'
  },
  {
    id: 'REAGENDADA',
    descripcion: 'Reagenda',
    icono: 'mdi:autorenew',
    explicacion: 'La cita ha sido reagendada'
  },
]
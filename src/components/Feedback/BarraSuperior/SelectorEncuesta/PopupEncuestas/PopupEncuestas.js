import React, { useMemo } from 'react'
import ReactDOM from 'react-dom'
import { useSelector } from 'react-redux'
import { Icon } from '@iconify/react'
import whatsapp from '@iconify/icons-mdi/whatsapp'
import classNames from 'classnames'
import './PopupEncuestas.css'
import Scrambler from '../../../../../helpers/Scrambler/Scrambler'

const PopupEncuestas = ({ activo, esconder, verEncuesta }) => {

  const { tipos, idEncuestaSeleccionada } = useSelector(state => state.encuestas)
  const { respuestas } = useSelector(state => state.respuestas)

  const tiposOrdenados = useMemo(() => {
    const indiceEncuestaSeleccionada = tipos.findIndex(({ id }) => id === idEncuestaSeleccionada)
    const tiposEncuestas = [
      tipos[indiceEncuestaSeleccionada],
      ...tipos.filter(({ id }) => id !== idEncuestaSeleccionada)
    ]
    if (respuestas && idEncuestaSeleccionada === Number(process.env.REACT_APP_ID_POLL_SANTA_BLANCA)) {
      [...new Set(respuestas.map(r => r.sucursal_name))].forEach(s => {
        tiposEncuestas.push({
          id: `filtro|sucursal_name|${s}|${idEncuestaSeleccionada}`,
          nombre: s,
          enabled: true
        })
      })
    }
    return tiposEncuestas
  }, [tipos, idEncuestaSeleccionada, respuestas])

  return <>
      {ReactDOM.createPortal(
      <div
        className={classNames({
          'PopupEncuestas__lamina': true,
          'PopupEncuestas__lamina--activo': activo
        })}
        style={{ pointerEvents: activo ? 'all' : 'none' }}
        onClick={e => {
          esconder()
          e.stopPropagation()
        }}
      >
      </div>, document.getElementById('popup-encuestas'))}
      <div
        className="PopupEncuestas" 
        style={{
          pointerEvents: activo ? 'all' : 'none',
          opacity: activo ? 1 : 0
        }}
      >
        {tiposOrdenados.map(({ id, nombre, enabled }) => (
          <div
            key={`boton-${id}`}
            onClick={e => {
              verEncuesta(id)
              esconder()
              e.stopPropagation()
            }}
            className="PopupEncuestas__opcion"
          >
            <Icon
              className="PopupEncuestas__icono_empresa"
              icon={whatsapp}
              style={{ color: enabled ? '#48BB78' : '#9f9eae' }}
            />
            <div className="PopupEncuestas__nombre_encuesta">
              <Scrambler tipo="multi">{nombre}</Scrambler>
            </div>
          </div>
        ))}
      </div>
    </>
}

export default PopupEncuestas

import React, { useMemo } from 'react'
import ReactDOM from 'react-dom'
import { useSelector } from 'react-redux'
import { Icon } from '@iconify/react'
import whatsapp from '@iconify/icons-mdi/whatsapp'
import iconoSucursal from '@iconify/icons-mdi/home-outline'
import classNames from 'classnames'
import './PopupEncuestas.css'
import Scrambler from '../../../../../helpers/Scrambler/Scrambler'

const PopupEncuestas = ({ activo, esconder, verEncuesta }) => {

  const { tipos, idEncuestaSeleccionada } = useSelector(state => state.encuestas)
  const { respuestas } = useSelector(state => state.respuestas)

  const tiposOrdenados = useMemo(() => {
    const encuestaSeleccionada = tipos.find(({ id }) => id === idEncuestaSeleccionada)
    const encuestasFicticias = respuestas && idEncuestaSeleccionada === Number(process.env.REACT_APP_ID_POLL_SANTA_BLANCA)
      ? [...new Set(respuestas.map(r => r.sucursal_name))].map(s => {
        const nombreEncuesta = `${encuestaSeleccionada.nombre} - ${s}`
        return {
          id: `filtro|sucursal_name|${s}|${idEncuestaSeleccionada}|${nombreEncuesta}`,
          nombre: nombreEncuesta,
          enabled: encuestaSeleccionada.enabled,
          icono: iconoSucursal
        }})
      : []
    const tiposEncuestas = [
      encuestaSeleccionada,
      ...(encuestasFicticias.length > 1 ? encuestasFicticias : []),
      ...tipos.filter(({ id }) => id !== idEncuestaSeleccionada)
    ]
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
        {tiposOrdenados.map(({ id, nombre, enabled, icono }) => (
          <div
            key={`boton-${id}`}
            onClick={e => {
              verEncuesta(id)
              esconder()
              e.stopPropagation()
            }}
            className={classNames({
              "PopupEncuestas__opcion": true,
              "PopupEncuestas__opcion--indentada": icono
            })}
          >
            <Icon
              className="PopupEncuestas__icono_empresa"
              icon={icono || whatsapp}
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

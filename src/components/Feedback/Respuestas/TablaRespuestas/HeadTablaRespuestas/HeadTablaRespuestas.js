import React from 'react'
import classNames from 'classnames'
import { columnaEstaColapsada } from '../../../../../helpers/tablaRespuestas'
import { useDispatch, useSelector } from 'react-redux'
import './HeadTablaRespuestas.css'
import { ordenaRespuestas } from '../../../../../redux/ducks/respuestas'

const HeadTablaRespuestas = () => {

  const { idEncuestaSeleccionada, headers } = useSelector(state => state.encuestas)
  const { columnasColapsadas } = useSelector(state => state.opciones)
  const dispatch = useDispatch()

  if (!headers) {
    return null
  }
  // esto era para colapsar la columna
  // dispatch(toggleaColapsoColumna(idEncuestaSeleccionada, nombre))
  return (
    <thead className="HeadTablaRespuestas">
      <tr className="HeadTablaRespuestas__fila">
        {headers.map(({ nombre, texto }) => (
          <th
            key={`header-${nombre}`}
            className={classNames({
              'HeadTablaRespuestas__header': true,
              'HeadTablaRespuestas__header--oculto': columnaEstaColapsada(idEncuestaSeleccionada, nombre, columnasColapsadas)
            })}
            title={texto}
            onClick={() => dispatch(ordenaRespuestas(nombre))}
          >
            {texto}
          </th>
        ))}
      </tr>
    </thead>
  )
}

export default HeadTablaRespuestas

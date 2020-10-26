import React from 'react'
import classNames from 'classnames'
import { columnaEstaColapsada } from '../../../../../helpers/tablaRespuestas'
import { useDispatch, useSelector } from 'react-redux'
import { toggleaColapsoColumna } from '../../../../../redux/ducks/opciones'
import './HeadTablaRespuestas.css'

const HeadTablaRespuestas = () => {

  const { idEncuestaSeleccionada, headers } = useSelector(state => state.encuestas)
  const { columnasColapsadas } = useSelector(state => state.opciones)
  const dispatch = useDispatch()

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
            onClick={() => dispatch(toggleaColapsoColumna(idEncuestaSeleccionada, nombre))}
          >
            {texto}
          </th>
        ))}
      </tr>
    </thead>
  )
}

export default HeadTablaRespuestas

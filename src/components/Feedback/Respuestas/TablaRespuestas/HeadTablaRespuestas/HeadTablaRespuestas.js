import React from 'react'
import classNames from 'classnames'
import './HeadTablaRespuestas.css'
import { columnaEstaColapsada } from '../../../../../helpers/tablaRespuestas'
import { useDispatch, useSelector } from 'react-redux'
import { toggleaColapsoColumna } from '../../../../../redux/ducks/opciones'

const HeadTablaRespuestas = () => {

  const { idEncuestaSeleccionada, headers } = useSelector(state => state.encuestas)
  const { columnasColapsadas } = useSelector(state => state.opciones)
  const dispatch = useDispatch()

  return (
    <thead className="HeadTablaRespuestas">
      <tr className="TablaRespuestas__fila">
        {headers.map(({ nombre, texto }) => (
          <th
            key={`header-${nombre}`}
            className={classNames({
              'TablaRespuestas__header': true,
              'TablaRespuestas__header--oculto': columnaEstaColapsada(idEncuestaSeleccionada, nombre, columnasColapsadas)
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

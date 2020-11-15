import React from 'react'
import classNames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import './HeadTablaRespuestas.css'
import { ordenaRespuestas } from '../../../../../redux/ducks/respuestas'
import Icon from '@iconify/react'
import triangulito from '@iconify/icons-mdi/arrow-down-drop'

const HeadTablaRespuestas = () => {

  const { headers } = useSelector(state => state.encuestas)
  const { orden, ordenHeader } = useSelector(state => state.respuestas)
  const dispatch = useDispatch()

  if (!headers) {
    return null
  }

  return (
    <thead className="HeadTablaRespuestas">
      <tr className="HeadTablaRespuestas__fila">
        {headers.map(({ nombre, texto }) => (
          <th
            key={`header-${nombre}`}
            className={classNames({
              'HeadTablaRespuestas__header': true,
            })}
            title={texto}
            onClick={() => dispatch(ordenaRespuestas(nombre))}
          >
            <div className="HeadTablaRespuestas__texto_header">
              {texto}
              {ordenHeader === nombre && orden === 'ASC' &&
                <Icon icon={triangulito} className="HeaderTablaRespuestas__icono_orden" />
              }
              {ordenHeader === nombre && orden === 'DESC' &&
                <Icon icon={triangulito} className="HeaderTablaRespuestas__icono_orden HeaderTablaRespuestas__icono_orden--girado" />
              }
            </div>
          </th>
        ))}
      </tr>
    </thead>
  )
}

export default HeadTablaRespuestas

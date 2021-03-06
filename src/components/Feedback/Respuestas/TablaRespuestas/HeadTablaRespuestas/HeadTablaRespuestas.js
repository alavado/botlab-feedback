import React, { useMemo, useState } from 'react'
import classNames from 'classnames'
import { useSelector } from 'react-redux'
import './HeadTablaRespuestas.css'
import { InlineIcon } from '@iconify/react'
import triangulito from '@iconify/icons-mdi/arrow-down-drop'
import ModalFiltros from '../ModalFiltros'

const HeadTablaRespuestas = () => {

  const { headers } = useSelector(state => state.encuestas)
  const [modalFiltroActivo, setModalFiltroActivo] = useState(false)
  const [indiceColumnaFiltrada, setIndiceColumnaFiltrada] = useState(0)

  const headersOrdenados = useMemo(() => {
    return headers ? [...headers.filter(h => h.tipo === 'YESNO'), ...headers.filter(h => h.tipo !== 'YESNO')] : []
  }, [headers])

  const mostrarModalFiltros = indiceColumna => {
    setIndiceColumnaFiltrada(indiceColumna)
    setModalFiltroActivo(true)
  }

  return (
    <thead className="HeadTablaRespuestas">
      <tr className="HeadTablaRespuestas__fila">
        {headersOrdenados.map(({ nombre, texto }, i) => (
          <th
            key={`header-${nombre}`}
            className={classNames({
              'HeadTablaRespuestas__header': true,
              'HeadTablaRespuestas__header--activo': modalFiltroActivo && i === indiceColumnaFiltrada,
            })}
            onClick={() => mostrarModalFiltros(i)}
            title={texto}
          >
            <div className="HeadTablaRespuestas__texto_header">
              {texto}
              <button className="HeaderTablaRespuestas__boton_filtros">
                <InlineIcon icon={triangulito} className="HeaderTablaRespuestas__icono_filtros" />
              </button>
              {/* {ordenHeader === nombre && orden === 'ASC' &&
                <InlineIcon icon={triangulito} className="HeaderTablaRespuestas__icono_orden" />
              }
              {ordenHeader === nombre && orden === 'DESC' &&
                <InlineIcon icon={triangulito} className="HeaderTablaRespuestas__icono_orden HeaderTablaRespuestas__icono_orden--girado" />
              } */}
            </div>
          </th>
        ))}
      </tr>
      <ModalFiltros
        i={indiceColumnaFiltrada}
        header={headersOrdenados[indiceColumnaFiltrada]}
        activo={modalFiltroActivo}
        containerClass="HeadTablaRespuestas__header"
        esconder={() => setModalFiltroActivo(false)}
      />
    </thead>
  )
}

export default HeadTablaRespuestas

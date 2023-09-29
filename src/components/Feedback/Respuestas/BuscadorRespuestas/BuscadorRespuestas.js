import { Icon } from '@iconify/react'
import './BuscadorRespuestas.css'
import { useDispatch, useSelector } from 'react-redux'
import { buscaEsto } from '../../../../redux/ducks/respuestas'
import classNames from 'classnames'
import _ from 'lodash'
import useAnalytics from '../../../../hooks/useAnalytics'
import { useRef } from 'react'

const BuscadorRespuestas = ({ cargando }) => {

  const { busqueda } = useSelector(state => state.respuestas)
  const dispatch = useDispatch()
  const track = useAnalytics()

  const trackBusqueda = useRef(_.debounce(termino => track('Feedback', 'Respuestas', 'buscarEnTabla', { termino }), 2_000)).current

  return (
    <div className="BuscadorRespuestas">
      <div
        className="BuscadorRespuestas__contenedor_icono"
        onClick={() => {
          track('Feedback', 'Respuestas', 'limpiarBusquedaTabla')
          dispatch(buscaEsto(''))
        }}
        style={{ pointerEvents: busqueda ? 'all' : 'none', opacity: cargando ? .5 : .75 }}
        title="Limpiar filtro"
      >
        <Icon
          icon={busqueda ? "mdi:close" : "mdi:filter-variant"}
          className="BuscadorRespuestas__icono"
        />
      </div>
      <input
        type="text"
        className={classNames({
          BuscadorRespuestas__input: true,
          'BuscadorRespuestas__input--activo': busqueda,
        })}
        value={busqueda}
        onChange={e => {
          trackBusqueda(e.target.value)
          dispatch(buscaEsto(e.target.value))
        }}
        spellCheck="false"
        disabled={cargando}
        placeholder="Filtrar tabla"
      />
    </div>
  )
}

export default BuscadorRespuestas

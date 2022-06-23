import { Icon } from '@iconify/react'
import './BuscadorRespuestas.css'
import { useDispatch, useSelector } from 'react-redux'
import { buscaEsto } from '../../../../redux/ducks/respuestas'
import classNames from 'classnames'
import _ from 'lodash'
import useAnalytics from '../../../../hooks/useAnalytics'

const BuscadorRespuestas = ({ cargando }) => {

  const { busqueda } = useSelector(state => state.respuestas)
  const dispatch = useDispatch()
  const track = useAnalytics()

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
          icon={busqueda ? "mdi:close" : "mdi:text-search"}
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
          _.debounce(() => track('Feedback', 'Respuestas', 'buscarEnTabla', { termino: e.target.value }), 2_000)
          dispatch(buscaEsto(e.target.value))
        }}
        spellCheck="false"
        disabled={cargando}
        placeholder="Buscar en tabla"
      />
    </div>
  )
}

export default BuscadorRespuestas

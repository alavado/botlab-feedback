import { useDispatch, useSelector } from 'react-redux'
import { agregaFiltro, remueveFiltroPorNombre } from '../../../../../redux/ducks/respuestas'
import './FiltrosExtra.css'

const FiltrosExtra = () => {

  const dispatch = useDispatch()
  const { idEncuestaSeleccionada } = useSelector(state => state.encuestas)

  const zonas = [
    'Zona A',
    'Zona B',
    'Zona C',
  ]

  const seleccionarZona = zona => {
    if (zona === 'todas') {
      dispatch(remueveFiltroPorNombre('zone'))
    }
    else {
      dispatch(agregaFiltro({
        busqueda: zona,
        nombreHeader: 'zone',
        textoHeader: 'Zona Externo',
        idEncuesta: idEncuestaSeleccionada,
        opciones: {
          filtroImplicito: true
        }
      }))
    }
  }

  return (
    <div className="FiltrosExtra">
      <select
        onChange={e => seleccionarZona(e.target.value)}
      >
        <option value="todas">Todas las zonas</option>
        {zonas.map(zona => <option value={zona}>{zona}</option>)}
      </select>
    </div>
  )
}

export default FiltrosExtra
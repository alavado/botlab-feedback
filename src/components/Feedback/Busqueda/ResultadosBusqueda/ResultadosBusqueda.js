import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { comienzaBusqueda, guardaResultadosBusqueda } from '../../../../redux/ducks/busqueda'
import TarjetaResultadoBusqueda from './TarjetaResultadoBusqueda'
import Icon from '@iconify/react'
import iconoBuscar from '@iconify/icons-mdi/search'
import './ResultadosBusqueda.css'
import LoaderResultadosBusqueda from './LoaderResultadosBusqueda'
import { useHistory, useParams } from 'react-router-dom'
import { busqueda as busquedaAPI } from '../../../../api/endpoints'

const ResultadosBusqueda = () => {

  const { resultadosBusqueda } = useSelector(state => state.busqueda)
  const { termino } = useParams()
  const [terminoNuevaBusqueda, setTerminoNuevaBusqueda] = useState(termino)
  const dispatch = useDispatch()
  const history = useHistory()

  useEffect(() => {
    dispatch(comienzaBusqueda())
    busquedaAPI(termino)
      .then(res => {
        dispatch(guardaResultadosBusqueda(res.data))
      })
  }, [dispatch, termino])

  if (!resultadosBusqueda) {
    return <LoaderResultadosBusqueda />
  }

  const buscar = e => {
    e.preventDefault()
    history.push(`/busqueda/${terminoNuevaBusqueda}`)
  }

  return (
    <div className="ResultadosBusqueda">
      <div className="ResultadosBusqueda__contenedor_resultados">
        {resultadosBusqueda.map((r, i) => (
          <TarjetaResultadoBusqueda
            key={`resultado-busqueda-${i}`}
            resultado={r}
            posicion={i + 1}
          />
        ))}
      </div>
      <div className="ResultadosBusqueda__superior">
        <div className="ResultadosBusqueda__encontrados">
          Buscaste <span className="ResuladosBusqueda__termino">"{termino}"</span> - {resultadosBusqueda.length} chats encontrados
        </div>
        <form onSubmit={buscar}>
          <input
            className="ResultadosBusqueda__input_nueva_busqueda"
            onChange={e => setTerminoNuevaBusqueda(e.target.value)}
            value={terminoNuevaBusqueda}
          />
          <button className="ResultadosBusqueda__boton_nueva_busqueda" type="submit">
            <Icon icon={iconoBuscar} />
          </button>
        </form>
      </div>
      </div>
  )
}

export default ResultadosBusqueda

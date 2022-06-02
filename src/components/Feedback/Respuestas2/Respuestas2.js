import { useState } from 'react'
import ListaInteracciones from './ListaInteracciones'
import './Respuestas2.css'
import TabsEstadosInteracciones from './TabsEstadosInteracciones'
import TabsServicios from './TabsServicios'
import IndicadorFetchingGlobal from './IndicadorFetchingGlobal'
import { DateRange } from 'react-date-range'
import { es } from 'react-date-range/dist/locale'
import classNames from 'classnames'
import { useSelector } from 'react-redux'
import { InlineIcon } from '@iconify/react'
import iconoSucursal from '@iconify/icons-mdi/place'
import iconoSeleccionarSucursal from '@iconify/icons-mdi/triangle-small-down'

const Respuestas2 = () => {

  const { cajonFiltrosVisible } = useSelector(state => state.servicio)
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ])

  return (
    <div className="Respuestas2">
      <div className="Respuestas2__superior">
        <div className="Respuestas2__contenedor_start">
          <h1 className="Respuestas2__titulo">Feedback</h1>
          <IndicadorFetchingGlobal />
        </div>
        <div>
          <button>Usuario</button>
        </div>
        <div className="Respuestas2__selector_sucursal">
          <InlineIcon icon={iconoSucursal} />
          Todas las sucursales
          <InlineIcon icon={iconoSeleccionarSucursal} />
        </div>
      </div>
      <aside
        className={classNames({
          "Respuestas2__lateral": true,
          "Respuestas2__lateral--visible": cajonFiltrosVisible,
        })}
      >
        <p style={{ fontSize: '.65rem', paddingBottom: '.5rem', width: '60ch' }}>
          Inicio interacción
        </p>
        <DateRange
          editableDateInputs={true}
          onChange={item => setState([item.selection])}
          moveRangeOnFirstSelection={false}
          ranges={state}
          locale={es}
        />
      </aside>
      <TabsServicios />
      <TabsEstadosInteracciones />
      <ListaInteracciones />
    </div>
  )
}

export default Respuestas2
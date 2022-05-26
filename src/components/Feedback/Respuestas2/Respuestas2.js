import { useState } from 'react'
import ListaInteracciones from './ListaInteracciones'
import './Respuestas2.css'
import TabsEstadosInteracciones from './TabsEstadosInteracciones'
import TabsServicios from './TabsServicios'
import { DateRange } from 'react-date-range'
import { es } from 'react-date-range/dist/locale'

const Respuestas2 = () => {

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
        <h1 className="Respuestas2__titulo">Interacciones</h1>
      </div>
      <aside className="Respuestas2__lateral">
        <p style={{ fontSize: '.65rem', paddingBottom: '.25rem' }}>Sucursal</p>
        <input />
        <div style={{ height: '1rem' }} />
        <p style={{ fontSize: '.65rem', paddingBottom: '.25rem' }}>Inicio interacción</p>
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
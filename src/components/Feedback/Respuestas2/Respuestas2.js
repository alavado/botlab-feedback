import { useState } from 'react'
import ListaInteracciones from './ListaInteracciones'
import './Respuestas2.css'
import TabsEstadosInteracciones from './TabsEstadosInteracciones'
import TabsServicios from './TabsServicios'
import IndicadorFetchingGlobal from './IndicadorFetchingGlobal'
import { DateRange } from 'react-date-range'
import { es } from 'react-date-range/dist/locale'
import Icon from '@iconify/react'
import iconoMenu from '@iconify/icons-mdi/menu'
import classNames from 'classnames'

const Respuestas2 = () => {

  const [ver, setVer] = useState(false)

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
        <button
          onClick={() => setVer(!ver)}
          className="Respuestas2__boton_menu"
        >
          <Icon icon={iconoMenu} />
        </button>
        <h1 className="Respuestas2__titulo">Interacciones</h1>
        <IndicadorFetchingGlobal />
      </div>
      <aside
        className={classNames({
          "Respuestas2__lateral": true,
          "Respuestas2__lateral--visible": ver,
        })}
      >
        <p style={{ fontSize: '.65rem', paddingBottom: '.5rem' }}>
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
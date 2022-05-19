import { useQuery } from 'react-query'
import Filtros2 from './Filtros2'
import ListaCitas2 from './ListaCitas2'
import './Respuestas2.css'
import SelectorEncuesta2 from './SelectorEncuesta2'
import SelectorFecha2 from './SelectorFecha2'

const Respuestas2 = () => {

  return (
    <div className="Respuestas2">
      <div className="Respuestas2__lateral">
        <h1 className="Respuestas2__titulo">Chats</h1>
        <SelectorFecha2 />
        <Filtros2 />
      </div>
      <main className="Respuestas2__principal">
        <SelectorEncuesta2 />
        <ListaCitas2 />
      </main>
    </div>
  )
}

export default Respuestas2
import ListaInteracciones from './ListaInteracciones'
import './Respuestas2.css'
import TabsEstadosInteracciones from './TabsEstadosInteracciones'
import TabsServicios from './TabsServicios'

const Respuestas2 = () => {

  return (
    <div className="Respuestas2">
      <aside className="Respuestas2__lateral">
        <h1>Interacciones</h1>
        <p>Aquí van los filtros</p>
      </aside>
      <TabsServicios />
      <TabsEstadosInteracciones />
      <ListaInteracciones />
    </div>
  )
}

export default Respuestas2
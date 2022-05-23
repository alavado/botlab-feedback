import ListaInteracciones from './ListaInteracciones'
import './Respuestas2.css'
import TabsEstadosInteracciones from './TabsEstadosInteracciones'
import TabsServicios from './TabsServicios'

const Respuestas2 = () => {

  return (
    <div className="Respuestas2">
      <TabsServicios />
      <TabsEstadosInteracciones />
      <ListaInteracciones />
    </div>
  )
}

export default Respuestas2
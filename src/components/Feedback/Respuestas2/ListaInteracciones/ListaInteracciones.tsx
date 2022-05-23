import { useInteraccionesQuery } from '../../../../api/hooks'
import './ListaInteracciones.css'

const ListaInteracciones = () => {

  const { data } = useInteraccionesQuery()

  console.log(data)

  return (
    <div className="ListaInteracciones">
      ListaInteracciones
    </div>
  )
}

export default ListaInteracciones
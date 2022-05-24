import { useInteraccionesQuery } from '../../../../api/hooks'
import './ListaInteracciones.css'

const ListaInteracciones = () => {

  const { data, isLoading } = useInteraccionesQuery()

  if (!data || isLoading) {
    return null
  }

  return (
    <div className="ListaInteracciones">
      {data.length}
    </div>
  )
}

export default ListaInteracciones
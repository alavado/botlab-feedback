import { InlineIcon } from '@iconify/react'
import { useIsFetching } from 'react-query'
import iconoActualizando from '@iconify/icons-mdi/loading'
import iconoActualizado from '@iconify/icons-mdi/cloud-check'
import './IndicadorFetchingGlobal.css'

const IndicadorFetchingGlobal = () => {

  const isFetching = useIsFetching()

  return (
    <div className="IndicadorFetchingGlobal">
      {isFetching
        ? <p className="IndicadorFetchingGlobal__cargando">
            Cargando...
            <InlineIcon
              className="IndicadorFetchingGlobal__icono IndicadorFetchingGlobal__icono--cargando"
              icon={iconoActualizando}
            />
          </p>
        : <p className="IndicadorFetchingGlobal__datos_actualizados">
            Datos actualizados
            <InlineIcon
              icon={iconoActualizado}
              className="IndicadorFetchingGlobal__icono"
            />
          </p>
      }
    </div>
  )
}

export default IndicadorFetchingGlobal
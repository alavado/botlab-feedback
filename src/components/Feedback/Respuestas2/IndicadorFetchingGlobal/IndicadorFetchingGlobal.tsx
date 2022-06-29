import { InlineIcon } from '@iconify/react'
import { useIsFetching } from 'react-query'
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
              icon="mdi:loading"
            />
          </p>
        : <p className="IndicadorFetchingGlobal__datos_actualizados">
            Datos actualizados
            <InlineIcon
              icon="mdi:cloud-check"
              className="IndicadorFetchingGlobal__icono"
            />
          </p>
      }
    </div>
  )
}

export default IndicadorFetchingGlobal
import { InlineIcon } from '@iconify/react'
import { useMemo, useState } from 'react'
import { useServiciosQuery } from '../../../../api/hooks'
import _ from 'lodash'
import './SelectorSucursalInteraccion.css'
import { useDispatch } from 'react-redux'
import { seleccionaSucursal } from '../../../../redux/ducks/sucursal'

const SelectorSucursalInteraccion = () => {

  const [indiceSucursalSeleccionada, setIndiceSucursalSeleccionada] = useState(0)
  const [selectorActivo, setSelectorActivo] = useState(false)
  const { data } = useServiciosQuery()
  const dispatch = useDispatch()

  const sucursales: string[] = useMemo(() => {
    if (!data) {
      return []
    }
    const sucursalesUnicas = _.uniq([data.map(servicio => servicio.sucursales)].flat(2))
    sucursalesUnicas.sort((s1, s2) => s1.localeCompare(s2) < 0 ? -1 : 1)
    return sucursalesUnicas
  }, [data])

  return (
    <div className="SelectorSucursalInteraccion">
      <button
        className="SelectorSucursalInteraccion__boton"
        onClick={() => setSelectorActivo(!selectorActivo)}
      >
        <InlineIcon icon="mdi:place" />
        {indiceSucursalSeleccionada === 0
          ? 'Todas las sucursales'
          : sucursales[indiceSucursalSeleccionada - 1]
        }
        <InlineIcon icon="mdi:triangle-small-down" />
      </button>
      {selectorActivo && (
        <div className="SelectorSucursalInteraccion__lista">
          <button
            key={`boton-sucursal-todas`}
            onClick={() => {
              setIndiceSucursalSeleccionada(0)
              setSelectorActivo(false)
              dispatch(seleccionaSucursal(undefined))
            }}
          >
            Todas las sucursales
          </button>
          {sucursales.map((sucursal, i) => (
            <button
              key={`boton-sucursal-${sucursal}`}
              onClick={() => {
                setIndiceSucursalSeleccionada(i + 1)
                setSelectorActivo(false)
                dispatch(seleccionaSucursal(sucursal))
              }}
            >
              {sucursal}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default SelectorSucursalInteraccion
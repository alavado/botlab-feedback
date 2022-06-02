import Icon, { InlineIcon } from '@iconify/react'
import classNames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../../redux/ducks'
import iconoCerrarCajon from '@iconify/icons-mdi/chevron-double-right'
import './CajonInteraccion.css'
import { escondeCajonInteraccion } from '../../../../redux/ducks/servicio'
import { useInteraccionActivaQuery } from '../../../../api/hooks'

const CajonInteraccion = () => {

  const { cajonInteraccionVisible } = useSelector((state: RootState) => state.servicio)
  const dispatch = useDispatch()

  const { data } = useInteraccionActivaQuery()

  if (!data) {
    return null
  }

  console.log(data)

  return null
  // return (
  //   <div className={classNames({
  //     "CajonInteraccion": true,
  //     "CajonInteraccion--visible": cajonInteraccionVisible
  //   })}>
  //     <button
  //       className={
  //         classNames({
  //           "CajonInteraccion__boton_cerrar": true,
  //           "CajonInteraccion__boton_cerrar--visible": cajonInteraccionVisible,
  //         })
  //       }
  //       onClick={e => {
  //         e.stopPropagation()
  //         dispatch(escondeCajonInteraccion())
  //       }}
  //     >
  //       <Icon icon={iconoCerrarCajon} />
  //     </button>
  //     <div className="CajonInteraccion__superior">
  //       <div
  //         className="CajonInteraccion__avatar"
  //         style={{ background: `hsl(${360 * ((data?.citas[0]?.nombre.toLowerCase().charCodeAt(0) - 97) / 25)}, 65%, 55%)` }}
  //       >
  //         {data?.citas[0]?.nombre[0]}
  //       </div>
  //       <h2 className="CajonInteraccion__titulo">{data?.citas[0]?.nombre} <InlineIcon icon={data?.citas[0]?.estadoInteraccion.icono} /></h2>
  //       <p className="CajonInteraccion__subtitulo">+555 55 555 234</p>
  //     </div>
  //     <div className="CajonInteraccion__mensajes">
        
  //     </div>
  //   </div>
  // )
}

export default CajonInteraccion
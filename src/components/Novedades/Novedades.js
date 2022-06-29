import { Icon, InlineIcon } from '@iconify/react'
import { createPortal } from 'react-dom'
import { useDispatch, useSelector } from 'react-redux'
import { desactivaModal } from '../../redux/ducks/novedades'
import { useState } from 'react'
import classNames from 'classnames'
import novedades from '../../helpers/novedades'
import './Novedades.css'

const Novedades = () => {

  const { modalActivo } = useSelector(state => state.novedades)
  const [novedadSeleccionada, setNovedadSeleccionada] = useState(0)
  const dispatch = useDispatch()

  if (!modalActivo) {
    return null
  }

  return createPortal(
    <div
      className="Novedades__fondo"
      onClick={() => dispatch(desactivaModal())}
    >
      <div
        className="Novedades"
        onClick={e => e.stopPropagation()}
      >
        <button
          className="Novedades__boton_cerrar"
          onClick={() => dispatch(desactivaModal())}
          title="Cerrar"
        >
          <InlineIcon icon="mdi:close" />
        </button>
        <h2 className="Novedades__subtitulo">{novedades.subtitulo}</h2>
        <h1 className="Novedades__titulo">{novedades.titulo}</h1>
        <div className="Novedades__contenedor_tabs">
          {novedades.lista.map((novedad, i) => (
            <button
              key={`boton-novedad-${i}`}
              onClick={() => setNovedadSeleccionada(i)}
              className={classNames({
                "Novedades__boton_novedad": true,
                "Novedades__boton_novedad--activo": i === novedadSeleccionada,
              })}
            >
              <Icon
                icon={novedad.icono}
                className={classNames({
                  "Novedades__icono_novedad": true,
                  "Novedades__icono_novedad--activa": i === novedadSeleccionada,
                })}
              />
              <h4 className="Novedades__titulo_novedad">{novedad.titulo}</h4>
              <p
                className={classNames({
                  "Novedades__subtitulo_novedad": true,
                  "Novedades__subtitulo_novedad--activo": i === novedadSeleccionada,
                })}
              >
                {novedad.subtitulo}
              </p>
            </button>
          ))}
          <img
            className="Novedades__imagen"
            src={novedades.lista[novedadSeleccionada].imagen}
            alt="Imagen animada explicando novedad"
          />
        </div>
      </div>
    </div>
  , document.getElementById('modal-novedades'))
}

export default Novedades
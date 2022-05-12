import Icon, { InlineIcon } from '@iconify/react'
import { createPortal } from 'react-dom'
import { useDispatch, useSelector } from 'react-redux'
import { desactivaModal } from '../../redux/ducks/novedades'
import iconoCerrar from '@iconify/icons-mdi/close'
import './Novedades.css'

import iconoNovedad1 from '@iconify/icons-mdi/audio'
import iconoNovedad2 from '@iconify/icons-mdi/comment-processing'
import iconoNovedad3 from '@iconify/icons-mdi/hand-pointing-right'

import imagenNovedad1 from '../../assets/images/novedades/1.gif'
import imagenNovedad2 from '../../assets/images/novedades/2.gif'
import imagenNovedad3 from '../../assets/images/novedades/3.gif'
import { useState } from 'react'
import classNames from 'classnames'

const titulo = '¡Audios y videos en Feedback!'
const subtitulo = 'Últimas novedades del servicio'

const novedades = [
  {
    titulo: 'Escucha audios y mira las imágenes y videos enviados por tus pacientes',
    icono: iconoNovedad1,
    subtitulo: 'Revisa audios, imágenes, videos, archivos y tarjetas de contacto enviados por tus pacientes',
    imagen: imagenNovedad1,
  },
  {
    titulo: 'Simplificamos el agregar comentarios a los chats (anteriormente se llamaban “notas”)',
    icono: iconoNovedad2,
    subtitulo: 'Este nuevo diseño te facilitará el proceso, y probablemente te resulte mucho más familiar',
    imagen: imagenNovedad2,
  },
  {
    titulo: 'Todas tus acciones en un solo lugar',
    icono: iconoNovedad3,
    subtitulo: 'Incorporamos una sección de acceso uniforme, junto a la vista del teléfono, con botones fáciles de reconocer',
    imagen: imagenNovedad3,
  }
]

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
          <InlineIcon icon={iconoCerrar} />
        </button>
        <h2 className="Novedades__subtitulo">{subtitulo}</h2>
        <h1 className="Novedades__titulo">{titulo}</h1>
        <div className="Novedades__contenedor_tabs">
          {novedades.map((novedad, i) => (
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
            src={novedades[novedadSeleccionada].imagen}
            alt="Imagen animada explicando novedad"
          />
        </div>
      </div>
    </div>
  , document.getElementById('modal-novedades'))
}

export default Novedades
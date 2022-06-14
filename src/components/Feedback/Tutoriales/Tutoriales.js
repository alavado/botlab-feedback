import classNames from 'classnames'
import { useState } from 'react'
import play from '@iconify/icons-mdi/play'
import './Tutoriales.css'
import { InlineIcon } from '@iconify/react'

const videos = [
  {
    titulo: 'Vista inicial de respuestas',
    duracion: '1:11',
    link: 'https://player.vimeo.com/video/714999233?autoplay=1',
    thumbnail: 'https://vumbnail.com/714999233_small.jpg',
  },
  {
    titulo: 'Vista detallada de chats',
    duracion: '0:53',
    link: 'https://player.vimeo.com/video/715018607?autoplay=1',
    thumbnail: 'https://vumbnail.com/715018607_small.jpg',
  },
  {
    titulo: 'Filtros simples',
    duracion: '0:41',
    link: 'https://player.vimeo.com/video/707563556?autoplay=1',
    thumbnail: 'https://vumbnail.com/707563556_small.jpg',
  },
  {
    titulo: 'Filtros específicos',
    duracion: '1:12',
    link: 'https://player.vimeo.com/video/710118003?autoplay=1',
    thumbnail: 'https://vumbnail.com/710118003_small.jpg',
  },
  {
    titulo: 'Confirmaciones por fecha',
    duracion: '0:49',
    link: 'https://player.vimeo.com/video/707555525?autoplay=1',
    thumbnail: 'https://vumbnail.com/707555525_small.jpg',
  },
  {
    titulo: 'Reportar un problema',
    duracion: '1:00',
    link: 'https://player.vimeo.com/video/707572633?autoplay=1',
    thumbnail: 'https://vumbnail.com/707572633_small.jpg',
  },
  {
    titulo: 'Agregar comentarios a un chat',
    duracion: '1:03',
    link: 'https://player.vimeo.com/video/707569196?autoplay=1',
    thumbnail: 'https://vumbnail.com/707569196_small.jpg',
  },
  {
    titulo: 'Audios',
    duracion: '0:44',
    link: 'https://player.vimeo.com/video/707567810?autoplay=1',
    thumbnail: 'https://vumbnail.com/707567810_small.jpg',
  },
  {
    titulo: 'Alertas',
    duracion: '1:05',
    link: 'https://player.vimeo.com/video/710113809?autoplay=1',
    thumbnail: 'https://vumbnail.com/710113809_small.jpg',
  },
  {
    titulo: 'Opciones de alertas',
    duracion: '1:03',
    link: 'https://player.vimeo.com/video/710116476?autoplay=1',
    thumbnail: 'https://vumbnail.com/710116476_small.jpg',
  },
  {
    titulo: 'Búsquedas',
    duracion: '0:55',
    link: 'https://player.vimeo.com/video/710120273?autoplay=1',
    thumbnail: 'https://vumbnail.com/710120273_small.jpg',
  },
]

const Tutoriales = () => {

  const [indiceVideoActivo, setIndiceVideoActivo] = useState(-1)

  return (
    <div className="Tutoriales">
      <h1 className="Tutoriales__titulo">Tutoriales</h1>
      <div className="Tutoriales__contenedor">
        <div className="Tutoriales__video">
          {indiceVideoActivo >= 0 
            ? <iframe
                title={videos[indiceVideoActivo].titulo}
                src={videos[indiceVideoActivo].link}
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              >
              </iframe>
            : <p className="Tutoriales__indicacion">Selecciona un video</p>
          }
        </div>
        <div>
          <div className="Tutoriales__titulo_playlist">
            <p>Tutoriales de Feedback</p>
            <p className="Tutoriales__conteo_playlist">{videos.length} videos</p>
          </div>
          <div className="Tutoriales__botones">
            {videos.map((video, i) => (
              <button
                onClick={() => setIndiceVideoActivo(i)}
                key={`boton-video-${i}`}
                className={classNames({
                  'Tutoriales__boton': true,
                  'Tutoriales__boton--activo': indiceVideoActivo === i,
                })}
              >
                <p className="Tutoriales__miniatura_numero">
                  {i === indiceVideoActivo ? <InlineIcon icon={play} /> : (i + 1)}
                </p>
                <div
                  className="Tutoriales__miniatura"
                  style={{ backgroundImage: `url(${video.thumbnail})` }}
                >
                  <p className="Tutoriales__miniatura_duracion">{video.duracion}</p>
                </div>
                <p className="Tutoriales__titulo_miniatura">{video.titulo}</p>
                <p className="Tutoriales__autor">Jorge Pérez</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Tutoriales
import classNames from 'classnames'
import { useState } from 'react'
import './Tutoriales.css'

const videos = [
  {
    titulo: 'Confirmaciones por fecha',
    link: 'https://player.vimeo.com/video/707555525?h=d41f18602a'
  },
  {
    titulo: 'Filtros simples',
    link: 'https://player.vimeo.com/video/707563556?h=202cf81392'
  },
  {
    titulo: 'Filtros específicos',
    link: 'https://player.vimeo.com/video/710118003?h=c24e9a7220'
  },
  {
    titulo: 'Audios',
    link: 'https://player.vimeo.com/video/707567810?h=df51a47072'
  },
  {
    titulo: 'Agregar comentarios a un chat',
    link: 'https://player.vimeo.com/video/707569196?h=222e75a7d0'
  },
  {
    titulo: 'Reportar problema',
    link: 'https://player.vimeo.com/video/707572633?h=dbb41fa1ba'
  },
  {
    titulo: 'Alertas',
    link: 'https://player.vimeo.com/video/710113809?h=3a2aec83d9'
  },
  {
    titulo: 'Opciones de alertas',
    link: 'https://player.vimeo.com/video/710116476?h=5ed08da1cd'
  },
  {
    titulo: 'Búsquedas',
    link: 'https://player.vimeo.com/video/710120273?h=f88e896d46'
  },
]

const Tutoriales = () => {

  const [indiceVideoActivo, setIndiceVideoActivo] = useState(0)

  const { link, titulo } = videos[indiceVideoActivo]

  return (
    <div className="Tutoriales">
      <h1 className="Tutoriales__titulo">Tutoriales</h1>
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
            {video.titulo}
          </button>
        ))}
      </div>
      <div className="Tutoriales__video">
        <iframe
          title={titulo}
          src={link}
          frameBorder="0" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen></iframe>
      </div>
    </div>
  )
}

export default Tutoriales
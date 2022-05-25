import { useState } from 'react'
import './Tutoriales.css'

const videos = [
  {
    titulo: 'Búsquedas',
    link: 'https://player.vimeo.com/video/710120273?h=f88e896d46'
  },
  {
    titulo: 'Filtros específicos',
    link: 'https://player.vimeo.com/video/710118003?h=c24e9a7220'
  },
  {
    titulo: 'Opciones de alertas',
    link: 'https://player.vimeo.com/video/710116476?h=5ed08da1cd'
  },
  {
    titulo: 'Reportar problema',
    link: 'https://player.vimeo.com/video/707572633?h=dbb41fa1ba'
  },
  {
    titulo: 'Agregar comentarios a un chat',
    link: 'https://player.vimeo.com/video/707569196?h=222e75a7d0'
  },
  {
    titulo: 'Filtros simples',
    link: 'https://player.vimeo.com/video/707563556?h=202cf81392'
  },
  {
    titulo: 'Confirmaciones por fecha',
    link: 'https://player.vimeo.com/video/707555525?h=d41f18602a'
  },
]

const Tutoriales = () => {

  const [indiceVideoActivo, setIndiceVideoActivo] = useState(0)

  const { link, titulo } = videos[indiceVideoActivo]

  return (
    <div className="Tutoriales">
      <h1>Tutoriales</h1>
      {videos.map((video, i) => (
        <button
          onClick={() => setIndiceVideoActivo(i)}
          key={`boton-video-${i}`}
        >
          {video.titulo}
        </button>
      ))}
      <div className="Tutoriales__videos">
        <iframe
          title={titulo}
          src={link}
          frameBorder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
      </div>
    </div>
  )
}

export default Tutoriales
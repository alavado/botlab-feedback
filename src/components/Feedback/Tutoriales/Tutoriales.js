import './Tutoriales.css'
import { Icon, InlineIcon } from '@iconify/react'
import logoCero from '../../../assets/images/logo.png'
import { NavLink, Route, Switch } from 'react-router-dom'

const videos = [
  {
    titulo: 'Vista inicial de respuestas',
    duracion: '1:11',
    link: 'https://player.vimeo.com/video/714999233?autoplay=1',
    thumbnail: 'https://vumbnail.com/714999233_small.jpg',
    id: 'respuestas',
  },
  {
    titulo: 'Vista detallada de chats',
    duracion: '0:53',
    link: 'https://player.vimeo.com/video/715018607?autoplay=1',
    thumbnail: 'https://vumbnail.com/715018607_small.jpg',
    id: 'chats',
  },
  {
    titulo: 'Filtros simples',
    duracion: '0:41',
    link: 'https://player.vimeo.com/video/707563556?autoplay=1',
    thumbnail: 'https://vumbnail.com/707563556_small.jpg',
    id: 'filtros-simples',
  },
  {
    titulo: 'Filtros específicos',
    duracion: '1:12',
    link: 'https://player.vimeo.com/video/710118003?autoplay=1',
    thumbnail: 'https://vumbnail.com/710118003_small.jpg',
    id: 'filtros-especificos',
  },
  {
    titulo: 'Confirmaciones por fecha',
    duracion: '0:49',
    link: 'https://player.vimeo.com/video/707555525?autoplay=1',
    thumbnail: 'https://vumbnail.com/707555525_small.jpg',
    id: 'confirmaciones-por-fecha',
  },
  {
    titulo: 'Reportar un problema',
    duracion: '1:00',
    link: 'https://player.vimeo.com/video/707572633?autoplay=1',
    thumbnail: 'https://vumbnail.com/707572633_small.jpg',
    id: 'reportar-problemas',
  },
  {
    titulo: 'Agregar notas a un chat',
    duracion: '1:03',
    link: 'https://player.vimeo.com/video/707569196?autoplay=1',
    thumbnail: 'https://vumbnail.com/707569196_small.jpg',
    id: 'comentarios',
  },
  {
    titulo: 'Audios',
    duracion: '0:44',
    link: 'https://player.vimeo.com/video/707567810?autoplay=1',
    thumbnail: 'https://vumbnail.com/707567810_small.jpg',
    id: 'audios',
  },
  {
    titulo: 'Alertas',
    duracion: '1:05',
    link: 'https://player.vimeo.com/video/710113809?autoplay=1',
    thumbnail: 'https://vumbnail.com/710113809_small.jpg',
    id: 'alertas',
  },
  {
    titulo: 'Opciones de alertas',
    duracion: '1:03',
    link: 'https://player.vimeo.com/video/710116476?autoplay=1',
    thumbnail: 'https://vumbnail.com/710116476_small.jpg',
    id: 'opciones-alertas',
  },
  {
    titulo: 'Búsquedas',
    duracion: '0:55',
    link: 'https://player.vimeo.com/video/710120273?autoplay=1',
    thumbnail: 'https://vumbnail.com/710120273_small.jpg',
    id: 'busquedas',
  },
]

const Tutoriales = () => {
  return (
    <div className="Tutoriales">
      <h1 className="Tutoriales__titulo">Tutoriales</h1>
      <div className="Tutoriales__contenedor">
        <div className="Tutoriales__video">
          <Switch>
            {videos.map((video) => (
              <Route
                path={`/tutoriales/${video.id}`}
                key={`ruta-tutorial-${video.id}`}
              >
                <div className="Tutoriales__contenedor_video_con_titulo">
                  <h2 className="Tutoriales__contenedor_video_titulo">
                    <Icon icon="mdi:information" />
                    Estás viendo:{' '}
                    <span style={{ fontWeight: 'bold' }}>{video.titulo}</span>
                  </h2>
                  <iframe
                    title={video.titulo}
                    src={video.link}
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </Route>
            ))}
            <Route>
              <div className="Tutoriales__indicacion">
                <NavLink
                  to={`/tutoriales/${videos[0].id}`}
                  className="Tutoriales__boton_indicacion"
                >
                  <Icon icon="mdi:playlist-play" />
                </NavLink>
                <p>Selecciona un video de la lista</p>
              </div>
            </Route>
          </Switch>
        </div>
        <div>
          <div className="Tutoriales__titulo_playlist">
            <p>Tutoriales de Feedback</p>
            <p className="Tutoriales__conteo_playlist">
              {videos.length} videos
            </p>
          </div>
          <div className="Tutoriales__botones">
            {videos.map((video, i) => (
              <NavLink
                to={`/tutoriales/${video.id}`}
                key={`boton-video-${i}`}
                className="Tutoriales__boton"
                activeClassName="Tutoriales__boton--activo"
              >
                <p className="Tutoriales__miniatura_numero">
                  <InlineIcon
                    className="Tutoriales__miniatura_play"
                    icon="mdi:play"
                  />{' '}
                  <span className="Tutoriales__miniatura_n">{i + 1}</span>
                </p>
                <div
                  className="Tutoriales__miniatura"
                  style={{ backgroundImage: `url(${video.thumbnail})` }}
                >
                  <p className="Tutoriales__miniatura_duracion">
                    {video.duracion}
                  </p>
                </div>
                <p className="Tutoriales__titulo_miniatura">{video.titulo}</p>
                <p className="Tutoriales__autor">Jorge Pérez</p>
              </NavLink>
            ))}
            <img
              className="Tutoriales__bajada_relleno"
              src={logoCero}
              alt="Logo de Cero"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Tutoriales

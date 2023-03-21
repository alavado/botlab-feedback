import imagenNovedad1 from '../assets/images/novedades/1.gif'
import imagenNovedad2 from '../assets/images/novedades/2.gif'
import imagenNovedad3 from '../assets/images/novedades/3.gif'

const novedades = {
  titulo: '¡Audios y videos en Feedback!',
  subtitulo: 'Últimas novedades del servicio',
  lista: [
    {
      titulo:
        'Escucha audios y mira las imágenes y videos enviados por tus pacientes',
      icono: 'mdi:audio',
      subtitulo:
        'Revisa audios, imágenes, videos, archivos y tarjetas de contacto enviados por tus pacientes',
      imagen: imagenNovedad1,
    },
    {
      titulo:
        'Simplificamos el agregar comentarios a los chats (anteriormente se llamaban “notas”)',
      icono: 'mdi:comment-processing',
      subtitulo:
        'Este nuevo diseño te facilitará el proceso, y probablemente te resulte mucho más familiar',
      imagen: imagenNovedad2,
    },
    {
      titulo: 'Todas tus acciones en un solo lugar',
      icono: 'mdi:hand-pointing-right',
      subtitulo:
        'Incorporamos una sección de acceso uniforme, junto a la vista del teléfono, con botones fáciles de reconocer',
      imagen: imagenNovedad3,
    },
  ],
}

export default novedades

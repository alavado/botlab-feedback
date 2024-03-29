import { useState } from 'react'
import { format, parseISO } from 'date-fns'
import { Icon, InlineIcon } from '@iconify/react'
import classNames from 'classnames'
import { es } from 'date-fns/locale'
import Linkify from 'react-linkify'
import nl2br from 'react-newline-to-break'
import './MensajeWhatsapp.css'
import { scrambleMulti } from '../../../../../Scrambler/scramblers'
import { useSelector } from 'react-redux'
import { obtenerContenidoMultimedia } from '../../../../../../api/endpoints'
import axios from 'axios'
import { marcarNegritas } from '../../../../../../helpers/mensajes'
import useWhatsappLink from '../../../../../../hooks/useWhatsappLink'

const extensionesImagenes = ['png', 'jpg', 'jpeg', 'gif', 'bmp']
const tokenAdjunto = 'ATTACHMENT:'

const MensajeWhatsapp = ({ mensaje, mensajes, posicion }) => {
  const ts = parseISO(mensaje.timestamp)
  const horaMensaje = format(ts, 'HH:mm')
  const fechaMensaje = format(ts, "d 'de' MMMM 'de' yyyy", { locale: es })
  const horaFechamensaje = format(ts, "d MMM yy',' HH:mm", { locale: es })
  const diaMensaje = format(ts, 'd')
  const diaMensajeAnterior =
    posicion > 0 && format(parseISO(mensajes[posicion - 1].timestamp), 'd')
  const mostrarFecha = posicion === 0 || diaMensaje !== diaMensajeAnterior
  const mensajeEsDeHumano = mensaje.type !== 'bot'
  const { cuenta } = useSelector((state) => state.login)
  const { debugging } = useSelector((state) => state.cero)

  let componenteMensaje
  switch (mensaje.message) {
    case 'MEDIAIMAGEURL':
      componenteMensaje = (
        <MensajeImagen
          mensaje={mensaje}
          esDeHumano={mensajeEsDeHumano}
          hora={horaMensaje}
        />
      )
      break
    case 'MEDIAAUDIOURL':
      componenteMensaje = (
        <MensajeAudio
          mensaje={mensaje}
          esDeHumano={mensajeEsDeHumano}
          hora={horaMensaje}
        />
      )
      break
    case 'MEDIAFILEURL':
      componenteMensaje = (
        <MensajeArchivo
          mensaje={mensaje}
          esDeHumano={mensajeEsDeHumano}
          hora={horaMensaje}
        />
      )
      break
    case 'MEDIAVCARDURL':
      componenteMensaje = (
        <MensajeContacto
          mensaje={mensaje}
          esDeHumano={mensajeEsDeHumano}
          hora={horaMensaje}
        />
      )
      break
    case 'MEDIAVIDEOURL':
      componenteMensaje = (
        <MensajeVideo
          mensaje={mensaje}
          esDeHumano={mensajeEsDeHumano}
          hora={horaMensaje}
        />
      )
      break
    default:
      componenteMensaje = (
        <MensajeTexto
          mensaje={mensaje}
          esDeHumano={mensajeEsDeHumano}
          hora={horaMensaje}
        />
      )
  }

  return (
    <div className="MensajeWhatsapp">
      {mostrarFecha && <Fecha fecha={fechaMensaje} />}
      <Globo
        esDeHumano={mensajeEsDeHumano}
        posicion={posicion}
        hora={horaFechamensaje}
      >
        {componenteMensaje}
        <Hora hora={horaMensaje} esDeHumano={mensajeEsDeHumano} />
        {mensaje.tag && (
          <div
            className={classNames({
              MensajeWhatsapp__tag: true,
              'MensajeWhatsapp__tag--visible':
                debugging &&
                (cuenta.endsWith('cero') || cuenta.endsWith('botlab')),
            })}
          >
            🤖 {mensaje.tag}
          </div>
        )}
      </Globo>
    </div>
  )
}

const Fecha = ({ fecha }) => (
  <div className="MensajeWhatsapp__fecha">{fecha}</div>
)

const Globo = ({ esDeHumano, posicion, hora, children }) => (
  <div
    className={classNames({
      MensajeWhatsapp__globo: true,
      'MensajeWhatsapp__globo--saliente': !esDeHumano,
      'MensajeWhatsapp__globo--entrante': esDeHumano,
    })}
  >
    <div className="MensajeWhatsapp__titulo">
      <div>{esDeHumano ? 'Usuario' : 'Bot'}</div>
      <div className="MensajeWhatsapp__titulo_hora">{hora}</div>
    </div>
    {children}
  </div>
)

const MensajeTexto = ({ mensaje, hora, esDeHumano }) => {
  const { terminos, scrambled } = useSelector((state) => state.scrambler)

  return (
    <div className="MensajeWhatsapp__texto">
      {mensaje.message.indexOf(tokenAdjunto) >= 0 ? (
        <MensajeConAdjunto mensaje={mensaje.message} />
      ) : (
        <Linkify>
          <span className="MensajeWhatsapp__texto_nl2br">
            {marcarNegritas(
              nl2br(
                scrambled
                  ? scrambleMulti(mensaje.message, terminos)
                  : mensaje.message
              )
            )}
          </span>
        </Linkify>
      )}
      <Hora hora={hora} escondida={true} esDeHumano={esDeHumano} />
    </div>
  )
}

const MensajeImagen = ({ mensaje, hora, esDeHumano }) => {
  const [urlImagen, setUrlImagen] = useState('')
  const [huboError, setHuboError] = useState(false)

  const verImagen = async () => {
    try {
      const data = await obtenerContenidoMultimedia(mensaje.answer_id)
      setUrlImagen(data.data.data.url)
    } catch (err) {
      setHuboError(true)
    }
  }

  if (huboError) {
    return (
      <p className="MensajeWhatsapp__error_multimedia">Imagen no disponible</p>
    )
  }

  return urlImagen ? (
    <img
      className="MensajeWhatsapp__imagen"
      src={urlImagen}
      alt="imagen para descargar"
    />
  ) : (
    <button
      className="MensajeWhatsapp__placeholder_imagen"
      onClick={() => verImagen()}
      title="Ver imagen"
    >
      <p className="MensajeWhatsapp__texto_placeholder_imagen">
        <InlineIcon icon="mdi:image" /> Ver imagen
      </p>
    </button>
  )
}

const MensajeAudio = ({ mensaje, hora, esDeHumano }) => {
  const [urlAudio, setUrlAudio] = useState('')
  const [huboError, setHuboError] = useState(false)
  const [cargandoAudio, setCargandoAudio] = useState(false)

  const verAudio = async () => {
    setCargandoAudio(true)
    try {
      const data = await obtenerContenidoMultimedia(mensaje.answer_id)
      setUrlAudio(data.data.data.url)
      setCargandoAudio(false)
    } catch (err) {
      setHuboError(true)
      setCargandoAudio(false)
    }
  }

  if (huboError) {
    return (
      <p className="MensajeWhatsapp__error_multimedia">Audio no disponible</p>
    )
  }

  return urlAudio ? (
    <audio
      className="MensajeWhatsapp__audio"
      src={urlAudio}
      alt="imagen gato"
      controls
    />
  ) : (
    <button
      onClick={() => verAudio()}
      className="MensajeWhatsapp__placeholder_audio"
    >
      <InlineIcon
        className={classNames({
          MensajeWhatsapp__placeholder_icono_reproducir_audio: true,
          'MensajeWhatsapp__placeholder_icono_reproducir_audio--cargando':
            cargandoAudio,
        })}
        icon={cargandoAudio ? 'mdi:loading' : 'mdi:play'}
      />
      <div className="MensajeWhatsapp__trackbar"></div>
    </button>
  )
}

const MensajeVideo = ({ mensaje, hora, esDeHumano }) => {
  const [urlImagen, setUrlImagen] = useState('')
  const [huboError, setHuboError] = useState(false)

  const verImagen = async () => {
    try {
      const data = await obtenerContenidoMultimedia(mensaje.answer_id)
      setUrlImagen(data.data.data.url)
    } catch (err) {
      setHuboError(true)
    }
  }

  if (huboError) {
    return (
      <p className="MensajeWhatsapp__error_multimedia">Video no disponible</p>
    )
  }

  return urlImagen ? (
    <video
      className="MensajeWhatsapp__video"
      src={urlImagen}
      alt="imagen gato"
      controls
    />
  ) : (
    <button
      className="MensajeWhatsapp__placeholder_imagen"
      onClick={() => verImagen()}
      title="Ver imagen"
    >
      <p className="MensajeWhatsapp__texto_placeholder_imagen">
        <InlineIcon icon="mdi:video" /> Ver video
      </p>
    </button>
  )
}

const MensajeArchivo = ({ mensaje }) => {
  const [huboError, setHuboError] = useState(false)

  const descargarArchivo = async () => {
    try {
      const data = await obtenerContenidoMultimedia(mensaje.answer_id)
      const elemento = document.createElement('a')
      elemento.setAttribute('target', '_blank')
      elemento.setAttribute('href', data.data.data.url)
      elemento.style.display = 'none'
      document.body.appendChild(elemento)
      elemento.click()
      document.body.removeChild(elemento)
    } catch (err) {
      setHuboError(true)
    }
  }

  if (huboError) {
    return (
      <p className="MensajeWhatsapp__error_multimedia">Archivo no disponible</p>
    )
  }

  return (
    <button
      className="MensajeWhatsapp__boton_descargar_archivo"
      onClick={descargarArchivo}
    >
      Descargar Archivo
      <InlineIcon
        className="MensajeWhatsapp__icono_descargar_archivo"
        icon="mdi:download-circle-outline"
      />
    </button>
  )
}

const MensajeContacto = ({ mensaje }) => {
  const [huboError, setHuboError] = useState(false)
  const [telefonoContacto, setTelefonoContacto] = useState()
  const whatsappLink = useWhatsappLink(telefonoContacto?.replace(/[^0-9]/g, ''))
  const [nombreContacto, setNombreContacto] = useState()

  const descargarArchivo = async () => {
    try {
      const data = await obtenerContenidoMultimedia(mensaje.answer_id)
      const contenidoVCARD = await axios.get(data.data.data.url)
      const partes = contenidoVCARD.data.split('\r\n').reduce((obj, linea) => {
        const [prop, valor] = linea.split(':')
        return { ...obj, [prop]: valor }
      }, {})
      Object.keys(partes).forEach((prop) => {
        if (prop.startsWith('TEL')) {
          setTelefonoContacto(partes[prop])
        } else if (prop === 'FN') {
          setNombreContacto(partes[prop])
        }
      })
    } catch (err) {
      setHuboError(true)
    }
  }

  if (huboError) {
    return (
      <p className="MensajeWhatsapp__error_multimedia">Archivo no disponible</p>
    )
  }

  if (nombreContacto) {
    return (
      <div className="MensajeWhatsapp__contenedor_contacto">
        <InlineIcon
          className="MensajeWhatsapp__icono_contacto"
          icon="mdi:person-circle"
        />
        <p>{nombreContacto}</p>
        {telefonoContacto && (
          <a href={whatsappLink} target="_blank" rel="noreferrer noopener">
            {telefonoContacto}
          </a>
        )}
      </div>
    )
  }

  return (
    <button
      className="MensajeWhatsapp__boton_contacto"
      onClick={descargarArchivo}
    >
      <InlineIcon
        className="MensajeWhatsapp__icono_contacto"
        icon="mdi:person-circle"
      />
      Haga click para ver contacto
    </button>
  )
}

const MensajeConAdjunto = ({ mensaje }) => {
  const { terminos, scrambled } = useSelector((state) => state.scrambler)
  const inicioAdjunto = mensaje.indexOf(tokenAdjunto) + tokenAdjunto.length
  const substringAdjunto = mensaje.substring(inicioAdjunto)
  const finAdjunto =
    substringAdjunto.search(/\s/) > 0
      ? substringAdjunto.search(/\s/)
      : substringAdjunto.length
  let urlArchivo = substringAdjunto.substring(0, finAdjunto)
  if (!urlArchivo.startsWith('http')) {
    urlArchivo = `https://${urlArchivo}`
  }
  const mensajeSinAdjunto =
    mensaje.substring(0, mensaje.indexOf(tokenAdjunto) - 1) +
    substringAdjunto.substring(finAdjunto)
  const nombreArchivo = decodeURIComponent(
    urlArchivo.substring(urlArchivo.lastIndexOf('/') + 1)
  )
  const extensionArchivo = nombreArchivo.substring(
    nombreArchivo.lastIndexOf('.') + 1
  )

  return (
    <div>
      {extensionesImagenes.includes(extensionArchivo) ? (
        <a
          target="_blank"
          rel="noreferrer noopener"
          className="MensajeWhatsapp__link_archivo"
          href={urlArchivo}
        >
          <img
            src={urlArchivo}
            className="MensajeWhatsapp__miniatura_imagen"
            alt="imagen indicación"
          />
        </a>
      ) : (
        <a
          target="_blank"
          rel="noreferrer noopener"
          className="MensajeWhatsapp__link_archivo"
          href={urlArchivo}
        >
          <div className="MensajeWhatsapp__icono_pdf">PDF</div>
          <div className="MensajeWhatsapp__nombre_archivo">
            {scrambled ? scrambleMulti(nombreArchivo, terminos) : nombreArchivo}
          </div>
          <div className="MensajeWhatsapp__icono_link">
            <Icon icon="mdi:arrow-down-bold" />
          </div>
        </a>
      )}
      {mensajeSinAdjunto.length > 0 && (
        <Linkify>
          {marcarNegritas(
            nl2br(
              scrambled
                ? scrambleMulti(mensajeSinAdjunto, terminos)
                : mensajeSinAdjunto
            )
          )}
        </Linkify>
      )}
    </div>
  )
}

const Hora = ({ hora, esDeHumano, escondida }) => {
  const [horas, minutos] = hora.split(':')
  const horasMenos =
    Number(process.env.REACT_APP_UTC_OFFSET) +
    new Date().getTimezoneOffset() / 60
  const horaAjustada = `${horas - horasMenos}:${minutos}`

  return (
    <div
      className={
        escondida ? 'MensajeWhatsapp__hora' : 'MensajeWhatsapp__hora_visible'
      }
    >
      {horaAjustada}
      {false && <Visto />}
    </div>
  )
}

const Visto = () => (
  <InlineIcon className="MensajeWhatsapp__icono_visto" icon="mdi:check-all" />
)

export default MensajeWhatsapp

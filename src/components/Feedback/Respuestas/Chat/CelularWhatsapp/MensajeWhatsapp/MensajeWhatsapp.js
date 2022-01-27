import React, { useState } from 'react'
import { format, parseISO } from 'date-fns'
import { Icon, InlineIcon } from '@iconify/react'
import iconoVisto from '@iconify/icons-mdi/check-all'
import iconoLinkExterno from '@iconify/icons-mdi/arrow-right-bold'
import classNames from 'classnames'
import { es } from 'date-fns/locale'
import Linkify from 'react-linkify'
import nl2br from 'react-newline-to-break'
import './MensajeWhatsapp.css'
import Scrambler from '../../../../../Scrambler/Scrambler'
import { scrambleMulti } from '../../../../../Scrambler/scramblers'
import { useSelector } from 'react-redux'
import { obtenerContenidoMultimedia } from '../../../../../../api/endpoints'
import iconoDescargar from '@iconify/icons-mdi/download'

const extensionesImagenes = ['png', 'jpg', 'jpeg', 'gif', 'bmp']
const tokenAdjunto = 'ATTACHMENT:'

const MensajeWhatsapp = ({ mensaje, mensajes, posicion }) => {

  const ts = parseISO(mensaje.timestamp)
  const horaMensaje = format(ts, 'HH:mm')
  const fechaMensaje = format(ts, 'd \'de\' MMMM \'de\' yyyy', { locale: es })
  const horaFechamensaje = format(ts, 'd MMM yy\',\' HH:mm', { locale: es })
  const diaMensaje = format(ts, 'd')
  const diaMensajeAnterior = posicion > 0 && format(parseISO(mensajes[posicion - 1].timestamp), 'd')
  const mostrarFecha = posicion === 0 || diaMensaje !== diaMensajeAnterior
  const mensajeEsDeHumano = mensaje.type !== 'bot'
  const { cuenta } = useSelector(state => state.login)
  const { debugging } = useSelector(state => state.cero)

  let componenteMensaje
  switch (mensaje.message) {
    case 'MEDIAIMAGEURL':
      componenteMensaje = <MensajeImagen mensaje={mensaje} esDeHumano={mensajeEsDeHumano} hora={horaMensaje} />
      break;  
    case 'MEDIAAUDIOURL':
      componenteMensaje = <MensajeAudio mensaje={mensaje} esDeHumano={mensajeEsDeHumano} hora={horaMensaje} />
      break;  
    case 'MEDIAFILEURL':
      componenteMensaje = <MensajeArchivo mensaje={mensaje} esDeHumano={mensajeEsDeHumano} hora={horaMensaje} />
      break;  
    case 'MEDIAVCARDURL':
      componenteMensaje = <MensajeContacto mensaje={mensaje} esDeHumano={mensajeEsDeHumano} hora={horaMensaje} />
      break;  
    case 'MEDIAVIDEOURL':
      componenteMensaje = <MensajeVideo mensaje={mensaje} esDeHumano={mensajeEsDeHumano} hora={horaMensaje} />
      break;  
    default:
      componenteMensaje = <MensajeTexto mensaje={mensaje} esDeHumano={mensajeEsDeHumano} hora={horaMensaje} />
  }

  return (
    <div className="MensajeWhatsapp">
      {mostrarFecha && <Fecha fecha={fechaMensaje} />}
      <Globo esDeHumano={mensajeEsDeHumano} posicion={posicion} hora={horaFechamensaje}>
        {componenteMensaje}
        <Hora hora={horaMensaje} esDeHumano={mensajeEsDeHumano} />
        {mensaje.tag && (
          <div
            className={classNames({
              "MensajeWhatsapp__tag": true,
              "MensajeWhatsapp__tag--visible": debugging && (cuenta.endsWith('cero') || cuenta.endsWith('botlab'))
            })}>
              🤖 {mensaje.tag}
            </div>
        )}
      </Globo>
    </div>
  )
}

const Fecha = ({ fecha }) => (
  <div className="MensajeWhatsapp__fecha">
    {fecha}
  </div>
)

const Globo = ({ esDeHumano, posicion, hora, children }) => (
  <div
    className={classNames({
      'MensajeWhatsapp__globo': true,
      'MensajeWhatsapp__globo--saliente': esDeHumano,
      'MensajeWhatsapp__globo--entrante': !esDeHumano
    })}
  >
    <div className="MensajeWhatsapp__titulo">
      <div>{esDeHumano ? 'Usuario' : 'Bot'}</div>
      <div className="MensajeWhatsapp__titulo_hora">{hora}</div>
    </div>
    {children}
  </div>
)

const marcar = texto => {
  return texto.map(t => {
    const partes = t.props.children[0].split('*')
    return {
      ...t,
      props: {
        ...t.props,
        children: [
          React.createElement(
            'span',
            [],
            partes.map((p, i) => 0 < i && i < partes.length - 1
              ? <strong
                  className="MensajeWhatsapp__strong"
                  key={Date.now()}
                >
                  <Scrambler tipo="multi">{p}</Scrambler>
                </strong>
              : p
            )
          ),
          ...t.props.children.slice(1)
        ]
      }
    }
  })
}

const MensajeTexto = ({ mensaje, hora, esDeHumano }) => {

  const { terminos, scrambled } = useSelector(state => state.scrambler)

  return (
    <div className="MensajeWhatsapp__texto">
      {mensaje.message.indexOf(tokenAdjunto) >= 0
        ? <MensajeConAdjunto mensaje={mensaje.message} />
        : <Linkify>
            <span className="MensajeWhatsapp__texto_nl2br">
              {marcar(nl2br(scrambled ? scrambleMulti(mensaje.message, terminos) : mensaje.message))}
            </span>
          </Linkify>
      }
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
    }
    catch (err) {
      setHuboError(true)
    }
  }

  if (huboError) {
    return <p className="MensajeWhatsapp__placeholder_error_imagen">Lo sentimos, imagen no se encuentra disponible</p>
  }

  return (
    urlImagen
     ? <img
        className="MensajeWhatsapp__imagen"
        src={urlImagen}
        alt="imagen para descargar"
      />
     : <button
        className="MensajeWhatsapp__placeholder_imagen"
        onClick={() => verImagen()}
        title="Ver imagen"
      >
        <p className="MensajeWhatsapp__texto_placeholder_imagen">
          <InlineIcon icon={iconoDescargar} /> Ver imagen
        </p>
      </button>
  )
}

const MensajeAudio = ({ mensaje, hora, esDeHumano }) => {
  
  const [urlImagen, setUrlImagen] = useState('')

  const verImagen = async () => {
    const data = await obtenerContenidoMultimedia(mensaje.answer_id)
    setUrlImagen(data.data.data.url)
  }

  return (
    urlImagen
     ? <audio className="MensajeWhatsapp__audio" src={urlImagen} alt="imagen gato" autoPlay controls />
     : <button onClick={() => verImagen()}>Reproducir audio</button>
  )
}

const MensajeVideo = ({ mensaje, hora, esDeHumano }) => {
  
  const [urlImagen, setUrlImagen] = useState('')

  const verImagen = async () => {
    const data = await obtenerContenidoMultimedia(mensaje.answer_id)
    setUrlImagen(data.data.data.url)
  }

  return (
    urlImagen
     ? <video className="MensajeWhatsapp__video" src={urlImagen} alt="imagen gato" controls />
     : <button
        className="MensajeWhatsapp__placeholder_imagen"
        onClick={() => verImagen()}
        title="Ver imagen"
      >
        <p className="MensajeWhatsapp__texto_placeholder_imagen">
          <InlineIcon icon={iconoDescargar} /> Ver video
        </p>
      </button>
  )
}

const MensajeArchivo = ({ mensaje, hora, esDeHumano }) => {
  return <p>Archivo</p>
}

const MensajeContacto = ({ mensaje, hora, esDeHumano }) => {
  return <p>Contacto</p>
}

const MensajeConAdjunto = ({ mensaje }) => {

  const { terminos, scrambled } = useSelector(state => state.scrambler)
  const inicioAdjunto = mensaje.indexOf(tokenAdjunto) + tokenAdjunto.length
  const substringAdjunto = mensaje.substring(inicioAdjunto)
  const finAdjunto = substringAdjunto.search(/\s/) > 0 ? substringAdjunto.search(/\s/) : substringAdjunto.length
  const urlArchivo = substringAdjunto.substring(0, finAdjunto)
  const mensajeSinAdjunto = mensaje.substring(0, mensaje.indexOf(tokenAdjunto) - 1) + substringAdjunto.substring(finAdjunto)
  const nombreArchivo = urlArchivo.substring(urlArchivo.lastIndexOf('/') + 1)
  const extensionArchivo = nombreArchivo.substring(nombreArchivo.lastIndexOf('.') + 1)

  return (
    <div>
      {extensionesImagenes.includes(extensionArchivo)
        ? <a
            target="_blank"
            rel="noreferrer noopener"
            className="MensajeWhatsapp__link_archivo"
            href={urlArchivo}
          >
            <img src={urlArchivo} className="MensajeWhatsapp__miniatura_imagen" alt="imagen indicación" />
          </a>
        : <a
            target="_blank"
            rel="noreferrer noopener"
            className="MensajeWhatsapp__link_archivo"
            href={urlArchivo}
          >
            <div className="MensajeWhatsapp__icono_pdf">
              PDF
            </div>
            <div className="MensajeWhatsapp__nombre_archivo">{scrambled ? scrambleMulti(nombreArchivo, terminos) : nombreArchivo}</div>
            <div className="MensajeWhatsapp__icono_link">
              <Icon icon={iconoLinkExterno} />
            </div>
          </a>
      }
      {mensajeSinAdjunto.length > 0 && <Linkify>{marcar(nl2br(scrambled ? scrambleMulti(mensajeSinAdjunto, terminos) : mensajeSinAdjunto))}</Linkify>}
    </div>
  )
}

const Hora = ({ hora, esDeHumano, escondida }) => {

  const [horas, minutos] = hora.split(':')
  const horasMenos = ((new Date().getTimezoneOffset() - 180) / 60)
  const horaAjustada = `${horas - horasMenos}:${minutos}`

  return (
    <div className={escondida ? 'MensajeWhatsapp__hora' : 'MensajeWhatsapp__hora_visible' }>
      {horaAjustada}
      {esDeHumano && <Visto />}
    </div>
  )
}

const Visto = () => (
  <InlineIcon
    className="MensajeWhatsapp__icono_visto"
    icon={iconoVisto}
  />
)

export default MensajeWhatsapp

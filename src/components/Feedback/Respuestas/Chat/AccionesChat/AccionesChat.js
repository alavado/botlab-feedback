import { Icon, InlineIcon } from '@iconify/react'
import { useEffect, useState, useRef, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  agregarMensajeAHilo,
  reportarASlack,
} from '../../../../../helpers/slack'
import logoCero from '../../../../../assets/images/logo-cero.svg'
import './AccionesChat.css'
import { guardaContacto } from '../../../../../redux/ducks/opciones'
import useAnalytics from '../../../../../hooks/useAnalytics'
import classNames from 'classnames'
import OutsideClickHandler from 'react-outside-click-handler'
import { fijaAbrirAppWhatsapp } from '../../../../../redux/ducks/respuestas'
import useWhatsappLink from '../../../../../hooks/useWhatsappLink'

const obtenerSonrisa = () => {
  const opciones = ['😀', '😊', '😄', '😁', '😃', '😉', '🙂']
  return opciones[Math.floor(Math.random() * opciones.length)]
}

const AccionesChat = ({ telefono, link }) => {
  const { nombreUsuario, cuenta } = useSelector((state) => state.login)
  const [formularioVisible, setFormularioVisible] = useState(false)
  const { tipos, idEncuestaSeleccionada } = useSelector(
    (state) => state.encuestas
  )
  const nombreEncuestaSeleccionada =
    tipos.find(({ id }) => id === idEncuestaSeleccionada)?.nombre || '?'
  const [tipo, setTipo] = useState('Bot se equivoca')
  const [descripcion, setDescripcion] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState()
  const [ts, setTs] = useState(0)
  const { contacto: contactoGuardado } = useSelector((state) => state.opciones)
  const [contacto, setContacto] = useState(contactoGuardado || '')
  const [contactoEnviado, setContactoEnviado] = useState(false)
  const refDescripcion = useRef()
  const refContacto = useRef()
  const dispatch = useDispatch()
  const track = useAnalytics()
  const { abrirAppWhatsapp } = useSelector((state) => state.respuestas)
  const [seleccionandoModoWhatsapp, setSeleccionandoModoWhatsapp] =
    useState(false)
  const whatsappLink = useWhatsappLink(telefono)

  useEffect(() => {
    formularioVisible && refDescripcion.current?.focus()
    enviado && refContacto.current?.focus()
  }, [formularioVisible, enviado])

  const reportarProblema = async (e) => {
    e.preventDefault()
    track('Feedback', 'Chat', 'enviarReporteDeProblema', {
      nombreUsuario,
      cuenta,
      nombreEncuestaSeleccionada,
      tipo,
      descripcion,
    })
    setEnviando(true)
    setError()
    try {
      const res = await reportarASlack(
        nombreUsuario,
        cuenta,
        nombreEncuestaSeleccionada,
        tipo,
        descripcion
      )
      setTs(res)
      setEnviado(true)
      setEnviando(false)
    } catch (err) {
      setEnviado(false)
      setEnviando(false)
      setError(err.message)
    }
  }

  const enviarContacto = (e) => {
    e.preventDefault()
    track('Feedback', 'Chat', 'enviarContactoParaReporteDeProblema', {
      contacto,
    })
    agregarMensajeAHilo(ts, `Usuario deja contacto: *${contacto}*`, cuenta)
    setContactoEnviado(true)
    dispatch(guardaContacto(contacto))
  }

  const abrirChatEnWhatsapp = useCallback(() => {
    track('Feedback', 'Chat', 'abrirWhatsappWeb', { whatsappLink })
    window.open(whatsappLink, '_blank').focus()
  }, [track, whatsappLink])

  const abrirAgenda = () => {
    track('Feedback', 'Chat', 'abrirAgenda', { link: link.url })
    window.open(link.url, '_blank').focus()
  }

  if (enviado) {
    return (
      <div className="AccionesChat__agradecimiento">
        <InlineIcon
          className="AccionesChat__icono_gracias"
          icon="mdi:robot-excited"
        />
        <p className="AccionesChat__gracias">
          ¡Hemos recibido tu reporte, gracias por ayudarnos a mejorar nuestro
          servicio!
        </p>
        {contactoEnviado ? (
          <p className="AccionesChat__gracias AccionesChat__gracias--contacto">
            ¡Muchas gracias! {obtenerSonrisa()}
          </p>
        ) : (
          <form
            className="AccionesChat__formulario_contacto"
            onSubmit={enviarContacto}
          >
            <p className="AccionesChat__mensaje_contacto">
              Si gustas, puedes dejarnos tu contacto para que conversemos sobre
              este caso:
            </p>
            <input
              ref={refContacto}
              type="text"
              placeholder="Tu nombre, teléfono, e-mail, etc."
              className="AccionesChat__input_contacto"
              value={contacto}
              onChange={(e) => setContacto(e.target.value)}
              onKeyUp={(e) => e.stopPropagation()}
              required
            />
            <button type="submit" className="AccionesChat__boton_contacto">
              Enviar mi contacto
            </button>
          </form>
        )}
      </div>
    )
  }

  return (
    <div className="AccionesChat">
      <h2 className="AccionesChat__titulo">Acciones</h2>
      {formularioVisible ? (
        <form onSubmit={reportarProblema} className="AccionesChat__formulario">
          <button
            className="AccionesChat__boton_cerrar"
            onClick={() => {
              track('Feedback', 'Chat', 'cancelarReporteDeProblema')
              setFormularioVisible(false)
            }}
            title="Cancelar"
          >
            <InlineIcon icon="mdi:close" />
          </button>
          <label className="AccionesChat__label">Tipo de problema</label>
          <select
            disabled={enviando}
            onChange={(e) => setTipo(e.target.value)}
            value={tipo}
            className="AccionesChat__selector"
            required={true}
          >
            <option>Bot se equivoca</option>
            <option>Paciente se molesta</option>
            <option>Otro</option>
          </select>
          <label className="AccionesChat__label">Descripción</label>
          <textarea
            ref={refDescripcion}
            disabled={enviando}
            value={descripcion}
            onKeyUp={(e) => e.stopPropagation()}
            onChange={(e) => setDescripcion(e.target.value)}
            className="AccionesChat__textarea"
            required={true}
            placeholder={
              'No dudes al contarnos cualquier anomalía que detectes, ¡nos ayudas a brindarte un mejor servicio!'
            }
          ></textarea>
          <button
            disabled={enviando}
            className="AccionesChat__boton_enviar"
            title="Reportar"
          >
            {enviando ? (
              <>
                <InlineIcon
                  className="AccionesChat__icono_enviando"
                  icon="mdi:loading"
                />{' '}
                Enviando reporte...
              </>
            ) : (
              <>
                Reportar problema a{' '}
                <img
                  className="AccionesChat__logo_cero"
                  src={logoCero}
                  alt="logo Cero"
                />
              </>
            )}
          </button>
          {error && <p>{error}</p>}
        </form>
      ) : (
        <>
          <div className="AccionesChat__contenedor_boton_whatsapp">
            <OutsideClickHandler
              onOutsideClick={() => setSeleccionandoModoWhatsapp(false)}
            >
              <div
                className={classNames({
                  AccionesChat__modal_modo_whatsapp: true,
                  'AccionesChat__modal_modo_whatsapp--activo':
                    seleccionandoModoWhatsapp,
                })}
              >
                <button
                  className="AccionesChat__boton_modo_whatsapp"
                  onClick={() => {
                    setSeleccionandoModoWhatsapp(false)
                    dispatch(fijaAbrirAppWhatsapp(false))
                  }}
                >
                  Usar Whatsapp Web
                  <InlineIcon
                    icon={'mdi:check'}
                    style={abrirAppWhatsapp && { opacity: 0 }}
                  />
                </button>
                <button
                  className="AccionesChat__boton_modo_whatsapp"
                  onClick={() => {
                    setSeleccionandoModoWhatsapp(false)
                    dispatch(fijaAbrirAppWhatsapp(true))
                  }}
                >
                  Usar App de Whatsapp
                  <InlineIcon
                    icon={'mdi:check'}
                    style={!abrirAppWhatsapp && { opacity: 0 }}
                  />
                </button>
              </div>
            </OutsideClickHandler>
            <button
              className="AccionesChat__boton AccionesChat__boton--whatsapp"
              onClick={abrirChatEnWhatsapp}
              title={
                abrirAppWhatsapp
                  ? 'Abrir chat en Whatsapp'
                  : 'Abrir chat en Whatsapp Web'
              }
            >
              <InlineIcon
                style={{ fontSize: '.8rem' }}
                className="AccionesChat__icono_boton"
                icon="mdi:whatsapp"
              />
              Contactar por{' '}
              {abrirAppWhatsapp ? 'App de Whatsapp' : 'Whatsapp Web'}
            </button>
            <button
              className="AccionesChat__boton_selector_modo_whatsapp"
              onClick={() =>
                setSeleccionandoModoWhatsapp(!seleccionandoModoWhatsapp)
              }
            >
              <Icon icon="mdi:chevron-down" />
            </button>
          </div>
          {link && (
            <button
              className="AccionesChat__boton"
              onClick={() => abrirAgenda()}
              title={`Abrir chat en ${link.tipo}`}
            >
              <InlineIcon
                style={{ fontSize: '.8rem' }}
                className="AccionesChat__icono_boton"
                icon="mdi:arrow-top-right"
              />
              Ver cita en {link.tipo}
            </button>
          )}
          <button
            className="AccionesChat__boton"
            onClick={() => {
              track('Feedback', 'Chat', 'reportarProblema')
              setFormularioVisible(true)
            }}
            title="Reportar problema a CERO"
          >
            <InlineIcon
              style={{ fontSize: '.8rem' }}
              className="AccionesChat__icono_boton"
              icon="mdi:report"
            />
            Reportar problema a Cero
          </button>
        </>
      )}
    </div>
  )
}

export default AccionesChat

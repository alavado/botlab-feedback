import { InlineIcon } from '@iconify/react'
import { useEffect, useState, useRef } from 'react'
import iconoProblema from '@iconify/icons-mdi/report-problem'
import iconoCerrar from '@iconify/icons-mdi/close'
import iconoGracias from '@iconify/icons-mdi/robot-excited'
import iconoEnviando from '@iconify/icons-mdi/loading'
import { useDispatch, useSelector } from 'react-redux'
import { agregarMensajeAHilo, reportarASlack } from '../../../../../helpers/slack'
import logoCero from '../../../../../assets/images/logo-cero.svg'
import './AccionesChat.css'
import { guardaContacto } from '../../../../../redux/ducks/opciones'
import { agregarIssueADBNotion } from '../../../../../api/notion'

const obtenerSonrisa = () => {
  const opciones = ['😀', '😊', '😄', '😁', '😃', '😉', '🙂']
  return opciones[Math.floor(Math.random() * opciones.length)]
}

const AccionesChat = () => {
  
  const { nombreUsuario, cuenta } = useSelector(state => state.login)
  const [formularioVisible, setFormularioVisible] = useState(false)
  const [tipo, setTipo] = useState('Bot se equivoca')
  const [descripcion, setDescripcion] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [ts, setTs] = useState(0)
  const { contacto: contactoGuardado } = useSelector(state => state.opciones)
  const [contacto, setContacto] = useState(contactoGuardado || '')
  const [contactoEnviado, setContactoEnviado] = useState(false)
  const refDescripcion = useRef()
  const refContacto = useRef()
  const dispatch = useDispatch()

  useEffect(() => {
    formularioVisible && refDescripcion.current?.focus()
    enviado && refContacto.current?.focus()
  }, [formularioVisible, enviado])

  const reportarProblema = async e => {
    e.preventDefault()
    setEnviando(true)
    await agregarIssueADBNotion()
    const res = await reportarASlack(nombreUsuario, cuenta, tipo, descripcion)
    setTs(res)
    setEnviado(true)
    setEnviando(false)
  }

  const enviarContacto = e => {
    e.preventDefault()
    agregarMensajeAHilo(ts, `Usuario deja contacto: *${contacto}*`)
    setContactoEnviado(true)
    dispatch(guardaContacto(contacto))
  }

  if (enviado) {
    return (
      <div className="AccionesChat__agradecimiento">
        <InlineIcon className="AccionesChat__icono_gracias" icon={iconoGracias} />
        <p className="AccionesChat__gracias">¡Hemos recibido tu reporte, gracias por ayudarnos a mejorar nuestro servicio!</p>
        {contactoEnviado
          ? <p className="AccionesChat__gracias AccionesChat__gracias--contacto">¡Muchas gracias! {obtenerSonrisa()}</p>
          : <form
              className="AccionesChat__formulario_contacto"
              onSubmit={enviarContacto}
            >
              <p className="AccionesChat__mensaje_contacto">Si gustas, puedes dejarnos tu contacto para que conversemos sobre este caso:</p>
              <input
                ref={refContacto}
                type="text"
                placeholder="Tu nombre, teléfono, e-mail, etc."
                className="AccionesChat__input_contacto"
                value={contacto}
                onChange={e => setContacto(e.target.value)}
                required
              />
              <button
                type="submit"
                className="AccionesChat__boton_contacto"
              >
                Enviar mi contacto
              </button>
            </form>
        }
      </div>
    )
  }

  return (
    <div className="AccionesChat">
      {formularioVisible
        ? <form
            onSubmit={reportarProblema}
            className="AccionesChat__formulario"
          >
            <button
              className="AccionesChat__boton_cerrar"
              onClick={() => setFormularioVisible(false)}
              title="Cancelar"
            >
              <InlineIcon icon={iconoCerrar} />
            </button>
            <label className="AccionesChat__label">
              Tipo de problema
            </label>
            <select
              disabled={enviando}
              onChange={e => setTipo(e.target.value)}
              value={tipo}
              className="AccionesChat__selector"
              required={true}
            >
              <option>Bot se equivoca</option>
              <option>Paciente se molesta</option>
              <option>Otro</option>
            </select>
            <label className="AccionesChat__label">
              Descripción
            </label>
            <textarea
              ref={refDescripcion}
              disabled={enviando}
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              className="AccionesChat__textarea"
              required={true}
              placeholder={"No dudes al contarnos cualquier anomalía que detectes, ¡nos ayudas a brindarte un mejor servicio!"}
            >
            </textarea>
            <button
              disabled={enviando}
              className="AccionesChat__boton_enviar"
              title="Reportar"
            >
              {enviando
                ? <><InlineIcon className="AccionesChat__icono_enviando" icon={iconoEnviando} /> Enviando reporte...</>
                : <>Reportar problema a <img className="AccionesChat__logo_cero" src={logoCero} alt="logo Cero" /></>
              }
            </button>
          </form>
        : <button
            className="AccionesChat__boton"
            onClick={() => setFormularioVisible(true)}
          >
            <InlineIcon className="AccionesChat__icono_boton" icon={iconoProblema} />
            ¿Encontraste algún problema en esta interacción?
          </button>
      }
    </div>
  )
}

export default AccionesChat
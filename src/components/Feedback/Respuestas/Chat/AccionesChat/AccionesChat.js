import { InlineIcon } from '@iconify/react'
import { useEffect, useState, useRef } from 'react'
import iconoProblema from '@iconify/icons-mdi/report-problem'
import iconoCerrar from '@iconify/icons-mdi/close'
import iconoGracias from '@iconify/icons-mdi/robot-excited'
import iconoEnviando from '@iconify/icons-mdi/loading'
import { useSelector } from 'react-redux'
import { reportarASlack } from '../../../../../helpers/slack'
import logoCero from '../../../../../assets/images/logo-cero.svg'
import './AccionesChat.css'

const AccionesChat = ({ cargando }) => {
  
  const { nombreUsuario, cuenta } = useSelector(state => state.login)
  const [formularioVisible, setFormularioVisible] = useState(false)
  const [tipo, setTipo] = useState('Bot se equivoca')
  const [descripcion, setDescripcion] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const refDescripcion = useRef()
  const refContacto = useRef()

  useEffect(() => {
    formularioVisible && refDescripcion.current?.focus()
    enviado && refContacto.current?.focus()
  }, [formularioVisible, enviado])

  const enviar = e => {
    e.preventDefault()
    setEnviando(true)
    reportarASlack(nombreUsuario, cuenta, tipo, descripcion)
      .then(() => {
        setEnviado(true)
        setEnviando(false)
      })
      .catch(() => {
        setEnviado(true)
        setEnviando(false)
      })
  }

  if (cargando) {
    return null
  }

  if (enviado) {
    return (
      <div className="AccionesChat__agradecimiento">
        <InlineIcon className="AccionesChat__icono_gracias" icon={iconoGracias} />
        <p className="AccionesChat__gracias">
          <strong style={{ fontWeight: 'bold', fontSize: '1rem' }}>¡Muchas gracias, hemos recibido tu reporte!</strong><br />
          Si lo consideras pertinente, puedes dejarnos tu contacto para que conversemos sobre este caso  
        </p>
        <form className="AccionesChat__formulario_contacto">
          <input
            ref={refContacto}
            type="text"
            placeholder="Tu teléfono o e-mail"
            className="AccionesChat__input_contacto"
          />
          <button
            type="submit"
            className="AccionesChat__boton_contacto"
          >
            Enviar
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="AccionesChat">
      {formularioVisible
        ? <form
            onSubmit={enviar}
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
              placeholder={"No dudes en contarnos cualquier anomalía que detectes, ¡nos ayudas a brindarte un mejor servicio!"}
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
            ¿Notas algún problema en esta interacción?
          </button>
      }
    </div>
  )
}

export default AccionesChat
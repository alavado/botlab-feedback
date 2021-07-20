import { InlineIcon } from '@iconify/react'
import { useState } from 'react'
import iconoProblema from '@iconify/icons-mdi/report-problem'
import iconoCerrar from '@iconify/icons-mdi/close'
import iconoGracias from '@iconify/icons-mdi/check-bold'
import iconoEnviando from '@iconify/icons-mdi/loading'
import { useSelector } from 'react-redux'
import { reportarASlack } from '../../../../../helpers/slack'
import logoCero from '../../../../../assets/images/logo-cero.svg'
import './AccionesChat.css'

const AccionesChat = () => {
  
  const { nombreUsuario } = useSelector(state => state.login)
  const [formularioVisible, setFormularioVisible] = useState(false)
  const [tipo, setTipo] = useState('Bot se equivoca')
  const [descripcion, setDescripcion] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [enviando, setEnviando] = useState(false)

  const enviar = e => {
    e.preventDefault()
    setEnviando(true)
    reportarASlack(nombreUsuario, tipo, descripcion)
      .then(() => {
        setEnviado(true)
        setEnviando(false)
      })
  }

  if (enviado) {
    return (
      <div className="AccionesChat">
        <p className="AccionesChat__gracias">
         <InlineIcon className="AccionesChat__icono_gracias" icon={iconoGracias} />
          Recibimos su reporte, ¡muchas gracias!
        </p>
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
            >
              <option>Bot se equivoca</option>
              <option>Paciente se molesta</option>
              <option>Otro</option>
            </select>
            <label className="AccionesChat__label">
              Descripción
            </label>
            <textarea
              disabled={enviando}
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              className="AccionesChat__textarea"
            >
            </textarea>
            <button
              disabled={enviando}
              className="AccionesChat__boton_enviar"
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
            ¿Nota algún problema en esta interacción?
          </button>
      }
    </div>
  )
}

export default AccionesChat
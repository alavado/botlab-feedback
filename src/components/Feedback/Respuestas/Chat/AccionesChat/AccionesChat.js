import { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { reportarASlack } from '../../../../../helpers/slack'
import './AccionesChat.css'

const AccionesChat = () => {
  
  const { nombreUsuario } = useSelector(state => state.login)
  const [formularioVisible, setFormularioVisible] = useState(false)
  const [tipo, setTipo] = useState('Bot se equivoca')
  const [descripcion, setDescripcion] = useState('')

  const enviar = e => {
    e.preventDefault()
    reportarASlack(nombreUsuario, tipo, descripcion)
  }

  return (
    <div className="AccionesChat">
      {formularioVisible
        ? <form onSubmit={enviar} className="AccionesChat__formulario">
            Reporte de problema a Cero.ai
            <label>Tipo de problema</label>
            <select onChange={e => setTipo(e.target.value)} value={tipo}>
              <option>Bot se equivoca</option>
              <option>Paciente se molesta</option>
              <option>Otro</option>
            </select>
            <label>Descripción</label>
            <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)}>
              
            </textarea>
            <button className="AccionesChat__boton">Reportar problema</button>
          </form>
        : <button className="AccionesChat__boton" onClick={() => setFormularioVisible(true)}>Reportar un problema a Cero.ai</button>
      }
    </div>
  )
}

export default AccionesChat
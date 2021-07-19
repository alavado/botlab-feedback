import { useState } from 'react'
import './AccionesChat.css'

const AccionesChat = () => {

  const [formularioVisible, setFormularioVisible] = useState(false)

  return (
    <div className="AccionesChat">
      {formularioVisible
        ? <form className="AccionesChat__formulario">
            Reporte de problema a Cero.ai
            <label>Tipo de problema</label>
            <select>
              <option>Bot se equivoca</option>
              <option>Paciente se molesta</option>
              <option>Otro</option>
            </select>
            <label>Descripción</label>
            <textarea>
              
            </textarea>
            <button className="AccionesChat__boton">Reportar problema</button>
          </form>
        : <button className="AccionesChat__boton" onClick={() => setFormularioVisible(true)}>Reportar un problema a Cero.ai</button>
      }
    </div>
  )
}

export default AccionesChat
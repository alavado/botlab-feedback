import { InlineIcon } from '@iconify/react'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import datos from './datos'
import iconoImportar from '@iconify/icons-mdi/file-import'
import iconoGuardar from '@iconify/icons-mdi/content-save-all'
import './Preparaciones.css'

const Preparaciones = () => {

  const [filas, setFilas] = useState(datos.map(d => [...d, true]))
  const [filtro, setFiltro] = useState('')

  useEffect(() => {
    if (!filtro) {
      setFilas(datos.map(d => [...d, true]))
    }
    else {
      setFilas(datos.map(d => [...d, d[0].indexOf(filtro) >= 0 || d[1].indexOf(filtro) >= 0]))
    }
  }, [filtro])

  return (
    <div className="Preparaciones">
      <div className="Preparaciones__superior">
        <h1 className="Preparaciones__titulo">Preparaciones</h1>
        <input
          placeholder="Buscar en tabla"
          value={filtro}
          onChange={e => setFiltro(e.target.value)}
          className="Preparaciones__input_busqueda"
        />
        <div className="Preparaciones__acciones">
          <button><InlineIcon icon={iconoImportar} /> Importar planilla</button>
          <button><InlineIcon icon={iconoGuardar} /> Guardar cambios</button>
        </div>
      </div>
      <div className="Preparaciones__contenedor_tabla">
        <table className="Preparaciones__tabla">
          <thead>
            <tr>
              <th>Centro</th>
              <th>ID Servicio</th>
              <th>URL</th>
            </tr>
          </thead>
          <tbody>
            {filas.map((fila, i) => (
              <tr
                className={classNames({
                  'Preparaciones__fila--invisible': !fila[3]
                })}
                key={`fila-preparaciones-${i}`}
              >
                <td>
                  <input
                    value={fila[0]}
                    onChange={e => setFilas([...filas.slice(0, i), [e.target.value, filas[i][1], filas[i][2]], ...filas.slice(i + 1)])}
                    className="Preparaciones__input_tabla"
                  />
                </td>
                <td>
                  <input
                    value={fila[1]}
                    onChange={e => setFilas([...filas.slice(0, i), [filas[i][0], e.target.value, filas[i][2]], ...filas.slice(i + 1)])}
                    className="Preparaciones__input_tabla"
                  />
                </td>
                <td>
                  <input
                    value={fila[2]}
                    onChange={e => setFilas([...filas.slice(0, i), [filas[i][0], filas[i][1], e.target.value], ...filas.slice(i + 1)])}
                    className={classNames({
                      "Preparaciones__input_tabla": true,
                      "Preparaciones__link": fila[2].startsWith('https://'),
                    })}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Preparaciones
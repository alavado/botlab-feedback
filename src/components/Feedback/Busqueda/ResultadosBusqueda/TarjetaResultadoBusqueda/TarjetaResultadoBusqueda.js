import { format, parseISO } from 'date-fns'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { guardaEstaRespuesta } from '../../../../../redux/ducks/respuestas'
import TagRespuesta from '../../../Respuestas/TablaRespuestas/TagRespuesta'
import { es } from 'date-fns/locale'
import './TarjetaResultadoBusqueda.css'
import Scrambler from '../../../../Scrambler'
import useAnalytics from '../../../../../hooks/useAnalytics'

const TarjetaResultadoBusqueda = ({ resultado, posicion }) => {

  const history = useHistory()
  const dispatch = useDispatch()
  const { tipos, todosLosHeaders } = useSelector(state => state.encuestas)
  const headersEncuesta = todosLosHeaders?.find(h => h.poll_id === resultado.poll_id)?.headers
  const track = useAnalytics()

  const verChat = resultado => {
    track('Feedback', 'Busqueda', 'verChat', { idEncuesta: resultado.poll_id, idUsuario: resultado.user_id, posicion })
    dispatch(guardaEstaRespuesta(resultado))
    history.push(`/chat/${resultado.poll_id}/${resultado.user_id}`)
  }

  if (!headersEncuesta || !tipos) {
    return null
  }

  return (
    <div
      className="TarjetaResultadoBusqueda"
      onClick={() => verChat(resultado)}
      style={{ animationDelay: `${posicion * .05}s` }}
    >
      <div className="TarjetaResultadoBusqueda__superior">
        <div className="TarjetaResultadoBusqueda__posicion">
          {posicion}
        </div>
        {/* <h3 className="TarjetaResultadoBusqueda__nombre_encuesta">
          {tipos.find(t => t.id === resultado.poll_id).nombre}
        </h3> */}
      </div>
      {Object
        .keys(resultado)
        .filter(k => headersEncuesta.find(h => h.name === k))
        .filter(k => headersEncuesta.find(h => h.name === k).type === 'META')
        .map((k, i) => (
          <div
            key={`${resultado.user_id}-${i}`}
            className="TarjetaResultadoBusqueda__contenedor_valores"
          >
            <div className="TarjetaResultadoBusqueda__encabezado">
              {headersEncuesta.find(h => h.name === k).display_name}
            </div>
            <div className="TarjetaResultadoBusqueda__valor">
              {resultado[k] && resultado[k].tag !== undefined
                ? <div style={{ display: 'flex', alignItems: 'center' }}><TagRespuesta tag={resultado[k].tag} /></div>
                : <Scrambler tipo={k}>{resultado[k]}</Scrambler>
              }
            </div>
          </div>
      ))}
      <div className="TarjetaResultadoBusqueda__contenedor_valores">
        <div className="TarjetaResultadoBusqueda__encabezado">
          Teléfono
        </div>
        <div className="TarjetaResultadoBusqueda__valor">
          <Scrambler tipo="telefono">{resultado.phone}</Scrambler>
        </div>
      </div>
      <div className="TarjetaResultadoBusqueda__contenedor_valores">
        <div className="TarjetaResultadoBusqueda__encabezado">
          Fecha conversación
        </div>
        <div className="TarjetaResultadoBusqueda__valor">
          {format(parseISO(resultado.start), 'd MMM yy\',\' HH:mm', { locale: es })}
        </div>
      </div>
      {Object
        .keys(resultado)
        .filter(k => headersEncuesta.find(h => h.name === k))
        .filter(k => headersEncuesta.find(h => h.name === k).type !== 'META')
        .map((k, i) => (
          <div
            key={`${resultado.user_id}-${i}`}
            className="TarjetaResultadoBusqueda__contenedor_valores"
          >
            <div className="TarjetaResultadoBusqueda__encabezado">
              {headersEncuesta.find(h => h.name === k).display_name}
            </div>
            <div className="TarjetaResultadoBusqueda__valor">
              {resultado[k] && resultado[k].tag !== undefined
                ? <TagRespuesta tag={resultado[k].tag} />
                : resultado[k]
              }
            </div>
          </div>
      ))}
    </div>
  )
}

export default TarjetaResultadoBusqueda

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Icon } from '@iconify/react'
import whatsapp from '@iconify/icons-mdi/whatsapp'
import { useDispatch, useSelector } from 'react-redux'
import { headersRespuestas as headersAPI } from '../../../../api/endpoints'
import { guardaHeadersEncuesta } from '../../../../redux/ducks/encuestas'
import Loader from '../../../Loader'
import './TabsEncuestas.css'
import { actualizaRespuestas, agregaFiltro, limpiaFiltros, limpiaRespuestas } from '../../../../redux/ducks/respuestas'
import { guardaIdEncuesta } from '../../../../redux/ducks/opciones'
import { useParams, useRouteMatch } from 'react-router-dom'
import classNames from 'classnames'
import { obtenerTiposEncuestasVisibles } from '../../../../helpers/encuestasSecretas'
import { obtenerPollsCalculadas } from '../../../../helpers/pollsCalculadas'

const TabsEncuestas = () => {

  const { tipos, idEncuestaSeleccionada } = useSelector(state => state.encuestas)
  const { idEncuestaGuardada } = useSelector(state => state.opciones)
  const { cuenta, nombreUsuario } = useSelector(state => state.login)
  const [cargandoEncuesta, setCargandoEncuesta] = useState(false)
  const { indiceRespuestaSeleccionada, respuestas} = useSelector(state => state.respuestas)
  const { idEncuesta: idEncuestaRuta } = useParams()
  const { path } = useRouteMatch()
  const dispatch = useDispatch()
  
  const tiposOrdenados = useMemo(() => {
    const encuestaSeleccionada = tipos?.find(({ id }) => id === idEncuestaSeleccionada)
    if (!encuestaSeleccionada) {
      return tipos
    }
    const encuestasCalculadas = obtenerPollsCalculadas(encuestaSeleccionada, respuestas)
    if (encuestasCalculadas.length === 0) {
      return tipos
    }
    let tiposEncuestas = [
      encuestaSeleccionada,
      ...encuestasCalculadas,
      ...tipos.filter(({ id }) => id !== idEncuestaSeleccionada)
    ]
    return obtenerTiposEncuestasVisibles(cuenta, tiposEncuestas)
  }, [tipos, idEncuestaSeleccionada, respuestas, cuenta])

  const verEncuesta = useCallback(async id => {
    setCargandoEncuesta(true)
    if (`${id}`.startsWith('filtro')) {
      setCargandoEncuesta(false)
      const [, header, texto, idEncuesta, titulo] = id.split('|')
      dispatch(agregaFiltro({
        busqueda: texto,
        nombreHeader: header,
        textoHeader: header,
        idEncuesta: Number(idEncuesta),
        opciones: {
          filtroImplicito: true,
          titulo
        }
      }))
      return
    }
    if (id === idEncuestaSeleccionada) {
      setCargandoEncuesta(false)
      dispatch(limpiaFiltros())
      return
    }
    try {
      dispatch(limpiaRespuestas())
      dispatch(guardaIdEncuesta(id))
      dispatch(limpiaFiltros())
      const data = await headersAPI(id)
      dispatch(guardaHeadersEncuesta({ id, data }))
      dispatch(actualizaRespuestas())
      setCargandoEncuesta(false)
    } catch (e) {
      console.error('un error', e)
    }
  }, [dispatch, idEncuestaSeleccionada])

  useEffect(() => {
    let tiposEncuestas = obtenerTiposEncuestasVisibles(cuenta, tipos)
    if (tiposEncuestas && !idEncuestaSeleccionada) {
      if (idEncuestaRuta && tiposEncuestas.find(t => t.id === Number(idEncuestaRuta))) {
        verEncuesta(Number(idEncuestaRuta))
      }
      else if (tiposEncuestas.find(t => t.id === idEncuestaGuardada)) {
        verEncuesta(idEncuestaGuardada)
      }
      else {
        const id = tiposEncuestas[0]?.id
        if (id) {
          verEncuesta(id)
        }
      }
    }
  }, [idEncuestaSeleccionada, idEncuestaGuardada, idEncuestaRuta, dispatch, tipos, verEncuesta, cuenta])

  if (!idEncuestaSeleccionada) {
    return <Loader color="#6057f6" />
  }

  const encuestaSeleccionada = tipos.find(t => t.id === idEncuestaSeleccionada)

  if (!encuestaSeleccionada && !cargandoEncuesta) {
    verEncuesta(tipos[0].id)
    return <Loader color="#6057f6" />
  }

  return (
    <div
      className={classNames({
        TabsEncuestas: true,
        'TabsEncuestas--visible': path.indexOf('chat') < 0 || indiceRespuestaSeleccionada >= 0,
        'TabsEncuestas--interactivo': path.indexOf('chat') < 0,
        'TabsEncuestas--todas': path.indexOf('busqueda') >= 0
      })}
    >
      {path.indexOf('busqueda') >= 0 || path.indexOf('uso') >= 0 || path.indexOf('preparaciones') >= 0 || path.indexOf('alertas') >= 0 || path.indexOf('chat') >= 0
        ? <>
            <Icon
              className="TabsEncuestas__icono_empresa"
              icon={whatsapp}
            />
            <div className="TabsEncuestas__nombre_encuesta">
              Todas las encuestas
            </div>
          </>
        : <>
            {tiposOrdenados.map(tipo => (
              <button
                key={`boton-tab-${tipo.id}`}
                onClick={() => verEncuesta(tipo.id)}
                className={classNames({
                  "TabsEncuestas__tab": true,
                  "TabsEncuestas__tab--activo": idEncuestaSeleccionada === tipo.id
                })}
              >
                <Icon
                  className="TabsEncuestas__tab_icono_empresa"
                  icon={whatsapp}
                />
                {tipo.nombre.replace(nombreUsuario, '')}
              </button>
            ))}
          </>
      }
    </div>
  )
}

export default TabsEncuestas

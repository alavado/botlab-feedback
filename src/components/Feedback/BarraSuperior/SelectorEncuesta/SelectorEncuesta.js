import { useState, useEffect, useCallback } from 'react'
import { Icon } from '@iconify/react'
import { useDispatch, useSelector } from 'react-redux'
import { headersRespuestas as headersAPI } from '../../../../api/endpoints'
import { guardaHeadersEncuesta } from '../../../../redux/ducks/encuestas'
import PopupEncuestas from './PopupEncuestas'
import Loader from '../../../Loader'
import './SelectorEncuesta.css'
import {
  actualizaRespuestas,
  agregaFiltro,
  limpiaFiltros,
  limpiaRespuestas,
} from '../../../../redux/ducks/respuestas'
import { guardaIdEncuesta } from '../../../../redux/ducks/opciones'
import { useParams, useRouteMatch } from 'react-router-dom'
import classNames from 'classnames'
import Scrambler from '../../../Scrambler/Scrambler'
import { obtenerTiposEncuestasVisibles } from '../../../../helpers/encuestasSecretas'
import { formatearNombreEncuesta } from '../../../../helpers/respuestas'

const SelectorEncuesta = () => {
  const { tipos, idEncuestaSeleccionada } = useSelector(
    (state) => state.encuestas
  )
  const { idEncuestaGuardada } = useSelector((state) => state.opciones)
  const { cuenta, nombreUsuario } = useSelector((state) => state.login)
  const [cargandoEncuesta, setCargandoEncuesta] = useState(false)
  const [popupActivo, setPopupActivo] = useState(false)
  const { indiceRespuestaSeleccionada, nombreEncuestaFiltrada } = useSelector(
    (state) => state.respuestas
  )
  const { idEncuesta: idEncuestaRuta } = useParams()
  const { path } = useRouteMatch()
  const dispatch = useDispatch()

  const verEncuesta = useCallback(
    async (id) => {
      setCargandoEncuesta(true)
      if (`${id}`.startsWith('filtro')) {
        setCargandoEncuesta(false)
        const [_, header, texto, idEncuesta, titulo] = id.split('|')
        dispatch(
          agregaFiltro({
            busqueda: texto,
            nombreHeader: header,
            textoHeader: header,
            idEncuesta: Number(idEncuesta),
            opciones: {
              filtroImplicito: true,
              titulo,
            },
          })
        )
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
    },
    [dispatch, idEncuestaSeleccionada]
  )

  useEffect(() => {
    let tiposEncuestas = obtenerTiposEncuestasVisibles(cuenta, tipos)
    if (tiposEncuestas && !idEncuestaSeleccionada) {
      if (
        idEncuestaRuta &&
        tiposEncuestas.find((t) => t.id === Number(idEncuestaRuta))
      ) {
        verEncuesta(Number(idEncuestaRuta))
      } else if (tiposEncuestas.find((t) => t.id === idEncuestaGuardada)) {
        verEncuesta(idEncuestaGuardada)
      } else {
        const id = tiposEncuestas[0]?.id
        if (id) {
          verEncuesta(id)
        }
      }
    }
  }, [
    idEncuestaSeleccionada,
    idEncuestaGuardada,
    idEncuestaRuta,
    dispatch,
    tipos,
    verEncuesta,
    cuenta,
  ])

  if (!idEncuestaSeleccionada) {
    return <Loader color="#6057f6" />
  }

  const encuestaSeleccionada = tipos.find(
    (t) => t.id === idEncuestaSeleccionada
  )

  if (!encuestaSeleccionada && !cargandoEncuesta) {
    verEncuesta(tipos[0].id)
    return <Loader color="#6057f6" />
  }

  if (cargandoEncuesta) {
    return <Loader color="#6057f6" />
  }

  return (
    <div
      className={classNames({
        SelectorEncuesta: true,
        'SelectorEncuesta--visible':
          path.indexOf('chat') < 0 || indiceRespuestaSeleccionada >= 0,
        'SelectorEncuesta--interactivo': path.indexOf('chat') < 0,
        'SelectorEncuesta--todas': path.indexOf('busqueda') >= 0,
      })}
      onClick={() => setPopupActivo(path.indexOf('chat') < 0)}
    >
      {[
        'busqueda',
        'uso',
        'alertas',
        'tutoriales',
        'exportar',
        'dashboard',
      ].some((x) => path.indexOf(x) >= 0) ? (
        <>
          <Icon
            className="SelectorEncuesta__icono_empresa"
            icon="mdi:whatsapp"
          />
          <div className="SelectorEncuesta__nombre_encuesta">
            Todos los servicios
          </div>
        </>
      ) : (
        <>
          <Icon
            className="SelectorEncuesta__icono_empresa"
            icon={
              nombreEncuestaFiltrada ? 'mdi:map-marker-radius' : 'mdi:whatsapp'
            }
            style={{
              color: encuestaSeleccionada.enabled ? '#48BB78' : '#9f9eae',
            }}
          />
          <div className="SelectorEncuesta__nombre_encuesta">
            <Scrambler tipo="multi">
              {nombreEncuestaFiltrada ||
                formatearNombreEncuesta(
                  nombreUsuario,
                  encuestaSeleccionada.nombre
                )}
            </Scrambler>
          </div>
          {path.indexOf('chat') < 0 && (
            <Icon
              className="SelectorEncuesta__icono_menu"
              icon="mdi:chevron-down"
            />
          )}
          <PopupEncuestas
            activo={popupActivo}
            esconder={() => setPopupActivo(false)}
            verEncuesta={verEncuesta}
          />
        </>
      )}
    </div>
  )
}

export default SelectorEncuesta

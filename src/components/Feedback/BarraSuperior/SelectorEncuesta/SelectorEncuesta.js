import React, { useState, useEffect, useCallback } from 'react'
import { Icon } from '@iconify/react'
import chevronDown from '@iconify/icons-mdi/chevron-down'
import whatsapp from '@iconify/icons-mdi/whatsapp'
import { useDispatch, useSelector } from 'react-redux'
import { headersRespuestas as headersAPI } from '../../../../api/endpoints'
import { guardaHeadersEncuesta } from '../../../../redux/ducks/encuestas'
import PopupEncuestas from './PopupEncuestas'
import Loader from '../../../Loader'
import './SelectorEncuesta.css'
import { actualizaRespuestas, limpiaRespuestas } from '../../../../redux/ducks/respuestas'
import { guardaIdEncuesta } from '../../../../redux/ducks/opciones'
import { useParams, useRouteMatch } from 'react-router-dom'
import classNames from 'classnames'
import Scrambler from '../../../../helpers/Scrambler/Scrambler'

const SelectorEncuesta = () => {

  const { tipos, idEncuestaSeleccionada } = useSelector(state => state.encuestas)
  const { idEncuestaGuardada } = useSelector(state => state.opciones)
  const { indiceRespuestaSeleccionada } = useSelector(state => state.respuestas)
  const [cargandoEncuesta, setCargandoEncuesta] = useState(false)
  const [popupActivo, setPopupActivo] = useState(false)
  const { idEncuesta: idEncuestaRuta } = useParams()
  const { path } = useRouteMatch()
  const dispatch = useDispatch()

  const verEncuesta = useCallback(async id => {
    setCargandoEncuesta(true)
    if (id === idEncuestaSeleccionada) {
      setCargandoEncuesta(false)
      return
    }
    try {
      dispatch(limpiaRespuestas())
      dispatch(guardaIdEncuesta(id))
      const data = await headersAPI(id)
      dispatch(guardaHeadersEncuesta({ id, data }))
      dispatch(actualizaRespuestas())
      setCargandoEncuesta(false)
    } catch (e) {
      console.error('un error', e)
    }
  }, [dispatch, idEncuestaSeleccionada])

  useEffect(() => {
    if (tipos && !idEncuestaSeleccionada) {
      if (idEncuestaRuta && tipos.find(t => t.id === Number(idEncuestaRuta))) {
        verEncuesta(Number(idEncuestaRuta))
      }
      else if (tipos.find(t => t.id === idEncuestaGuardada)) {
        verEncuesta(idEncuestaGuardada)
      }
      else {
        verEncuesta(tipos[0].id)
      }
    }
  }, [idEncuestaSeleccionada, idEncuestaGuardada, idEncuestaRuta, dispatch, tipos, verEncuesta])

  if (!idEncuestaSeleccionada) {
    return <Loader color="#6057f6" />
  }

  const encuestaSeleccionada = tipos.find(t => t.id === idEncuestaSeleccionada)

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
        'SelectorEncuesta--visible': path.indexOf('chat') < 0 || indiceRespuestaSeleccionada >= 0,
        'SelectorEncuesta--interactivo': path.indexOf('chat') < 0,
        'SelectorEncuesta--todas': path.indexOf('busqueda') >= 0
      })}
      onClick={() => setPopupActivo(path.indexOf('chat') < 0)}
    >
      {path.indexOf('busqueda') >= 0 || path.indexOf('uso') >= 0
        ? <>
            <Icon
              className="SelectorEncuesta__icono_empresa"
              icon={whatsapp}
            />
            <div className="SelectorEncuesta__nombre_encuesta">
              Todas las encuestas
            </div>
          </>
        : <>
            <Icon
              className="SelectorEncuesta__icono_empresa"
              icon={whatsapp}
              style={{ color: encuestaSeleccionada.enabled ? '#48BB78' : '#9f9eae' }}
            />
            <div className="SelectorEncuesta__nombre_encuesta">
              <Scrambler tipo="multi">{encuestaSeleccionada.nombre}</Scrambler>
            </div>
            {path.indexOf('chat') < 0 && <Icon className="SelectorEncuesta__icono_menu" icon={chevronDown} />}
            <PopupEncuestas
              activo={popupActivo}
              esconder={() => setPopupActivo(false)}
              verEncuesta={verEncuesta}
            />
          </>
      }
    </div>
  )
}

export default SelectorEncuesta

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
import { limpiaRespuestas } from '../../../../redux/ducks/respuestas'
import { guardaIdEncuesta } from '../../../../redux/ducks/opciones'
import { useHistory } from 'react-router-dom'

const SelectorEncuesta = () => {

  const { tipos, idEncuestaSeleccionada } = useSelector(state => state.encuestas)
  const { idEncuestaGuardada } = useSelector(state => state.opciones)
  const [popupActivo, setPopupActivo] = useState(false)
  const dispatch = useDispatch()
  const history = useHistory()

  const verEncuesta = useCallback(async id => {
    if (id === idEncuestaSeleccionada) {
      return
    }
    try {
      history.push('/respuestas')
      dispatch(limpiaRespuestas())
      dispatch(guardaIdEncuesta(id))
      const data = await headersAPI(id)
      dispatch(guardaHeadersEncuesta(id, data))
    } catch (e) {
      console.error('un error', e)
    }
  }, [dispatch, history, idEncuestaSeleccionada])

  useEffect(() => {
    if (tipos && !idEncuestaSeleccionada) {
      if (!tipos.find(t => t.id === idEncuestaGuardada)) {
        verEncuesta(tipos[0].id)
      }
      else {
        verEncuesta(idEncuestaGuardada)
      }
    }
  }, [idEncuestaSeleccionada, idEncuestaGuardada, dispatch, tipos, verEncuesta])

  if (!idEncuestaSeleccionada) {
    return <Loader color="#6057f6" />
  }

  return (
    <div className="SelectorEncuesta" onClick={() => setPopupActivo(true)}>
      <Icon className="SelectorEncuesta__icono_empresa" icon={whatsapp} />
      <div className="SelectorEncuesta__nombre_encuesta">
        {tipos.find(t => t.id === idEncuestaSeleccionada).nombre}
      </div>
      <Icon className="SelectorEncuesta__icono_menu" icon={chevronDown} />
      <PopupEncuestas
        activo={popupActivo}
        esconder={() => setPopupActivo(false)}
        verEncuesta={verEncuesta}
      />
    </div>
  )
}

export default SelectorEncuesta

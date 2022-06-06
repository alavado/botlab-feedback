import Icon, { InlineIcon } from '@iconify/react'
import classNames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { escondeModal } from '../../../redux/ducks/configuracion'
import iconoCerrar from '@iconify/icons-mdi/close'
import './ModalConfiguracion.css'
import { useState } from 'react'
import { useMutation } from 'react-query'
import { agregarSolicitud } from '../../../api/endpoints'
import iconoGenial from '@iconify/icons-mdi/check-bold'

const ModalConfiguracion = () => {

  const { modalVisible } = useSelector(state => state.configuracion)
  const [tipo, setTipo] = useState('')
  const [detalle, setDetalle] = useState('')
  const [contacto, setContacto] = useState('')
  const dispatch = useDispatch()
  
  const { mutate, isLoading, isSuccess } = useMutation(({ tipo, detalle, contacto }) => agregarSolicitud(tipo, detalle, contacto))

  const enviar = e => {
    e.preventDefault()
    mutate({ tipo, detalle, contacto })
  }

  return (
    <div
      className={classNames({
        "ModalConfiguracion": true,
        "ModalConfiguracion--visible": modalVisible
      })}
      onClick={() => dispatch(escondeModal())}
    >
      <div
        className="ModalConfiguracion__contenido"
        onClick={e => e.stopPropagation()}
      >
        <button
          className="ModalConfiguracion__boton_cerrar"
          onClick={() => dispatch(escondeModal())}
        >
          <Icon icon={iconoCerrar} />
        </button>
        <h2 className="ModalConfiguracion__titulo">Confirmación: configuración</h2>
        {isSuccess
          ? <div className="ModalConfiguracion__mensaje_feliz">
              <p>¡Gracias! Tu solicitud quedará implementada en menos de 48 horas</p>
              <button
                onClick={() => dispatch(escondeModal())}
                className="ModalConfiguracion__boton_genial"
              >
                <InlineIcon icon={iconoGenial} /> ¡Excelente!
              </button>
            </div>
          : <form
              className="ModalConfiguracion__formulario"
              onSubmit={enviar}
            >
              <label>
                Tipo de cambio
                <select
                  value={tipo}
                  onChange={e => {
                    setTipo(e.target.value)
                  }}
                  defaultValue="Teléfono de contacto"
                >
                  <option value="Teléfono de contacto">Cambiar teléfono de contacto</option>
                  <option value="Cambio de texto">Cambiar texto del bot</option>
                  <option value="Inicio de interacciones">Cambiar horario de inicio de interacciones</option>
                  <option value="Día confirmación">Cambiar día de confirmación</option>
                  <option value="Agregar carga">Agregar carga de citas</option>
                </select>
              </label>
              <label>
                Detalle
                <input value={detalle} onChange={e => setDetalle(e.target.value)} />
              </label>
              <label>
                Contacto
                <input value={contacto} onChange={e => setContacto(e.target.value)} />
              </label>
              <button
                className="ModalConfiguracion__boton_enviar"
                disabled={isLoading}
              >
                Enviar
              </button>
            </form>
        }
      </div>
    </div>
  )
}

export default ModalConfiguracion
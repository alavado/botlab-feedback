import Icon, { InlineIcon } from '@iconify/react'
import classNames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { escondeModal } from '../../../redux/ducks/configuracion'
import iconoCerrar from '@iconify/icons-mdi/close'
import './ModalConfiguracion.css'
import { useState } from 'react'
import { useMutation } from 'react-query'
import { agregarSolicitud } from '../../../api/endpoints'
import iconoEnviar from '@iconify/icons-mdi/cog-transfer'
import iconoGenial from '@iconify/icons-mdi/check-bold'

const tiposCambiosConfiguracion = [
  {
    texto: 'Teléfono de contacto',
    ejemplo: 'nuestro teléfono fijo ahora es 555-3493'
  },
  {
    texto: 'Cambio de texto',
    ejemplo: 'donde dice "Buenos días" que diga "Buen día"'
  },
  {
    texto: 'Inicio de interacciones',
    ejemplo: 'que en lugar de comenzar a las 9:00 comiencen a las 9:30'
  },
  {
    texto: 'Día confirmación',
    ejemplo: 'confirmar 1 día antes de la cita en lugar de 2'
  },
  {
    texto: 'Agregar carga',
    ejemplo: 'confirmar las nuevas citas a las 15:00'
  },
]

const ModalConfiguracion = () => {

  const { modalVisible } = useSelector(state => state.configuracion)
  const [tipo, setTipo] = useState(tiposCambiosConfiguracion[0].texto)
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
        <h2 className="ModalConfiguracion__titulo">Configuración del servicio</h2>
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
                  defaultValue={tiposCambiosConfiguracion[0].texto}
                  className="ModalConfiguracion__selector"
                >
                  {tiposCambiosConfiguracion.map(tipo => (
                    <option
                      key={tipo.texto}
                      value={tipo.texto}
                    >
                      {tipo.texto}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Detalle {tipo ? `(Ej.: ${tiposCambiosConfiguracion.find(t => t.texto === tipo).ejemplo})` : ''}
                <input
                  value={detalle}
                  onChange={e => setDetalle(e.target.value)}
                  className="ModalConfiguracion__input"
                />
              </label>
              <label>
                Tu contacto (opcional)
                <input
                  value={contacto}
                  onChange={e => setContacto(e.target.value)} 
                  className="ModalConfiguracion__input"
                />
              </label>
              <button
                className="ModalConfiguracion__boton_enviar"
                disabled={!detalle || !tipo  || isLoading}
              >
                <InlineIcon icon={iconoEnviar} /> Actualizar configuración
              </button>
            </form>
        }
      </div>
    </div>
  )
}

export default ModalConfiguracion
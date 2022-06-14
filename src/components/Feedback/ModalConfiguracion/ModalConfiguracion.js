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
import Draggable from 'react-draggable'

const tiposCambiosConfiguracion = [
  {
    texto: 'Teléfono de contacto',
    ejemplo: 'nuestro teléfono fijo ahora es 555-3493'
  },
  {
    texto: 'Cambio de texto final',
    ejemplo: 'que diga "Gracias 😊" en lugar de "Gracias."'
  },
  {
    texto: 'Inicio de interacciones',
    ejemplo: 'retrasar el inicio hasta las 9:30'
  },
  {
    texto: 'Día confirmación',
    ejemplo: 'desde ahora confirmar 2 días antes de la cita'
  },
  {
    texto: 'Agregar carga',
    ejemplo: 'confirmar las nuevas citas a las 15:00'
  },
]

const ModalConfiguracion = () => {

  const { cuenta } = useSelector(state => state.login)
  const { modalVisible } = useSelector(state => state.configuracion)
  const [tipo, setTipo] = useState('')
  const [detalle, setDetalle] = useState('')
  const [nombre, setNombre] = useState('')
  const [contacto, setContacto] = useState('')
  const dispatch = useDispatch()
  
  const { mutate, isLoading, isSuccess } = useMutation(({ tipo, detalle, contacto }) => agregarSolicitud(tipo, detalle, contacto))

  const enviar = e => {
    e.preventDefault()
    mutate({ tipo, detalle, contacto: `Cuenta: ${cuenta} - Nombre: ${nombre} - Contacto: ${contacto}` })
  }

  return (
    <div
      className={classNames({
        "ModalConfiguracion": true,
        "ModalConfiguracion--visible": modalVisible
      })}
      onClick={() => dispatch(escondeModal())}
    >
      <Draggable>
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
                <p>¡Gracias! Tu solicitud quedará implementada a la brevedad.</p>
                <ul className="ModalConfiguracion__lista_cambios">
                  <li>🤖 Tipo de cambio: {tipo}</li>
                  <li>📑 Detalle: {detalle}</li>
                  <li>😀 Nombre: {nombre}</li>
                  <li>📧 Contacto: {contacto}</li>
                </ul>
                <p>En caso de dudas, nos pondremos en contacto contigo.</p>
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
                    onChange={e => {
                      setTipo(e.target.value)
                    }}
                    className="ModalConfiguracion__selector"
                  >
                    <option value="" selected disabled hidden>Selecciona uno</option>
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
                  <p>Detalle {tipo && <span className="ModalConfiguracion__ejemplo">(Ej.: {tiposCambiosConfiguracion.find(t => t.texto === tipo)?.ejemplo})</span>}</p>
                  <input
                    value={detalle}
                    onChange={e => setDetalle(e.target.value)}
                    className="ModalConfiguracion__input"
                  />
                </label>
                <label>
                  Tu nombre
                  <input
                    value={nombre}
                    className="ModalConfiguracion__input"
                    onChange={e => setNombre(e.target.value)} 
                  />
                </label>
                <label>
                  Tu e-mail
                  <input
                    value={contacto}
                    className="ModalConfiguracion__input"
                    onChange={e => setContacto(e.target.value)} 
                    type="email"
                  />
                </label>
                <button
                  className="ModalConfiguracion__boton_enviar"
                  disabled={!detalle || !tipo  || !contacto || isLoading}
                >
                  <InlineIcon icon={iconoEnviar} /> Actualizar configuración
                </button>
              </form>
          }
        </div>
      </Draggable>
    </div>
  )
}

export default ModalConfiguracion
import classNames from 'classnames'
import './ModalExportacionAvanzada.css'

const ModalExportacionAvanzada = ({ email, visible, ocultar }) => {

  return (
    <div
      className={classNames({
        "ModalExportacionAvanzada": true,
        "ModalExportacionAvanzada--visible": visible,
      })}
    >
      <div className="ModalExportacionAvanzada__contenido">
        <h2>¡Éxito!</h2>
        <p>Enviaremos su reporte a<br/><strong>{email}</strong><br />dentro de los próximos minutos.</p>
        <button
          className="ModalExportacionAvanzada__boton"
          onClick={ocultar}
        >
          Aceptar
        </button>
      </div>
    </div>
  )
}

export default ModalExportacionAvanzada
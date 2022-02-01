import React from 'react'
import iconoRecargar from '@iconify/icons-mdi/refresh'
import './ErrorBoundary.css'
import { InlineIcon } from '@iconify/react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="ErrorBoundary">
          <div className="ErrorBoundary__contenedor">
            <h1>Lo sentimos, algo salió mal 😌</h1>
            <p>Presiona este botón para recargar la página</p>
            <button
              className="ErrorBoundary__boton_recargar"
              onClick={() => window.location.reload()}
            >
              <InlineIcon icon={iconoRecargar} />
            </button>
            <p>Si el problema persiste, contáctate con CERO para que te brindemos asistencia</p>
          </div>
        </div>
      )
    }
    return this.props.children 
  }
}

export default ErrorBoundary